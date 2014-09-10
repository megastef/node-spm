node-spm
========

Sematext Performance Monitoring - custom metrics api client for node.js
Get an account and API token at [www.sematext.com](http://www.sematext.com)

```

var spmcm = require('node-spm')
// YOUR API TAKEN (SPM App)
var token = process.env.TOKEN
// create client, automatically log node.js memory and CPU usage every 30 seconds
var spmcm = new spmcm(token, 30000)
// or collect process information when you need it ...
spmcm.collectProcessMetrics()
// or log your custom metrics, relevant for your application
spmcm.add (new Date().getTime(), 'user.active',232,'server=server1')
// send the collected data point to sematext big data platform
spmcm.send()

```
