const _ = require("lodash");
const ReactDOMServer = require("react-dom/server");
const React = require("react");

module.exports = class ReactEngine {

    async compile(pathToTemplate, isStream) {
        const template = require(pathToTemplate);// It is using consolidate

        return (data) => {
            const reactTemplate = React.createFactory(template)(data);
            if (isStream) {
                return ReactDOMServer.renderToNodeStream(reactTemplate)
            }

            return ReactDOMServer.renderToString(reactTemplate);
        }

    }
};