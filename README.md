node-spm
========
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/megastef/node-spm?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Sematext Performance Monitoring - Custom Metrics and Logsene API client for node.js.

Send custom metrics to SPM, it collects automatically Node.js memory and OS memory.
In addition it provides the capability to send Events to SPM and logs to Logsene.

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
```

Create client, automatically log node.js memory and CPU usage every 30 seconds, 0 disables interval transmission

```
    var spmClient = new SPM(token, 30000)
```

Collect process information when you need it ...

```
    spmClient.collectProcessMetrics()
```

Or log your custom metrics, relevant for your application

```
    spmClient.add ('user.active',232,'server=server1','app=myapp.js')
```

Send the collected metrics to SPM

```
    spmcm.send()
```

// log an event to SPM Events
spmClient.logEvent ('test1', 'High', 'this is an event message', 'testing is the event name', ['test', 'node-spm'], 'event source', 'this is any data as string or base64 encoded', function (err,res) {
            console.log (res.body)
            done();
})

// send a log entry to Logsene, it automatically adds source (main module file), timestamp, hostname and IP
spmClient.log ('security', ['info','security'], 'user stefan logged in', {user:stefan, source: 'web ui', action: 'login'})
```

# Monitoring activity and errors

You can add event handlers for errors and actions

```

    spmClient.on ('error', console.log)  // outputs {err: 'an error', source: 'send'}
    spmClient.on ('add', console.log) // outputs datapoint added
    spmClient.on ('send metrics', console.log)
    spmClient.on ('send event', console.log)
    spmClient.on ('log', console.log)

```

Enjoy graphs and analytics of your application metrics  [http://sematext.com/spm/index.html](http://sematext.com/spm/index.html)
and log files analysis [http://sematext.com/logsene/index.html](http://sematext.com/logsene/index.html)
