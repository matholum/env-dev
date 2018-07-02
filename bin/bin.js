#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_helpers_1 = require("./cli-helpers");
const env_builder_1 = require("./env-builder");
var cli = new cli_helpers_1.CliHelper();
cli.setAction((options) => {
    let builder = new env_builder_1.EnvBuilder(options);
    builder.Build()
        .then(() => console.log('Done!'))
        .catch((error) => console.error(error));
});
cli.process();
//# sourceMappingURL=bin.js.map