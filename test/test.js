var assert = require("assert")

describe("spm custom metrics ", function(){

    // ...

    it("should pass", function(done){
        var spmcm = require('../lib/index.js')
        var token = process.env.TOKEN
        var spmcm = new spmcm (token, 0)
        spmcm.collectProcessMetrics()
        spmcm.send()
        done();
    });

});