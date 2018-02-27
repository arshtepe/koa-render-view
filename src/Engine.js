const Utils = require("./utils/Utils");
const EngineFactory = require("./factory/EngineFactory");
const TemplateCache = require("./TemplateCache");
const _ = require("lodash");
const PageStreamFactory = require("./factory/PageStreamFactory");
const PageFactory = require("./factory/PageFactory");
const fs = require("fs");
const StringTemplateWrapper = require("./utils/StringTemplateWrapper");

module.exports = class {
    constructor(options, files, viewPath) {
        this._viewPath = viewPath;
        this._aliases = Utils.aliasListToMap(options.aliases);
        this._templateCache = new TemplateCache(options);
        this._isFileCacheEnable = options.cache === true || (_.isObject(options.cache) && options.cache.template);
        this._files = files;
        this._options = options;
        this._staticCache = new Map();

        this._templateWrapper = null;
        if (options.pathToHTMLWrapper) {
            const staticHTMLWrapper = fs.readFileSync(options.pathToHTMLWrapper).toString();
            this._templateWrapper = new StringTemplateWrapper(staticHTMLWrapper);
        }

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


    async renderInto(pathToTemplate, data, isStream = this._options.stream) {
        if (!this._templateWrapper) {
            throw new Error("You need pass path to template wrapper");
        }
        if (isStream) {
            const renderStream = await this.render(pathToTemplate, data, isStream);
            return PageStreamFactory.create(this._templateWrapper, renderStream);
        } else {
            return PageFactory.create(this._templateWrapper, await this.render(pathToTemplate, data));
        }
    }

    async renderStatic(renderPathTemplate, data) {
        if (this._staticCache.has(renderPathTemplate)) {
            return staticCache.get(renderPathTemplate);
        }
        const template = await this.render(renderPathTemplate, data);
        this._staticCache.set(renderPathTemplate, template);
        return template;
    };
};