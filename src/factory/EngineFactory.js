const ReactEngine = require("../engine/ReactEngine");
const EngineWrapper = require("../engine/WrapperEngine");
const PlainEngine = require("../engine/PlainEngine");
const _ = require("lodash");

module.exports = class {
    static get(options, type) {
        if (type === "react") {
            return new ReactEngine();
        } else if (options.engine[type]) {
            return new EngineWrapper(options.engine, type);
        } else {
            return new PlainEngine();
        }
    }
};