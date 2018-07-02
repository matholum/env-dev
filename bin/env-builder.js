"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors");
const fs = require("fs-extra");
var $pkg = require(`${process.cwd()}/package.json`);
class AppOptions {
    constructor(env, isDebug, isCheck, isForce, summarize, noWarnings) {
        this._env = env || 'local';
        this._isDebug = isDebug || false;
        this._isCheck = isCheck || false;
        this._isForce = isForce || false;
        this._summarize = summarize || false;
        this._noWarnings = noWarnings || false;
        this._debugFunction = (this.IsDebug)
            ? (message) => { console.debug(colors.magenta(message)); }
            : (message) => { };
        this._logFunction =
            (message) => { console.log(message); };
        this._warnFunction = (!this.NoWarnings)
            ? (message) => { console.warn(colors.yellow(message)); }
            : (message) => { };
        this._errorFunction =
            (message) => {
                console.error(colors.red(message));
                process.exit(1);
            };
    }
    get Environment() {
        return this._env;
    }
    get IsDebug() {
        return this._isDebug;
    }
    set IsDebug(value) {
        this._isDebug = value;
    }
    get IsCheck() {
        return this._isCheck;
    }
    set IsCheck(value) {
        this._isCheck = value;
    }
    get IsForce() {
        return this._isForce;
    }
    set IsForce(value) {
        this._isForce = value;
    }
    get NoWarnings() {
        return this._noWarnings;
    }
    set NoWarnings(value) {
        this._noWarnings = value;
    }
    get Summerize() {
        return this._summarize;
    }
    set Summerize(value) {
        this._summarize = value;
    }
    get DebugFunction() {
        return this._debugFunction;
    }
    set DebugFunction(value) {
        this._debugFunction = value;
    }
    get LogFunction() {
        return this._logFunction;
    }
    set LogFunction(value) {
        this._logFunction = value;
    }
    get WarnFunction() {
        return this._warnFunction;
    }
    set WarnFunction(value) {
        this._warnFunction = value;
    }
    get ErrorFunction() {
        return this._errorFunction;
    }
    set ErrorFunction(value) {
        this._errorFunction = value;
    }
}
exports.AppOptions = AppOptions;
class EnvBuilder {
    constructor(options) {
        this._options = options || new AppOptions();
        this._log = this._options.LogFunction;
        this._debug = this._options.DebugFunction;
        this._warn = this._options.WarnFunction;
        this._error = this._options.ErrorFunction;
    }
    Build() {
        return new Promise((resolve, reject) => {
            if ($pkg != undefined
                && $pkg.environments != undefined
                && $pkg.environments[this._options.Environment] != undefined) {
                let verb = (this._options.IsCheck)
                    ? 'would have been written'
                    : 'written';
                this._log(`Environment data for '${this._options.Environment}' ${verb} to .env.json...`);
                let config = $pkg.environments[this._options.Environment];
                if (this._options.IsDebug) {
                    console.debug(config);
                }
                if (!this._options.IsCheck) {
                    fs.writeFile(`${process.cwd()}/.env.json`, JSON.stringify(config, null, 4), { flag: "w+" })
                        .then(resolve)
                        .catch(reject);
                }
                else {
                    resolve();
                }
            }
            else {
                let errorMsg = 'Environment not found!';
                this._error(errorMsg);
                reject(errorMsg);
            }
        });
    }
}
exports.EnvBuilder = EnvBuilder;
//# sourceMappingURL=env-builder.js.map