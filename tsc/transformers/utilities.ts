/* @internal */
namespace ts {
    export function getOriginalNodeId(node: Node) {
        node = getOriginalNode(node);
        return node ? getNodeId(node) : 0;
    }

    export interface ExternalModuleInfo {
        externalImports: (ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration)[]; // imports of other external modules
        externalHelpersImportDeclaration: ImportDeclaration | undefined; // import of external helpers
        exportSpecifiers: Map<ExportSpecifier[]>; // export specifiers by name
        exportedBindings: Identifier[][]; // exported names of local declarations
        exportedNames: Identifier[]; // all exported names local to module
        exportEquals: ExportAssignment | undefined; // an export= declaration if one was present
        hasExportStarsToExportValues: boolean; // whether this module contains export*
    }

    function getNamedImportCount(node: ImportDeclaration) {
        if (!(node.importClause && node.importClause.namedBindings)) return 0;
        const names = node.importClause.namedBindings;
        if (!names) return 0;
        if (!isNamedImports(names)) return 0;
        return names.elements.length;
    }

    function containsDefaultReference(node: NamedImportBindings) {
        if (!node) return false;
        if (!isNamedImports(node)) return false;
        return some(node.elements, isNamedDefaultReference);
    }

    function isNamedDefaultReference(e: ImportSpecifier) {
        return e.propertyName && e.propertyName.escapedText === InternalSymbolName.Default;
    }

    export function getImportNeedsImportStarHelper(node: ImportDeclaration) {
        return !!getNamespaceDeclarationNode(node) || (getNamedImportCount(node) > 1 && containsDefaultReference(node.importClause.namedBindings));
    }

    export function getImportNeedsImportDefaultHelper(node: ImportDeclaration) {
        return isDefaultImport(node) || (getNamedImportCount(node) === 1 && containsDefaultReference(node.importClause.namedBindings));
    }

    export function collectExternalModuleInfo(sourceFile: SourceFile, resolver: EmitResolver, compilerOptions: CompilerOptions): ExternalModuleInfo {
        const externalImports: (ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration)[] = [];
        const exportSpecifiers = createMultiMap<ExportSpecifier>();
        const exportedBindings: Identifier[][] = [];
        const uniqueExports = createMap<boolean>();
        let exportedNames: Identifier[];
        let hasExportDefault = false;
        let exportEquals: ExportAssignment;
        let hasExportStarsToExportValues = false;
        let hasImportStarOrImportDefault = false;

        for (const node of sourceFile.statements) {
            switch (node.kind) {
                case SyntaxKind.ImportDeclaration:
                    // import "mod"
                    // import x from "mod"
                    // import * as x from "mod"
                    // import { x, y } from "mod"
                    externalImports.push(<ImportDeclaration>node);
                    hasImportStarOrImportDefault = getImportNeedsImportStarHelper(<ImportDeclaration>node) || getImportNeedsImportDefaultHelper(<ImportDeclaration>node);
                    break;

                case SyntaxKind.ImportEqualsDeclaration:
                    if ((<ImportEqualsDeclaration>node).moduleReference.kind === SyntaxKind.ExternalModuleReference) {
                        // import x = require("mod")
                        externalImports.push(<ImportEqualsDeclaration>node);
                    }

                    break;

                case SyntaxKind.ExportDeclaration:
                    if ((<ExportDeclaration>node).moduleSpecifier) {
                        if (!(<ExportDeclaration>node).exportClause) {
                            // export * from "mod"
                            externalImports.push(<ExportDeclaration>node);
                            hasExportStarsToExportValues = true;
                        }
                        else {
                            // export { x, y } from "mod"
                            externalImports.push(<ExportDeclaration>node);
                        }
                    }
                    else {
                        // export { x, y }
                        for (const specifier of (<ExportDeclaration>node).exportClause.elements) {
                            if (!uniqueExports.get(idText(specifier.name))) {
                                const name = specifier.propertyName || specifier.name;
                                exportSpecifiers.add(idText(name), specifier);

                                const decl = resolver.getReferencedImportDeclaration(name)
                                    || resolver.getReferencedValueDeclaration(name);

                                if (decl) {
                                    multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(decl), specifier.name);
                                }

                                uniqueExports.set(idText(specifier.name), true);
                                exportedNames = append(exportedNames, specifier.name);
                            }
                        }
                    }
                    break;

                case SyntaxKind.ExportAssignment:
                    if ((<ExportAssignment>node).isExportEquals && !exportEquals) {
                        // export = x
                        exportEquals = <ExportAssignment>node;
                    }
                    break;

                case SyntaxKind.VariableStatement:
                    if (hasModifier(node, ModifierFlags.Export)) {
                        for (const decl of (<VariableStatement>node).declarationList.declarations) {
                            exportedNames = collectExportedVariableInfo(decl, uniqueExports, exportedNames);
                        }
                    }
                    break;

                case SyntaxKind.FunctionDeclaration:
                    if (hasModifier(node, ModifierFlags.Export)) {
                        if (hasModifier(node, ModifierFlags.Default)) {
                            // export default function() { }
                            if (!hasExportDefault) {
                                multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(node), getDeclarationName(<FunctionDeclaration>node));
                                hasExportDefault = true;
                            }
                        }
                        else {
                            // export function x() { }
                            const name = (<FunctionDeclaration>node).name;
                            if (!uniqueExports.get(idText(name))) {
                                multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(node), name);
                                uniqueExports.set(idText(name), true);
                                exportedNames = append(exportedNames, name);
                            }
                        }
                    }
                    break;

