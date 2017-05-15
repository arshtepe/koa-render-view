const TestUtils = require("./common/TestUtils");
const path = require("path");
const ContentType = require("../src/ContentType");

describe("Default render test", function () {

    it("Render HTML", function (done) {
        TestUtils.baseTest(TestUtils.getServer("index"))
            .end(done)
    });


    it("Render Template", function (done) {
        TestUtils.baseTestCheck(TestUtils.getServerWithMessage("index.ejs"), done);
    });

    it("Render single file template", function (done) {
        TestUtils.baseTestCheck(TestUtils.getServerWithMessage("index.ejs", {
            path: path.join(__dirname, "templates", "index.ejs")
        }), done);
    });

    //TODO
    // it("Render Other", function (done) {
    //     baseTest(getServerWithMessage("index.js"))
    //         .end(messageEquals(done));
    // });

});
