const StringReadableStream = require("./StringReadableStream")
const pattern = "__${REACT_SSR_CONTENT}__";

module.exports = class {
    constructor(template) {
        const index = template.indexOf(pattern);
        if(index === -1) {
            throw new Error("Unexpected template, expected: " + pattern);
        }
        this._templateStart = template.slice(0, index);
        this._templateEnd = template.slice(index + pattern.length);
    }

    getTemplateStart() {
        return this._templateStart;
    }

    getTemplateEnd() {
        return this._templateEnd;
    }

    getTemplateStartStream() {
        return new StringReadableStream(this._templateStart);
    }

    getTemplateEndStream() {
        return new StringReadableStream(this._templateEnd);
    }
};