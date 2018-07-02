#!/usr/bin/env node

import { CliHelper } from './cli-helpers';
import { EnvBuilder, AppOptions } from './env-builder';

var cli = new CliHelper();

cli.setAction((options: AppOptions): void => {
        let builder = new EnvBuilder(options);
        builder.Build()
        .then(() => console.log('Done!'))
        .catch((error) => console.error(error));
    });

cli.process();
