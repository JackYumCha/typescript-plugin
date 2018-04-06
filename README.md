# typescript-plugin
TypeScript compiler that allows customized emit from TypeScript compiler.

It is the basis to write transpilers to generate other codes for Typescript.

# Installation

npm install tscp

# Usage

1. Define a plugins.json in the package.json folder.

```json
{
    "plugin": "./plugin.js"
}
```
*plugin* is the module name or namespace name in the plugin.
*./plugin.js* is file path to load the plugin file, relative to the package.json folder.

2. Add tscp script to the script section of your package.json.

```json
  "scripts": {
    "tscp": "node node_modules/tscp/tscp.js "
  }
```

3. Run the tscp script to compile a file or project:

```
npm run tscp files/demo.ts
```

# How it works?

The tscp will look for the *plugins.json* file to load and run each of the plugins in order.

# How to create and compile your own plugin?

This is the [plugin.ts](https://github.com/JackYumCha/typescript-plugin/blob/master/tsc/plugin.ts).

This repo only has minor modification of on top of the typescript release in the [tsc.ts](https://github.com/JackYumCha/typescript-plugin/blob/master/tsc/tsc.ts) file.

## To create your own plugin

1. Modify the [plugin.ts](https://github.com/JackYumCha/typescript-plugin/blob/master/tsc/plugin.ts). When you edit it, it is important to have ```/// <reference path="plugin.ts"/>``` in the [tsc.ts](https://github.com/JackYumCha/typescript-plugin/blob/master/tsc/tsc.ts) file. Otherwise, the vscode plugin may not be able to apply the typescript internal types intellisense to the file.

2. Compile it with [compile-plugin.cmd](https://github.com/JackYumCha/typescript-plugin/blob/master/compile-plugin.cmd).

