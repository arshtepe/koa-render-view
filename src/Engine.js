const Utils = require("./utils/Utils");
const EngineFactory = require("./factory/EngineFactory");
const TemplateCache = require("./TemplateCache");
const _ = require("lodash");

module.exports = class {
    constructor(options, files, viewPath) {
        this._viewPath = viewPath;
        this._aliases = Utils.aliasListToMap(options.aliases);
        this._templateCache = new TemplateCache(options);
        this._isFileCacheEnable = options.cache === true || (_.isObject(options.cache) && options.cache.template);
        this._files = files;
        this._options = options;
    }

    async render(pathToTemplate, extendData = {}, stream = false) {
        const data = _.merge({}, extendData, this._options.data);
        if (this._templateCache.has(pathToTemplate)) {
            return this._templateCache.get(pathToTemplate)(data);
        }
        if (!this._isFileCacheEnable) {
            this._files = await Utils.getFiles(this._viewPath, this._options.recursive);
        }

        const {renderPath, fileExtension} = Utils.getFileInfo(pathToTemplate, this._options.extension);
        const typeEngine = this._options.map[fileExtension] || fileExtension;
        const realTemplatePath = Utils.getTemplatePath(this._files, renderPath, this._aliases);
        const engine = EngineFactory.get(this._options, typeEngine);
        const compiledTemplate = await engine.compile(realTemplatePath, stream);

        this._templateCache.set(pathToTemplate, compiledTemplate);
        return compiledTemplate(data);
    }
};