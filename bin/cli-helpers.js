"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const env_builder_1 = require("./env-builder");
var $pkg = require(`${process.cwd()}/package.json`);
class CliHelper {
    constructor() {
        this.loadCli();
    }
    loadCli() {
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
    setAction(action) {
        this.command
            .action((cmd) => {
            let options = this.getOptions(this.command);
            if (options.IsDebug) {
                console.log();
                console.dir(options);
            }
            action(options);
        });
    }
    process() {
        return commander.parse(process.argv);
    }
    getOptions(obj) {
        return new env_builder_1.AppOptions((obj.args != undefined && obj.args.length > 0)
            ? obj.args[0]
            : undefined, obj.debug, obj.check, obj.force, obj.summarize, !obj.warnings);
    }
}
exports.CliHelper = CliHelper;
//# sourceMappingURL=cli-helpers.js.map