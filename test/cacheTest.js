const TestUtils = require("./common/TestUtils");
const path = require("path");
const Koa = require("koa");
const fs = require("fs-extra");
const views = require("../src/index");
const ContentType = require("../src/ContentType");
const MESSAGE = "__TEST_MESSAGE__";
const TEMPLATES = path.join(__dirname, "templates");


describe("Cache test", () => {
    const fileTMP = path.join(TEMPLATES, "test.html");
    let app;
    beforeEach(() => {
        app = new Koa();
        app.use(views(path.join(__dirname, "templates")));
    });

    afterEach(() => fs.unlinkSync(fileTMP));

    it("Cache true", function (done) {
        app.use(async (ctx, next) => {
            fs.writeFileSync(fileTMP, MESSAGE);
            try {
                await ctx.render("test.html");
            } catch (err) {
                expect(err.message.includes("File test.html not found")).toBe(true);
                done();
            }


            return next();
        });

        TestUtils.baseTest(app.listen())
            .end(() => {
            })
    });

    it("Cache false", function (done) {
        app.use(views(path.join(__dirname, "templates"), {cache: false}));
        app.use(async (ctx, next) => {
            fs.writeFileSync(fileTMP, MESSAGE);
            await ctx.render("test.html");

            return next();
        });

        TestUtils.baseTest(app.listen())
            .end(TestUtils.messageEquals(done))
    });

});