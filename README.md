node-spm
========

Sematext Performance Monitoring - custom metrics and Logsene api client for node.js.
It allows to send collected metrics to SPM, it collects automatically Node.js memory and OS memory.
In addition it provides the capability to send Events to SPM and logs to Logsene.
Please note this module is in early stage and documentation will be added soon.

Get an account and API token at [www.sematext.com](http://www.sematext.com)

# Installation
```
npm install node-spm
```

# Usage
```

var SPM = require('node-spm')
// YOUR API TOKEN (SPM and Logsene)
var token = {spm: process.env.SPM_TOKEN, logsene: process.env.LOGSENE_TOKEN}

// create client, automatically log node.js memory and CPU usage every 30 seconds, 0 disables intervall transmission
var spmcm = new SPM(token, 30000)
//  collect process information when you need it ...
spmcm.collectProcessMetrics()
// or log your custom metrics, relevant for your application
spmcm.add (new Date().getTime(), 'user.active',232,'server=server1')
// send the collected data points to sematext big data platform
spmcm.send()
// log an event to SPM Events
spmcm.logEvent ('test1', 'High', 'this is an event message', 'testing is the event name', ['test', 'node-spm'], 'event source', 'this is any data as string or base64 encoded', function (err,res) {
            console.log (res.body)
            done();
})
// send a log entry to Logsene, it automatically adds source (main module file), timestamp, hostname and IP
spcm.log ('security', ['info','security'], 'user stefan logged in', {user:stefan, source: 'web ui', action: 'login'})
```

# Monitoring activity and errors
You can add event handlers for errors and actions
```
spcm.on ('error', console.log)  // outputs {err: 'an error', source: 'send'}
spcm.on ('add', console.log) // outputs datapoint added
spcm.on ('send metrics', console.log)
spcm.on ('send event', console.log)
spcm.on ('log', console.log)
```

Enjoy nice graphs and analytics of your application metrics  [http://sematext.com/spm/index.html](http://sematext.com/spm/index.html)
and log files analysis [http://sematext.com/logsene/index.html](http://sematext.com/logsene/index.html)
