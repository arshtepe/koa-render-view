

const {Readable} = require("stream");

module.exports = class extends Readable {
    constructor(string) {
        super();
        this.push(string);
        this.push(null);
    }
};