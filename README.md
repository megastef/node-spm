node-spm
========
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/megastef/node-spm?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Sematext Performance Monitoring - Custom Metrics and Logsene API client for node.js.

Send custom metrics to SPM, it collects automatically Node.js memory and OS memory.
In addition it provides the capability to send Events to SPM and logs to Logsene.

Get an account and API token at [www.sematext.com](https://apps.sematext.com/users-web/register.do)

# Installation
```
    npm install node-spm
```

# Usage


```
    var SPM = require('node-spm')
    // YOUR API TOKEN (SPM and Logsene), e.g. from environment variables
    var token = {spm: process.env.SPM_TOKEN, logsene: process.env.LOGSENE_TOKEN}
```

Create client, automatically log node.js memory and CPU usage every 30 seconds, 0 disables interval transmission.
When transmission interval is disabled metrics are transmitted when the internal buffer size reaches 100 entries.

```
    var spmClient = new SPM(token, 30000)
```

Collect process information when you need it ...

    spmClient.collectProcessMetrics()

Or log your custom metrics, relevant for your application

    spmClient.add ('user.active',232,'server=server1','app=myapp.js')

Send the collected metrics to SPM

    spmClient.send()

Add an event to SPM Events, callback is optional (see events of spmClient)


    /**
     * Adds an Event to SPM
     * Data structure according to https://sematext.atlassian.net/wiki/display/PUBSPM/Custom+Metrics
     * @param {string} type of event
     * @param {string} priority/level
     * @param {string} message
     * @param {string} name of the event
     * @param {string} creator
     * @param {string} data (base64 if binary)
     */

     // Example:
     spmClient.logEvent ('app-event', 'info', 'started process', 'startup', ['test', 'node-spm'], 'created by app.js', 'this is any data as string or base64 encoded', function (err,res) {
            console.log (res.body)
      })

Send a log entry to Logsene, it automatically adds source (main module file), timestamp, hostname and IP

    /**
     * Sending log entry  to LOGSENSE
     * @type {string} typename of the log entry (e.g. 'security')
     * @tags {string|array} any tag to be added to the log message (useful in LOGSENSE UI)
     * @messageText {string} the actual log message
     * @fields {object} additional fields to be added (e.g. source, hostname etc.)
     * @callback {function} optional callback function
     */

      // Example:
      spmClient.log ('security', ['info','security'], 'user stefan logged in', {user:stefan, source: 'web ui', action: 'login'})


# Monitoring activity and errors

You can add event handlers for errors and actions

    spmClient.on ('error', console.log)  // outputs {err: 'an error', source: 'send'}
    spmClient.on ('add', console.log) // outputs datapoint added
    spmClient.on ('send metrics', console.log)
    spmClient.on ('send event', console.log)
    spmClient.on ('log', console.log)

Enjoy graphs and analytics of your application metrics  [http://sematext.com/spm/index.html](http://sematext.com/spm/index.html)
and log files [http://sematext.com/logsene/index.html](http://sematext.com/logsene/index.html)
