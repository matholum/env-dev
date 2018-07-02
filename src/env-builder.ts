
import * as colors from 'colors'
import * as fs from 'fs-extra'

var $pkg = require(`${process.cwd()}/package.json`);

export interface MessageOutputFunction {
    (message: string): void;
}
export class AppOptions {
    constructor(
        env?: string,
        isDebug?: boolean,
        isCheck?: boolean,
        isForce?: boolean,
        summarize?: boolean,
        noWarnings?: boolean
    ) {
        this._env = env || 'local';
        this._isDebug = isDebug || false;
        this._isCheck = isCheck || false;
        this._isForce = isForce || false;
        this._summarize = summarize || false;
        this._noWarnings = noWarnings || false;

        this._debugFunction = (this.IsDebug)
            ? (message: string): void => { console.debug(colors.magenta(message)); }
            : (message: string): void => { };

        this._logFunction =
            (message: string): void => { console.log(message); };

        this._warnFunction = (!this.NoWarnings)
            ? (message: string): void => { console.warn(colors.yellow(message)); }
            : (message: string): void => { };

        this._errorFunction =
            (message: string): void => {
                console.error(colors.red(message));

                process.exit(1);
            };
    }

    private _env: string;
    public get Environment(): string {
        return this._env;
    }

    private _isDebug: boolean;
    public get IsDebug(): boolean {
        return this._isDebug;
    }
    public set IsDebug(value: boolean) {
        this._isDebug = value;
    }

    private _isCheck: boolean;
    public get IsCheck(): boolean {
        return this._isCheck;
    }
    public set IsCheck(value: boolean) {
        this._isCheck = value;
    }

    private _isForce: boolean;
    public get IsForce(): boolean {
        return this._isForce;
    }
    public set IsForce(value: boolean) {
        this._isForce = value;
    }

    private _noWarnings: boolean;
    public get NoWarnings(): boolean {
        return this._noWarnings;
    }
    public set NoWarnings(value: boolean) {
        this._noWarnings = value;
    }

    private _summarize: boolean;
    public get Summerize(): boolean {
        return this._summarize;
    }
    public set Summerize(value: boolean) {
        this._summarize = value;
    }

    private _debugFunction: MessageOutputFunction;
    public get DebugFunction(): MessageOutputFunction {
        return this._debugFunction;
    }
    public set DebugFunction(value: MessageOutputFunction) {
        this._debugFunction = value;
    }

    private _logFunction: MessageOutputFunction;
    public get LogFunction(): MessageOutputFunction {
        return this._logFunction;
    }
    public set LogFunction(value: MessageOutputFunction) {
        this._logFunction = value;
    }

    private _warnFunction: MessageOutputFunction;
    public get WarnFunction(): MessageOutputFunction {
        return this._warnFunction;
    }
    public set WarnFunction(value: MessageOutputFunction) {
        this._warnFunction = value;
    }

    private _errorFunction: MessageOutputFunction;
    public get ErrorFunction(): MessageOutputFunction {
        return this._errorFunction;
    }
    public set ErrorFunction(value: MessageOutputFunction) {
        this._errorFunction = value;
    }
}

export class EnvBuilder {
    protected _options: AppOptions;

    protected _log: MessageOutputFunction;
    protected _debug: MessageOutputFunction;
    protected _warn: MessageOutputFunction;
    protected _error: MessageOutputFunction;

    constructor(
        options?: AppOptions
    ) {
        this._options = options || new AppOptions();

        this._log = this._options.LogFunction;
        this._debug = this._options.DebugFunction;
        this._warn = this._options.WarnFunction;
        this._error = this._options.ErrorFunction;
    }

    public Build(): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            if($pkg != undefined 
                && $pkg.environments != undefined 
                && $pkg.environments[this._options.Environment] != undefined
            ) {
                let verb: string = (this._options.IsCheck)
                    ? 'would have been written'
                    : 'written';
                    
                this._log(`Environment data for '${this._options.Environment}' ${verb} to .env.json...`);

                let config = $pkg.environments[this._options.Environment];

                if(this._options.IsDebug) {
                    console.debug(config);
                }

                if(!this._options.IsCheck) {
                    fs.writeFile(
                        `${process.cwd()}/.env.json`,
                        JSON.stringify(config, null, 4),
                        { flag: "w+" }
                    )
                        .then(resolve)
                        .catch(reject);
                } else {
                    resolve();
                }
            } else {
                let errorMsg: string = 'Environment not found!';
                this._error(errorMsg);

                reject(errorMsg);
            }
        });
    }
}