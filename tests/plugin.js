var plugin;
(function (plugin) {
    function emit(fileNames, compilerOptions, compilerHost) {
        var program = ts.createProgram(fileNames, compilerOptions, compilerHost);
        var sourceFiles = program.getSourceFiles();
        sourceFiles.forEach(function (sourceFile, index, sourceFileArray) {
            console.log(sourceFile.fileName);
            sourceFile.statements.forEach(function (statement) {
                ts.sys.write(statement.kind.toString());
            });
            ts.sys.writeFile(sourceFile.fileName.replace(/\.ts$/ig, ".txt"), sourceFile.text);
        });
    }
    plugin.emit = emit;
    function bullentIndent(count) {
        var result = '';
        for (var i = 0; i < count; i++) {
            result += '\t';
        }
        return result;
    }
    var SyntaxKindTable = ['Unknown', 'EndOfFileToken', 'SingleLineCommentTrivia', 'MultiLineCommentTrivia', 'NewLineTrivia', 'WhitespaceTrivia', 'ShebangTrivia', 'ConflictMarkerTrivia', 'NumericLiteral', 'StringLiteral', 'RegularExpressionLiteral', 'NoSubstitutionTemplateLiteral', 'TemplateHead', 'TemplateMiddle', 'TemplateTail', 'OpenBraceToken', 'CloseBraceToken', 'OpenParenToken', 'CloseParenToken', 'OpenBracketToken', 'CloseBracketToken', 'DotToken', 'DotDotDotToken', 'SemicolonToken', 'CommaToken', 'LessThanToken', 'LessThanSlashToken', 'GreaterThanToken', 'LessThanEqualsToken', 'GreaterThanEqualsToken', 'EqualsEqualsToken', 'ExclamationEqualsToken', 'EqualsEqualsEqualsToken', 'ExclamationEqualsEqualsToken', 'EqualsGreaterThanToken', 'PlusToken', 'MinusToken', 'AsteriskToken', 'AsteriskAsteriskToken', 'SlashToken', 'PercentToken', 'PlusPlusToken', 'MinusMinusToken', 'LessThanLessThanToken', 'GreaterThanGreaterThanToken', 'GreaterThanGreaterThanGreaterThanToken', 'AmpersandToken', 'BarToken', 'CaretToken', 'ExclamationToken', 'TildeToken', 'AmpersandAmpersandToken', 'BarBarToken', 'QuestionToken', 'ColonToken', 'AtToken', 'EqualsToken', 'PlusEqualsToken', 'MinusEqualsToken', 'AsteriskEqualsToken', 'AsteriskAsteriskEqualsToken', 'SlashEqualsToken', 'PercentEqualsToken', 'LessThanLessThanEqualsToken', 'GreaterThanGreaterThanEqualsToken', 'GreaterThanGreaterThanGreaterThanEqualsToken', 'AmpersandEqualsToken', 'BarEqualsToken', 'CaretEqualsToken', 'Identifier', 'BreakKeyword', 'CaseKeyword', 'CatchKeyword', 'ClassKeyword', 'ConstKeyword', 'ContinueKeyword', 'DebuggerKeyword', 'DefaultKeyword', 'DeleteKeyword', 'DoKeyword', 'ElseKeyword', 'EnumKeyword', 'ExportKeyword', 'ExtendsKeyword', 'FalseKeyword', 'FinallyKeyword', 'ForKeyword', 'FunctionKeyword', 'IfKeyword', 'ImportKeyword', 'InKeyword', 'InstanceOfKeyword', 'NewKeyword', 'NullKeyword', 'ReturnKeyword', 'SuperKeyword', 'SwitchKeyword', 'ThisKeyword', 'ThrowKeyword', 'TrueKeyword', 'TryKeyword', 'TypeOfKeyword', 'VarKeyword', 'VoidKeyword', 'WhileKeyword', 'WithKeyword', 'ImplementsKeyword', 'InterfaceKeyword', 'LetKeyword', 'PackageKeyword', 'PrivateKeyword', 'ProtectedKeyword', 'PublicKeyword', 'StaticKeyword', 'YieldKeyword', 'AbstractKeyword', 'AsKeyword', 'AnyKeyword', 'AsyncKeyword', 'AwaitKeyword', 'BooleanKeyword', 'ConstructorKeyword', 'DeclareKeyword', 'GetKeyword', 'IsKeyword', 'ModuleKeyword', 'NamespaceKeyword', 'ReadonlyKeyword', 'RequireKeyword', 'NumberKeyword', 'SetKeyword', 'StringKeyword', 'SymbolKeyword', 'TypeKeyword', 'UndefinedKeyword', 'FromKeyword', 'GlobalKeyword', 'OfKeyword', 'QualifiedName', 'ComputedPropertyName', 'TypeParameter', 'Parameter', 'Decorator', 'PropertySignature', 'PropertyDeclaration', 'MethodSignature', 'MethodDeclaration', 'Constructor', 'GetAccessor', 'SetAccessor', 'CallSignature', 'ConstructSignature', 'IndexSignature', 'TypePredicate', 'TypeReference', 'FunctionType', 'ConstructorType', 'TypeQuery', 'TypeLiteral', 'ArrayType', 'TupleType', 'UnionType', 'IntersectionType', 'ParenthesizedType', 'ThisType', 'StringLiteralType', 'ObjectBindingPattern', 'ArrayBindingPattern', 'BindingElement', 'ArrayLiteralExpression', 'ObjectLiteralExpression', 'PropertyAccessExpression', 'ElementAccessExpression', 'CallExpression', 'NewExpression', 'TaggedTemplateExpression', 'TypeAssertionExpression', 'ParenthesizedExpression', 'FunctionExpression', 'ArrowFunction', 'DeleteExpression', 'TypeOfExpression', 'VoidExpression', 'AwaitExpression', 'PrefixUnaryExpression', 'PostfixUnaryExpression', 'BinaryExpression', 'ConditionalExpression', 'TemplateExpression', 'YieldExpression', 'SpreadElementExpression', 'ClassExpression', 'OmittedExpression', 'ExpressionWithTypeArguments', 'AsExpression', 'NonNullExpression', 'TemplateSpan', 'SemicolonClassElement', 'Block', 'VariableStatement', 'EmptyStatement', 'ExpressionStatement', 'IfStatement', 'DoStatement', 'WhileStatement', 'ForStatement', 'ForInStatement', 'ForOfStatement', 'ContinueStatement', 'BreakStatement', 'ReturnStatement', 'WithStatement', 'SwitchStatement', 'LabeledStatement', 'ThrowStatement', 'TryStatement', 'DebuggerStatement', 'VariableDeclaration', 'VariableDeclarationList', 'FunctionDeclaration', 'ClassDeclaration', 'InterfaceDeclaration', 'TypeAliasDeclaration', 'EnumDeclaration', 'ModuleDeclaration', 'ModuleBlock', 'CaseBlock', 'GlobalModuleExportDeclaration', 'ImportEqualsDeclaration', 'ImportDeclaration', 'ImportClause', 'NamespaceImport', 'NamedImports', 'ImportSpecifier', 'ExportAssignment', 'ExportDeclaration', 'NamedExports', 'ExportSpecifier', 'MissingDeclaration', 'ExternalModuleReference', 'JsxElement', 'JsxSelfClosingElement', 'JsxOpeningElement', 'JsxText', 'JsxClosingElement', 'JsxAttribute', 'JsxSpreadAttribute', 'JsxExpression', 'CaseClause', 'DefaultClause', 'HeritageClause', 'CatchClause', 'PropertyAssignment', 'ShorthandPropertyAssignment', 'EnumMember', 'SourceFile', 'JSDocTypeExpression', 'JSDocAllType', 'JSDocUnknownType', 'JSDocArrayType', 'JSDocUnionType', 'JSDocTupleType', 'JSDocNullableType', 'JSDocNonNullableType', 'JSDocRecordType', 'JSDocRecordMember', 'JSDocTypeReference', 'JSDocOptionalType', 'JSDocFunctionType', 'JSDocVariadicType', 'JSDocConstructorType', 'JSDocThisType', 'JSDocComment', 'JSDocTag', 'JSDocParameterTag', 'JSDocReturnTag', 'JSDocTypeTag', 'JSDocTemplateTag', 'SyntaxList', 'Count'];
})(plugin || (plugin = {}));
String.prototype.format = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var that = eval('this');
    return that.replace(/{\d+}/g, function (char) {
        var index = Number(char.substr(1, char.length - 2));
        return args[index];
    });
};
