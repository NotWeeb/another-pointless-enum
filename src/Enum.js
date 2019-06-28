const random = require("./randomStr.js");


class EnumClass {
	
	/**
	 * @param enums
	 * @param allowDuplicateValues
	 * @returns {EnumClass}
	 */
	constructor(
		enums = [],
		{ allowDuplicateValues = true } = {}
	) {
		
		this._values = new Map();
		this._defaultValues = [];
		
		this.allowDuplicateValues = allowDuplicateValues;
		
		enums.forEach(args => this._define(args));
		
		return this;
	}
	
	/**
	 * @param key
	 * @returns {string}
	 * @private
	 */
	_defaultValue (key) {
		if (typeof key === 'object' && Array.isArray(key)) {
			return key[0].toUpperCase();
		} else {
			return key.toUpperCase();
		}
	}
	
	/**
	 * @param key
	 * @returns {boolean}
	 */
	has(key) {
		if (!key) throw "No key provided, can't check if exists.";
		return Object.getOwnPropertyNames(this).includes(key.toUpperCase());
	}
	
	/**
	 * @param key
	 * @param val
	 * @returns {*}
	 */
	set(key, val = this._defaultValue(key)) {
		
		if (typeof key === 'object' && Array.isArray(key)) {
			return key.forEach(this._define.bind(this));
		}
		
		if (key === undefined || key === null) throw "No key provided, cannot set enum.";
		
		this._define([key, val]);
		
		return this[key.toUpperCase()];
	}
	
	/**
	 * @param key
	 * @param val
	 * @returns {*}
	 */
	update(key, val = this._defaultValue(key)) {
		
		if (key === undefined || key === null) throw "No key provided, cannot update enum.";
		
		if (!this[key.toUpperCase()]) throw `No enum with name "${key.toUpperCase()}" was found, cannot update.`;
		this._define([key, val], true);
		
		return this[key.toUpperCase()];
	}
	
	/**
	 * @param keyOrArr
	 * @param updating
	 * @returns {*}
	 * @private
	 */
	_define(keyOrArr, updating = false) {
		
		let key = keyOrArr;
		let val = this._defaultValue(key);
		
		let custom = true;
		
		if (typeof keyOrArr === 'object' && Array.isArray(keyOrArr)) {
			const [newKey, newVal = this._defaultValue(newKey)] = keyOrArr;
			key = newKey;
			val = newVal;
		}
		
		if (key === undefined || key === null) throw "No key provided, cannot define enum.";
		
		const existingValue = this._values.get(val);
		if (existingValue && !this.allowDuplicateValues) throw `Value "${val}" already exists in enums as "${existingValue.toUpperCase()}".`;
		this._values.set(val, key);
		
		if (!updating && this.has(key)) throw `A key with name "${key.toUpperCase()}" already exists.`;
		if (Object.getOwnPropertyNames(this).includes(key)) throw `Illegal enum key.`;
		
		if (val === this._defaultValue(key)) {
			custom = false;
		}
		
		Object.defineProperty(this, key.toUpperCase(), { get: () => `enum::${custom && "<custom>::" || ""}${val.replace(/[^A-z\s\d][\\^]?|[ +]/g, '.').replace(/\.+/g, '.')}`, configurable: true });
		
		return this[key.toUpperCase()];
		
	}
	
}

/**
 * @param args
 * @returns {EnumClass}
 * @constructor
 */
global.Enum = function(...args) {
	return new.target ? this.constructor(...args) : new EnumClass(...args)
};