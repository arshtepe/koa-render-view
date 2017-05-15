const send = require('koa-send');
const Utils = require("./Utils");
const ContentType = require("./ContentType");
const defaultParams = require("./defaultParams");
const _ = require("lodash");


module.exports = (viewPath, params = {}) => {
    const {engine, extension, cache, options, map, aliases, recursive} = _.merge({}, defaultParams, params);

    Utils.validateAliases(aliases);

    return async function (ctx, next) {
        let files;
        if (cache) {
            files = await Utils.getFiles(viewPath, recursive);
        }

        ctx.render = async function (renderPathTemplate, data = {}) {
            const {fileExtension, renderPath} = Utils.getFileInfo(renderPathTemplate, extension);

            if (!cache) {
                files = await Utils.getFiles(viewPath, recursive);
            }

            const fileItem = Utils.findTemplate(files, renderPath, aliases);
            if (!fileItem) {
                throw new Error(`File ${renderPath} not found`);
            }

            data = _.merge(data, options, ctx.state || {});
            ctx.type = ContentType.HTML_TYPE;

            let typeEngine = map[fileExtension] || fileExtension;

            if (engine[typeEngine]) {
                return ctx.body = await engine[typeEngine](fileItem.path, data);
            } else {
                if(fileExtension !== "html") {
                    console.warn(`Not found engine for .${fileExtension} (${renderPathTemplate}) extension`);
                }
                return send(ctx, fileItem.path, {
                    root: "/"
                });
            }
        };

        return next();
    }
};
