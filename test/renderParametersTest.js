const TestUtils = require("./common/TestUtils");
const path = require("path");
const Koa = require("koa");
const fs = require("fs-extra");
const views = require("../src/index");
const ContentType = require("../src/ContentType");
const MESSAGE = "__TEST_MESSAGE__";


describe("Render parameters test", function () {

    it("Map parameter", function (done) {
        TestUtils.baseTestCheck(TestUtils.getServerWithMessage("index.xejs", {
            baseConfig: {
                map: {
                    xejs: "ejs"
                }
            }
        }), done);

    });

    it("Options and map parameters", function (done) {
        TestUtils.baseTestCheck(TestUtils.getServer("index.xejs", {
            baseConfig: {
                map: {
                    xejs: "ejs"
                },
                options: {
                    message: MESSAGE
                }
            }
        }), done);

    });

    it("Extension and map parameters", function (done) {
        TestUtils.baseTestCheck(TestUtils.getServerWithMessage("index", {
            baseConfig: {
                extension: "xejs",
                map: {
                    xejs: "ejs"
                },
            }
        }), done);

    });

    it("Extension parameter", function (done) {
        TestUtils.baseTestCheck(TestUtils.getServerWithMessage("index", {
            baseConfig: {
                extension: "ejs",
            }
        }), done);

    })

    it("Recursive parameter:true", function (done) {
        TestUtils.baseTestCheck(TestUtils.getServerWithMessage("recursive.ejs", {
            baseConfig: {
                recursive: true
            }
        }), done);
    });

    it("Recursive parameter:false", function (done) {
        const app = new Koa();
        app.use(views(path.join(__dirname, "templates")));
        app.use(async (ctx, next) => {
            try {
                await ctx.render("recursive.ejs");
            } catch (err) {
                expect(err.message.includes("File recursive.ejs not found")).toBe(true);
            }

            return next();
        });

        TestUtils.baseTest(app.listen())
            .end(() => done())
    })

});