                case SyntaxKind.ClassDeclaration:
                    if (hasModifier(node, ModifierFlags.Export)) {
                        if (hasModifier(node, ModifierFlags.Default)) {
                            // export default class { }
                            if (!hasExportDefault) {
                                multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(node), getDeclarationName(<ClassDeclaration>node));
                                hasExportDefault = true;
                            }
                        }
                        else {
                            // export class x { }
                            const name = (<ClassDeclaration>node).name;
                            if (name && !uniqueExports.get(idText(name))) {
                                multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(node), name);
                                uniqueExports.set(idText(name), true);
                                exportedNames = append(exportedNames, name);
                            }
                        }
                    }
                    break;
            }
        }

        const externalHelpersModuleName = getOrCreateExternalHelpersModuleNameIfNeeded(sourceFile, compilerOptions, hasExportStarsToExportValues, hasImportStarOrImportDefault);
        const externalHelpersImportDeclaration = externalHelpersModuleName && createImportDeclaration(
            /*decorators*/ undefined,
            /*modifiers*/ undefined,
            createImportClause(/*name*/ undefined, createNamespaceImport(externalHelpersModuleName)),
            createLiteral(externalHelpersModuleNameText));

        if (externalHelpersImportDeclaration) {
            addEmitFlags(externalHelpersImportDeclaration, EmitFlags.NeverApplyImportHelper);
            externalImports.unshift(externalHelpersImportDeclaration);
        }

        return { externalImports, exportSpecifiers, exportEquals, hasExportStarsToExportValues, exportedBindings, exportedNames, externalHelpersImportDeclaration };
    }

    function collectExportedVariableInfo(decl: VariableDeclaration | BindingElement, uniqueExports: Map<boolean>, exportedNames: Identifier[]) {
        if (isBindingPattern(decl.name)) {
            for (const element of decl.name.elements) {
                if (!isOmittedExpression(element)) {
                    exportedNames = collectExportedVariableInfo(element, uniqueExports, exportedNames);
                }
            }
        }
        else if (!isGeneratedIdentifier(decl.name)) {
            const text = idText(decl.name);
            if (!uniqueExports.get(text)) {
                uniqueExports.set(text, true);
                exportedNames = append(exportedNames, decl.name);
            }
        }
        return exportedNames;
    }

    /** Use a sparse array as a multi-map. */
    function multiMapSparseArrayAdd<V>(map: V[][], key: number, value: V): V[] {
        let values = map[key];
        if (values) {
            values.push(value);
        }
        else {
            map[key] = values = [value];
        }
        return values;
    }

    /**
     * Used in the module transformer to check if an expression is reasonably without sideeffect,
     *  and thus better to copy into multiple places rather than to cache in a temporary variable
     *  - this is mostly subjective beyond the requirement that the expression not be sideeffecting
     */
    export function isSimpleCopiableExpression(expression: Expression) {
        return isStringLiteralLike(expression) ||
            expression.kind === SyntaxKind.NumericLiteral ||
            isKeyword(expression.kind) ||
            isIdentifier(expression);
    }
}