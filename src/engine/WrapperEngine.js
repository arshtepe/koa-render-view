module.exports = class {

    constructor(engine, type) {
        this._engine = engine;
        this._type = type;
    }


    async compile(pathToEngine) {
        return data => this._engine[this._type](pathToEngine, data);
    }

};