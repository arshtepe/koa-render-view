const CombinedStream = require('combined-stream');

module.exports = class {
    static create(stringTemplateWrapper, template) {
        let templateStart = stringTemplateWrapper.getTemplateStart();
        let templateEnd = stringTemplateWrapper.getTemplateEnd();
        return `${templateStart}${template}${templateEnd}`
    }
};