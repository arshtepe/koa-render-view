const request = require('supertest');
const path = require("path");
const Koa = require("koa");
const views = require("../../src/index");
const ContentType = require("../../src/ContentType");
const MESSAGE = "__TEST_MESSAGE__";

class TestUtils {

    static getServer(renderValue, params = {}) {
        const app = new Koa();
        app.use(views(params.path || path.join( __dirname, "../templates"), params.baseConfig));
        app.use(async (ctx, next) => {
            await ctx.render(renderValue, params.renderData);
            return next();
        });

        return app.listen();
    }

    static getServerWithMessage(renderValue, params) {
        return this.getServer(renderValue, Object.assign({}, params, {
            renderData: {
                message: MESSAGE
            }
        }))
    }

    static messageEquals(done) {
        return (err, res) => {
            if (err) {
                throw err;
            }

            expect(res.text.trim()).toEqual(MESSAGE);
            done();
        }

    }

    static baseTestCheck(server, done) {
        this.baseTest(server)
            .end(this.messageEquals(done))
    }

    static baseTest(server) {
        return request(server)
            .get("/")
            .expect('Content-Type', /text\/html/)
            .expect(200)
    }
}


module.exports = TestUtils;