var assert = require("assert")

var SPM = require('../lib/index.js')
var token = {spm: process.env.SPM_TOKEN, logsene: process.env.LOGSENE_TOKEN}

describe("spm custom metrics ", function () {
    it("should pass", function (done) {
        try {
            var spmcm = new SPM(token, 0)
            spmcm.once('add', function (event) {
                console.log('add event ' + event)
                done();
            })
            spmcm.collectProcessMetrics()
            spmcm.send()
        } catch (err) {
            done (err)
        }


    });

    it("log events", function (done) {
        this.timeout(10000);
        try {
            console.log(token)
            var spmcm = new SPM(token, 0)
            spmcm.logEvent('test1', 'High', 'this is an event message', 'testing', ['test', 'node-spm'], 'Stefan Thies', 'this is any data as string or base64 encoded', function (err, res) {
                console.log(res.body)
                done();
            })
        } catch (err) {
            done(err)
        }
    })

    it("logsenese log", function (done) {
        try {
            var spmcm = new SPM(token, 0)
            spmcm.log('test1', 'info', 'test log message', null, function (err, res) {
                console.log(res.body)
                done()
            })
        } catch (err) {
            done(err)
        }
    });

    it("logsenese log", function (done) {
        try {
            var spmcm = new SPM(token, 0)
            spmcm.log('test1', ['info', 'test'], 'test log message', null, function (err, res) {
                console.log(res.body)
                done();
            })
        }  catch (err) {
            done(err)
        }
    });

});