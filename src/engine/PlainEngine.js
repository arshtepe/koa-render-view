const Utils = require("../utils/Utils");
const fs = require("fs")

module.exports = class {
    async compile(pathToTemplate, isStream) {
        let template = "";
        if(!isStream) {
            template = await Utils.readFile(pathToTemplate);
        }

        return () => {
            if(isStream) {
                return fs.createReadStream(pathToTemplate)
            }
            return template;
        };
    }
};