const TestUtils = require("./common/TestUtils");
const path = require("path");
const Koa = require("koa");
const fs = require("fs-extra");
const views = require("../src/index");
const ContentType = require("../src/ContentType");
const MESSAGE = "__TEST_MESSAGE__";
const TEMPLATES = path.join(__dirname, "templates");


describe("Aliases test", function () {

    const baseConfig = {
        aliases: [{
            alias: "@alias",
            path: TEMPLATES
        }]
    };
    it("Aliases test", done => {
        TestUtils.baseTestCheck(TestUtils.getServerWithMessage("@alias/index.ejs", {baseConfig}), done);
    });


    it("Aliases  with parameters test", done => {
        TestUtils.baseTestCheck(TestUtils.getServerWithMessage("@alias/index", {
            baseConfig: Object.assign(baseConfig, {
                extension: "xejs",
                map: {
                    xejs: "ejs"
                }
            })
        }), done);
    });
});