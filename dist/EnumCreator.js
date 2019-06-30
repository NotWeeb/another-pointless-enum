"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnumCreator = (function () {
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
        this.allowDuplicateValues = false;
        this._allowedOptions = ["strict", "allowDuplicateValues", "visibleEnums", "editableEnums"];
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
        return this.enums;
    }
    EnumCreator.prototype.update = function (key, value) {
        console.log("WARN :: Update is now deprecated (I feel like a big boy saying this) use 'set' instead.");
        return this.set(key, value);
    };
    EnumCreator.prototype.set = function (key, value) {
        return this._define([key, value]);
    };
    EnumCreator.prototype.has = function (key) {
        return (this._keys.includes(key));
    };
    EnumCreator.prototype._handleOptions = function (options) {
        if (this._handledOptions) {
            console.log("WARN :: Attempt to use more options, remove the extra OBJECT in your Enum declaration. (Ignoring)");
            return;
        }
        this._handledOptions = true;
        var optionNames = Object.getOwnPropertyNames(options);
        var _loop_1 = function (opt) {
            var sameValueType = this_1._allowedOptions.includes(opt) && typeof this_1[opt] === typeof options[opt];
            var err = new TypeError("Invalid option. Please check README for valid options.");
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
    EnumCreator._randomString = function (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (var i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    };
    EnumCreator.prototype._createValue = function () {
        var value = EnumCreator._randomString(4);
        while (this._values.includes(value)) {
            value = EnumCreator._randomString(4);
        }
        return value;
    };
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
    EnumCreator.prototype._define = function (arg) {
        if (typeof arg === "object" && !Array.isArray(arg))
            throw new TypeError("You cannot define objects as an enum. (Yet?)");
        var key = arg, value;
        switch (typeof arg) {
            case 'string':
                key = arg;
                value = this._createValue();
                break;
            case 'object':
                key = arg[0], value = arg[1];
                if (value === undefined || value === null)
                    value = this._createValue();
                break;
        }
        if (typeof key !== "string")
            throw new TypeError("\"" + key + "\" is type " + (typeof key).toUpperCase() + ". Enum names must be type STRING");
        key = key.toUpperCase();
        key = key
            .replace(/[^A-z\s\d][\\^]?|[ +]|[0-9]/g, '_')
            .replace(/_+/g, '_');
        var keyExists = this._keys.includes(key), valueExists = this._values.includes(value);
        var existingType = keyExists ? key : value;
        if (this.strict && (keyExists || valueExists))
            throw new Error("There is already an enum with the " + (keyExists ? "name" : "value") + ": \"" + existingType + "\".");
        this._keys.push(key);
        this._values.push(value);
        var attributes = {
            get: function () { return value; },
            enumerable: this.visibleEnums
        };
        if (this.editableEnums) {
            attributes.set = function (newValue) {
                value = newValue;
            };
        }
        else if (!this.editableEnums && this.strict) {
            attributes.set = function () {
                throw new Error("Tried editing a static enum whilst in strict mode. Check README.md.");
            };
        }
        Object.defineProperty(this.enums, key, attributes);
        return value;
    };
    return EnumCreator;
}());
exports.EnumCreator = EnumCreator;
