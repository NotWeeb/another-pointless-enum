
export class EnumCreator {


    private _keys: string[];
    private _values: string[];
    private _handledOptions = false;

    private enums: object = {
        set: this.set.bind(this),
        update: this.update.bind(this),
        has: this.has.bind(this)
    };

    private strict: boolean = true;
    private visibleEnums: boolean = true;
    private editableEnums: boolean = false;
    // private allowDuplicateValues: boolean = false; - removed until I figure out what i broke with these options

    private _allowedOptions: string[] = ["strict", "visibleEnums", "editableEnums"];




    /**
     * @constructor
     * @param {*} args - Ability to set any arguments to be parsed automatically. For options to work you should pass them BEFORE enum declaration
     */
    constructor(...args : any) {

        this._keys = [];
        this._values = [];

        for (const arg of args) {
            switch (typeof arg) {
                case 'object': Array.isArray(arg) ? this._definePotentialMultiple(arg) : this._handleOptions(arg); break;
                case 'string': this._define(arg); break;
                default: this._HandleError(new TypeError(`Invalid argument detected: "${typeof arg}" was provided. Expected STRING, ARRAY, OBJECT.`)); break;
            }
        }

        // @ts-ignore
        return this.enums;
    }

    private _HandleError (E : (Error | TypeError | RangeError | SyntaxError)) {
        E.stack = E.stack && E.stack.split("\n").filter(line => !/(another-pointless-enum)/.test(line)).join("\n") || "No stack found.";
        throw E;
    }

    /**
     * Serves literally no purpose, use .set() instead.
     * @param {string} key
     * @param {string|boolean} value
     * @public
     * @return {set}
     */
    public update (key : string, value : (string | boolean)) : any {
        console.log("WARN :: Update is now deprecated (I feel like a big boy saying this) use 'set' instead.");
        return this.set(key, value);
    }




    /**
     * Manually define a key, value (or just key) enum.
     * @param {string} key
     * @param {string|boolean} value
     * @public
     * @return {_define}
     */
    public set (key : string, value : (string | boolean)) : any {
        return this._define([key, value]);
    }




    /**
     * Check to see if an enum exists using the key provided.
     * @param {string} key - Not case sensitive.
     * @public
     * @return {boolean}
     */
    public has (key : string) : boolean {
        // @ts-ignore
        return (this._keys.includes(key.toUpperCase()));
    }




    /**
     * Takes an object from constructor's arguments and parses it as "options" for the enums.
     * @param {object} options
     * @private
     * @return {string}
     */
    private _handleOptions (options : any) : void {
        if (this._handledOptions) {
            console.log("WARN :: Attempt to use more options, remove the extra OBJECT in your Enum declaration. (Ignoring)");
            return;
        }
        this._handledOptions = true;

        const optionNames = Object.getOwnPropertyNames(options);

        for (const opt of optionNames) {

            // @ts-ignore
            const sameValueType = this._allowedOptions.includes(opt) && typeof this[opt] === typeof options[opt];

            const err = new TypeError("Invalid option. Please check README for valid options.");
            // @ts-ignore
            if (!this._allowedOptions.includes(opt)) return this._HandleError(err);

            if (!sameValueType) {
                err.message = "Invalid option value. Values must be the same as specified in the README.";
                return this._HandleError(err);
            }

            Object.defineProperty(this, opt, {
                get: () => options[opt],
                configurable: false
            });
        }

    };




    /**
     * Used to create a randomized string
     * @static
     * @return {string}
     */
    static _randomString (length: number) : string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // 0123456789
        for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }




    /**
     * The internal function used to check that the random string it is creating doesn't exist already
     * @private
     * @return {string}
     */
    private _createValue () : string {
        let value = EnumCreator._randomString(4);

        // @ts-ignore
        while(this._values.includes(value)) {
            value = EnumCreator._randomString(4);
        }

        return value;
    }





    /**
     * The internal function used to define arrays of key or key/value enums
     * @param {string|array} arg - Represents a key(string) or an array of multiple key value arrays
     * @private
     * @return {void}
     */
    private _definePotentialMultiple (arg : object) : void {
        if (typeof arg === "object" && !Array.isArray(arg)) return this._HandleError(new TypeError("You cannot define objects as an enum. (Yet?)"));

        const [index, second] = arg;

        if (typeof index === "object" && Array.isArray(index) || typeof second === "object" && Array.isArray(second)) {
            for (const x of arg) {

                if (typeof x === "string") {
                    this._define(x);
                    continue;
                }

                const [ key, value ] = x;

                if (typeof x === "object" && Array.isArray(x) && x.length > 2) {
                    x.map(a => {
                        if (typeof a === "object") {
                            this._definePotentialMultiple(a)
                        } else {
                            this._define(a)
                        }
                    });
                    continue;
                }

                if (typeof key === "object" && Array.isArray(key)) {
                    this._definePotentialMultiple(key);
                } else if (typeof value === "object" && Array.isArray(value)) {
                    this._definePotentialMultiple(value);
                } else {
                    this._define([key, value]);
                }

            }
        } else {
            if (arg.length > 2) {
                arg.map(a => {
                    if (typeof a === "object") {
                        this._definePotentialMultiple(a)
                    } else {
                        this._define(a)
                    }
                });
            } else {
                this._define(arg);
            }
        }
    }




    /**
     * The internal function used to define the enums to EnumCreator.enums
     * @param {string|array} arg - Represents a key(string) or key and value(array{2})
     * @private
     * @return {string|number}
     */
    private _define (arg : (string | object)) : any {
        if (typeof arg === "object" && !Array.isArray(arg)) return this._HandleError(new TypeError("You cannot define objects as an enum. (Yet?)"));

        let key = arg,
            value: string;

        switch (typeof arg) {
            case 'string':
                key = arg;
                value = this._createValue();
                break;
            case 'object': // "array"
                [key, value] = arg;
                if (value === undefined || value === null) value = this._createValue();
                break;
        }

        // @ts-ignore
        if (!["string", "number"].includes(typeof value)) return this._HandleError(new TypeError(`"${value}" is type ${(typeof value).toUpperCase()}. Expected type STRING or NUMBER.`));
        if (typeof key !== "string") return this._HandleError(new TypeError(`"${key}" is type ${(typeof key).toUpperCase()}. Enum names must be type STRING`));
        // @ts-ignore
        key = key.toUpperCase();

        key = key
            // remove unneeded characters for enums
            .replace(/[^A-z\s\d][\\^]?|[ +]|[0-9]/g, '_')
            // replace any repeated `_` with a single `_`
            .replace(/_+/g, '_');

        // @ts-ignore
        const keyExists = this._keys.includes(key),
        // @ts-ignore
              valueExists = this._values.includes(value);

        // @ts-ignore
        const existingType = keyExists ? key : value;

        if (this.strict && (keyExists || valueExists)) return this._HandleError(new Error(`There is already an enum with the ${keyExists ? "name" : "value"}: "${existingType}".`));

        // @ts-ignore
        this._keys.push(key);
        // @ts-ignore
        this._values.push(value);

        let attributes = {
            // @ts-ignore
            get: () => value,
            enumerable: this.visibleEnums
        };

        if (this.editableEnums) {
            // @ts-ignore
            attributes.set = (newValue: any) => {
                value = newValue;
            }
        } else if (!this.editableEnums && this.strict) {
            // @ts-ignore
            attributes.set = () => {
                throw new Error("Tried editing a static enum whilst in strict mode. Check README.md.");
            }
        }

        // @ts-ignore
        Object.defineProperty(this.enums, key, attributes);

        // @ts-ignore
        return value;
    }




}