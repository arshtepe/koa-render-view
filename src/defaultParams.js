const consolidate = require('consolidate');

module.exports = {
    render: {},
    stream: true,
    pathToHTMLWrapper: null,
    engine: consolidate,
    extension: 'html',
    cache: {
        path: true,
        files: true,
        template: true
    },
    recursive: false,
    data: {},
    map: {
        jsx: "react"
    },
    aliases: []
};