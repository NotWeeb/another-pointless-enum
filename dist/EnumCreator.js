"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnumCreator = /** @class */ (function () {
    /**
     * @constructor
     * @param {*} args - Ability to set any arguments to be parsed automatically. For options to work you should pass them BEFORE enum declaration
     */
    function EnumCreator() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._handledOptions = false;
        this.enums = {
            set: this.set.bind(this),
            update: this.update.bind(this),
            has: this.has.bind(this)
        };
        this.strict = true;
        this.visibleEnums = true;
        this.editableEnums = false;
        // private allowDuplicateValues: boolean = false; - removed until I figure out what i broke with these options
        this._allowedOptions = ["strict", "visibleEnums", "editableEnums"];
        this._keys = [];
        this._values = [];
        for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
            var arg = args_1[_a];
            switch (typeof arg) {
                case 'object':
                    Array.isArray(arg) ? this._definePotentialMultiple(arg) : this._handleOptions(arg);
                    break;
                case 'string':
                    this._define(arg);
                    break;
                default: throw new TypeError("Invalid argument detected: \"" + typeof arg + "\" was provided. Expected STRING, ARRAY, OBJECT.");
            }
        }
        // @ts-ignore
        return this.enums;
    }
    /**
     * Serves literally no purpose, use .set() instead.
     * @param {string} key
     * @param {string|boolean} value
     * @public
     * @return {set}
     */
    EnumCreator.prototype.update = function (key, value) {
        console.log("WARN :: Update is now deprecated (I feel like a big boy saying this) use 'set' instead.");
        return this.set(key, value);
    };
    /**
     * Manually define a key, value (or just key) enum.
     * @param {string} key
     * @param {string|boolean} value
     * @public
     * @return {_define}
     */
    EnumCreator.prototype.set = function (key, value) {
        return this._define([key, value]);
    };
    /**
     * Check to see if an enum exists using the key provided.
     * @param {string} key - Not case sensitive.
     * @public
     * @return {boolean}
     */
    EnumCreator.prototype.has = function (key) {
        // @ts-ignore
        return (this._keys.includes(key.toUpperCase()));
    };
    /**
     * Takes an object from constructor's arguments and parses it as "options" for the enums.
     * @param {object} options
     * @private
     * @return {string}
     */
    EnumCreator.prototype._handleOptions = function (options) {
        if (this._handledOptions) {
            console.log("WARN :: Attempt to use more options, remove the extra OBJECT in your Enum declaration. (Ignoring)");
            return;
        }
        this._handledOptions = true;
        var optionNames = Object.getOwnPropertyNames(options);
        var _loop_1 = function (opt) {
            // @ts-ignore
            var sameValueType = this_1._allowedOptions.includes(opt) && typeof this_1[opt] === typeof options[opt];
            var err = new TypeError("Invalid option. Please check README for valid options.");
            // @ts-ignore
            if (!this_1._allowedOptions.includes(opt))
                throw err;
            if (!sameValueType) {
                err.message = "Invalid option value. Values must be the same as specified in the README.";
                throw err;
            }
            Object.defineProperty(this_1, opt, {
                get: function () { return options[opt]; },
                configurable: false
            });
        };
        var this_1 = this;
        for (var _i = 0, optionNames_1 = optionNames; _i < optionNames_1.length; _i++) {
            var opt = optionNames_1[_i];
            _loop_1(opt);
        }
    };
    ;
    /**
     * Used to create a randomized string
     * @static
     * @return {string}
     */
    EnumCreator._randomString = function (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // 0123456789
        for (var i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    };
    /**
     * The internal function used to check that the random string it is creating doesn't exist already
     * @private
     * @return {string}
     */
    EnumCreator.prototype._createValue = function () {
        var value = EnumCreator._randomString(4);
        // @ts-ignore
        while (this._values.includes(value)) {
            value = EnumCreator._randomString(4);
        }
        return value;
    };
    /**
     * The internal function used to define arrays of key or key/value enums
     * @param {string|array} arg - Represents a key(string) or an array of multiple key value arrays
     * @private
     * @return {void}
     */
    EnumCreator.prototype._definePotentialMultiple = function (arg) {
        var _this = this;
        if (typeof arg === "object" && !Array.isArray(arg))
            throw new TypeError("You cannot define objects as an enum. (Yet?)");
        var index = arg[0], second = arg[1];
        if (typeof index === "object" && Array.isArray(index) || typeof second === "object" && Array.isArray(second)) {
            for (var _i = 0, arg_1 = arg; _i < arg_1.length; _i++) {
                var x = arg_1[_i];
                if (typeof x === "string") {
                    this._define(x);
                    continue;
                }
                var key = x[0], value = x[1];
                if (typeof x === "object" && Array.isArray(x) && x.length > 2) {
                    x.map(function (a) {
                        if (typeof a === "object") {
                            _this._definePotentialMultiple(a);
                        }
                        else {
                            _this._define(a);
                        }
                    });
                    continue;
                }
                if (typeof key === "object" && Array.isArray(key)) {
                    this._definePotentialMultiple(key);
                }
                else if (typeof value === "object" && Array.isArray(value)) {
                    this._definePotentialMultiple(value);
                }
                else {
                    this._define([key, value]);
                }
            }
        }
        else {
            if (arg.length > 2) {
                arg.map(function (a) {
                    if (typeof a === "object") {
                        _this._definePotentialMultiple(a);
                    }
                    else {
                        _this._define(a);
                    }
                });
            }
            else {
                this._define(arg);
            }
        }
    };
    /**
     * The internal function used to define the enums to EnumCreator.enums
     * @param {string|array} arg - Represents a key(string) or key and value(array{2})
     * @private
     * @return {string|number}
     */
    EnumCreator.prototype._define = function (arg) {
        if (typeof arg === "object" && !Array.isArray(arg))
            throw new TypeError("You cannot define objects as an enum. (Yet?)");
        var key = arg, value;
        switch (typeof arg) {
            case 'string':
                key = arg;
                value = this._createValue();
                break;
            case 'object': // "array"
                key = arg[0], value = arg[1];
                if (value === undefined || value === null)
                    value = this._createValue();
                break;
        }
        // @ts-ignore
        if (!["string", "number"].includes(typeof value))
            throw new TypeError("\"" + value + "\" is type " + (typeof value).toUpperCase() + ". Expected type STRING or NUMBER.");
        if (typeof key !== "string")
            throw new TypeError("\"" + key + "\" is type " + (typeof key).toUpperCase() + ". Enum names must be type STRING");
        // @ts-ignore
        key = key.toUpperCase();
        key = key
            // remove unneeded characters for enums
            .replace(/[^A-z\s\d][\\^]?|[ +]|[0-9]/g, '_')
            // replace any repeated `_` with a single `_`
            .replace(/_+/g, '_');
        // @ts-ignore
        var keyExists = this._keys.includes(key), 
        // @ts-ignore
        valueExists = this._values.includes(value);
        // @ts-ignore
        var existingType = keyExists ? key : value;
        if (this.strict && (keyExists || valueExists))
            throw new Error("There is already an enum with the " + (keyExists ? "name" : "value") + ": \"" + existingType + "\".");
        // @ts-ignore
        this._keys.push(key);
        // @ts-ignore
        this._values.push(value);
        var attributes = {
            // @ts-ignore
            get: function () { return value; },
            enumerable: this.visibleEnums
        };
        if (this.editableEnums) {
            // @ts-ignore
            attributes.set = function (newValue) {
                value = newValue;
            };
        }
        else if (!this.editableEnums && this.strict) {
            // @ts-ignore
            attributes.set = function () {
                throw new Error("Tried editing a static enum whilst in strict mode. Check README.md.");
            };
        }
        // @ts-ignore
        Object.defineProperty(this.enums, key, attributes);
        // @ts-ignore
        return value;
    };
    return EnumCreator;
}());
exports.EnumCreator = EnumCreator;
