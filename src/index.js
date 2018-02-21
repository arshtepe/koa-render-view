const Utils = require("./utils/Utils");
const ContentType = require("./ContentType");
const defaultParams = require("./defaultParams");
const _ = require("lodash");
const fs = require("fs");
const Engine = require("./Engine");
const StringTemplateWrapper = require("./utils/StringTemplateWrapper");
const PageStreamFactory = require("./factory/PageStreamFactory");
const PageFactory = require("./factory/PageFactory");

module.exports = (viewPath, params = {}) => {
    const options = _.merge({}, defaultParams, params);
    let files = Utils.getFilesSync(viewPath, options.recursive);
    const engine = new Engine(options, files, viewPath);
    // const aliases = Utils.aliasListToMap(options.aliases);
    // const templateCache = new TemplateCache(options);
    // const isFileCacheEnable = options.cache === true || (_.isObject(options.cache) && options.cache.template);
    let templateWrapper = null;
    if (params.pathToHTMLWrapper) {
        const staticHTMLWrapper = fs.readFileSync(params.pathToHTMLWrapper).toString();
        templateWrapper = new StringTemplateWrapper(staticHTMLWrapper);
    }

    //TODO validate params
    return async function (ctx, next) {
        // async function render(pathToTemplate, extendData = {}, stream = false) {
        //     const data = _.merge(extendData, options.data, ctx.state || {});
        //     if (templateCache.has(pathToTemplate)) {
        //         return templateCache.get(pathToTemplate)(data);
        //     }
        //     if (!isFileCacheEnable) {
        //         files = await Utils.getFiles(viewPath, options.recursive);
        //     }
        //
        //     const {renderPath, fileExtension} = Utils.getFileInfo(pathToTemplate, options.extension);
        //     const typeEngine = options.map[fileExtension] || fileExtension;
        //     const realTemplatePath = Utils.getTemplatePath(files, renderPath, aliases);
        //     const engine = EngineFactory.get(options, typeEngine);
        //     const compiledTemplate = await engine.compile(realTemplatePath, stream);
        //
        //     templateCache.set(pathToTemplate, compiledTemplate);
        //     return compiledTemplate(data);
        // }

        ctx.renderIntoString = async (pathToTemplate, data) => {
            return await engine.render(pathToTemplate, data);
        };

        ctx.renderInto = async (pathToTemplate, data, isStream = options.stream) => {
            if (!templateWrapper) {
                throw new Error("You need pass path to template wrapper");
            }
            if (isStream) {
                const renderStream = await engine.render(pathToTemplate, data, isStream);
                ctx.body = PageStreamFactory.create(templateWrapper, renderStream);
            } else {
                ctx.body = PageFactory.create(templateWrapper, await engine.render(pathToTemplate, data));
            }
            ctx.type = ContentType.HTML_TYPE;
        };

        //Stream works only for react !!!
        ctx.render = async (renderPathTemplate, data, stream = params.stream) => {
            ctx.body = await engine.render(renderPathTemplate, data, stream);
            ctx.type = ContentType.HTML_TYPE;
        };

        //TODO more smart cache
        const staticCache = new Map();
        ctx.renderStatic = async (renderPathTemplate, data) => {
            if (staticCache.has(renderPathTemplate)) {
                return staticCache.get(renderPathTemplate);
            }
            const template = await engine.render(renderPathTemplate, data);
            staticCache.set(renderPathTemplate, template);
            ctx.body = template;
            ctx.type = ContentType.HTML_TYPE;
        };

        return next();
    }
};
