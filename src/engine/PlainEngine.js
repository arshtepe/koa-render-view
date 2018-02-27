const Utils = require("../utils/Utils");
const StringReadableStream = require("../utils/StringReadableStream");

module.exports = class {
    async compile(pathToTemplate, isStream) {
        let template = await Utils.readFile(pathToTemplate);

        return () => {
            if (isStream) {
                return new StringReadableStream(template);
            }
            return template;
        };
    }
};