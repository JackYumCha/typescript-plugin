
function loadPlugins() {
    var nodejsFS = require("fs");
    // this will load plugin from CurrentDirectory, which is where the folder of current commandline.
    // theoretically, that should be the package.json folder to find this plugin.json
    return JSON.parse(nodejsFS.readFileSync('./plugin.json', 'utf8').toString());
}
function runPlugins(rootFileNames, compilerOptions, pluginCompilerHost) {
    var plugins = loadPlugins();
    for (var key in plugins) {
        var filename = plugins[key];
        if (typeof filename == 'string') {
            var plugin = requireFromString(filename, key).Plugin;
            plugin.init(ts);
            plugin.emit(rootFileNames, compilerOptions, pluginCompilerHost);
        }
    }
}
function requireFromString(filename, pluginName, opts) {
    var nodejsFS = require("fs");
    var nodejsPath = require("path");
    var code = nodejsFS.readFileSync(filename, 'utf8').toString();
    code = "var ts;\n" + code + ("\n" + pluginName + ".init = function(_ts) { ts = _ts; };\n exports.Plugin = " + pluginName + ";");
    if (typeof filename === 'object') {
        opts = filename;
        filename = undefined;
    }
    opts = opts || {};
    filename = filename || '';
    opts.appendPaths = opts.appendPaths || [];
    opts.prependPaths = opts.prependPaths || [];
    if (typeof code !== 'string') {
        throw new Error('code must be a string, not ' + typeof code);
    }
    var paths = module.constructor._nodeModulePaths(nodejsPath.dirname(filename));
    var parent = module.parent;
    var m = new module.constructor(filename, parent);
    m.filename = filename;
    m.paths = [].concat(opts.prependPaths).concat(paths).concat(opts.appendPaths);
    m._compile(code, filename);
    var exports = m.exports;
    parent && parent.children && parent.children.splice(parent.children.indexOf(m), 1);
    return exports;
}