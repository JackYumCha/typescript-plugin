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
