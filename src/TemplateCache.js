const _ = require("lodash");

module.exports = class TemplateCache {
    constructor(options) {
        this._cache = new Map();
        this._isEnable = options.cache === true || (_.isObject(options.cache) && options.cache.template);
    }

    set(key, template) {
        if (this._isEnable) {
            this._cache.set(key, template);
        }
    }

    get(key) {
        if (this._isEnable) {
            return this._cache.get(key);
        }
        return null;
    }

    has(key) {
        return this._cache.has(key);
    }

}