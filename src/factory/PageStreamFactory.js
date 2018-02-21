const CombinedStream = require('combined-stream');

module.exports = class {
    static create(stringTemplateWrapper, reactStream) {
        const combinedStream = CombinedStream.create({pauseStreams: false});
        combinedStream.append(stringTemplateWrapper.getTemplateStartStream());
        combinedStream.append(reactStream);
        combinedStream.append(stringTemplateWrapper.getTemplateEndStream());
        return combinedStream;
    }
};