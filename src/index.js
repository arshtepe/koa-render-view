const Utils = require("./utils/Utils");
const ContentType = require("./ContentType");
const defaultParams = require("./defaultParams");
const _ = require("lodash");
const Engine = require("./Engine");

module.exports = (viewPath, params = {}) => {
    const options = _.merge({}, defaultParams, params);
    let files = Utils.getFilesSync(viewPath, options.recursive);
    const engine = new Engine(options, files, viewPath);

    //TODO validate params
    return async function (ctx, next) {

        ctx.renderIntoString = async (pathToTemplate, data) => {
            return await engine.render(pathToTemplate, data);
        };

        ctx.renderInto = async (pathToTemplate, data, isStream = options.stream) => {
            ctx.body = engine.renderInto(pathToTemplate, data, isStream);
            ctx.type = ContentType.HTML_TYPE;
        };

        //Stream works only for react !!!
        ctx.render = async (renderPathTemplate, data, stream = options.stream) => {
            ctx.body = await engine.render(renderPathTemplate, data, stream);
            ctx.type = ContentType.HTML_TYPE;
        };

        ctx.renderStatic = async (renderPathTemplate, data) => {
            ctx.body = engine.renderStatic(renderPathTemplate, data);
            ctx.type = ContentType.HTML_TYPE;
        };

        return next();
    }
};
