var assert = require("assert")

describe("spm custom metrics ", function () {
    it("should pass", function (done) {
        var spmcm = require('../lib/index.js')
        var token = process.env.TOKEN
        var spmcm = new spmcm(token, 0)
        spmcm.collectProcessMetrics()
        spmcm.send()
        done();
    });

    it("should pass", function (done) {
        var spmcm = require('../lib/index.js')
        var token = process.env.TOKEN
        console.log(token)
        var spmcm = new spmcm(token, 0)
        spmcm.logEvent('test1', 'High', 'this is an event message', 'testing', ['test', 'node-spm'], 'Stefan Thies', 'this is any data as string or base64 encoded', function (err, res) {
            console.log(res.body)
            done();
        })

    });


});