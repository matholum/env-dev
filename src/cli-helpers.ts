import * as commander from 'commander'

import { AppOptions } from './env-builder';

var $pkg = require(`${process.cwd()}/package.json`);

export interface FileCommandAction {
    (options: AppOptions): void;
}

export class CliHelper {

    private command: any;

    constructor() {
        this.loadCli();
    }

    private loadCli() {
        this.command = commander
            .version($pkg.version, '-v, --version')
            .description($pkg.description)
            .usage('[options] <environment>')
            .option('-c, --check, --dry', 'Simulate without touching the file system')
            .option('-d, --debug', 'Show debug output')
            .option('-f, --force', 'Continue despite JSPM or file system errors')
            .option('-s, --summarize', 'Summarize console output')
            .option('--no-warnings', 'Hide warning messages');
    }

    public setAction(action: FileCommandAction) {
        this.command
            .action((cmd: commander.Command) => {
                let options = this.getOptions(this.command);

                if(options.IsDebug) {
                    console.log();
                    console.dir(options);
                }

                action(options);
            });
    }

    public process(): any {
        return commander.parse(process.argv);
    }

    private getOptions(obj: any): AppOptions {
        return new AppOptions(
            (obj.args != undefined && obj.args.length > 0)
                ? obj.args[0]
                : undefined,
            obj.debug,
            obj.check,
            obj.force,
            obj.summarize,
            !obj.warnings
        );
    }
}