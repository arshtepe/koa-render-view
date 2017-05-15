const consolidate = require('consolidate');

module.exports = {
    engine: consolidate,
    extension: 'html',
    cache: true,
    recursive: false,
    options: {},
    map: {
        jsx: "react"
    },
    aliases: []
};