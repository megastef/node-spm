node-spm
========

Sematext Performance Monitoring - custom metrics api client for node.js.
It allows to send collected metrics to SPM, it collects automatically Node.js memory and OS memory.
In addition it provides the capability to send Events to SPM.
Please note this module is in early stage and documentation will be added soon.

Get an account and API token at [www.sematext.com](http://www.sematext.com)

```

var spmcm = require('node-spm')
// YOUR API TOKEN (SPM App)
var token = process.env.TOKEN
// create client, automatically log node.js memory and CPU usage every 30 seconds
var spmcm = new spmcm(token, 30000)
// or collect process information when you need it ...
spmcm.collectProcessMetrics()
// or log your custom metrics, relevant for your application
spmcm.add (new Date().getTime(), 'user.active',232,'server=server1')
// send the collected data point to sematext big data platform
spmcm.send()
// log an event to SPM Events
spmcm.logEvent ('test1', 'High', 'this is an event message', 'testing is the event name', ['test', 'node-spm'], 'event source', 'this is any data as string or base64 encoded', function (err,res) {
            console.log (res.body)
            done();
})
```


