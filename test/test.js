var assert = require("assert")

describe("spm custom metrics ", function(){

    // ...

    it("should pass", function(done){
        var spmcm = require('../lib/index.js')
        var token = '34569637-0684-4f67-9029-a91e4ab4efb6'
        var spmcm = new spmcm (token, 0)
        spmcm.collectProcessMetrics()
        spmcm.send()
        done();
    });

});