var MAX_DP = 99;
var request = require('request')
var os = require('os')

/**
 *
 * @param {string} token - your token for your app (created in SPM UI)
 * @param {int} processMetricsInterval - 0 disabled, >0 interval in milliseconds to send metrics from  collectProcessMetrics
 * @param {string} apiEndpoint - default value is 'http://spm-receiver.sematext.com/receiver/custom/receive.json?token='
 * @constructor
 */
function SpmCustomMetrics(token, processMetricsInterval, apiEndpoint) {
    this.url = (apiEndpoint || 'http://spm-receiver.sematext.com/receiver/custom/receive.json?token=') + token;
    this.datapoints = []
    var self = this
    if (processMetricsInterval > 0)
        setInterval(function () {
            self.collectProcessMetrics()
        }, processMetricsInterval)
}

/**
 * Adds a data point to the metrics array
 * Data structure according to https://sematext.atlassian.net/wiki/display/PUBSPM/Custom+Metrics
 * @param {number} timestamp
 * @param {string[]} name
 * @param {string} value
 * @param {string} aggregation (avg,sum,min,max)
 * @param {string} filter1
 * @param {string} filter2
 */
SpmCustomMetrics.prototype.add = function (timestamp, name, value, aggregation, filter1, filter2) {
    var dp = {timestamp: timestamp, name: name, value: value, aggregation: aggregation, filter1: filter1, filter2: filter2}
    this.datapoints.push(dp)
    // SPM is accepting maximum 100 datapoints in one request
    // we need to send it if we reach this number
    if (this.datapoints.length === MAX_DP)
        this.send()
}

/**
 * Sending collected datapoints to SPM
 */
SpmCustomMetrics.prototype.send = function () {
    var options = {
        url: this.url,
        headers: {
            'User-Agent': 'node-spm',
            'Content-Type': 'application/json'
            //'Keep-Alive': false
        },
        body: JSON.stringify({datapoints: this.datapoints}),
        method: 'POST'
    };
    this.datapoints = []
    console.log(options.body)
    request.post(options, function (err, res) {
        console.log(err || res.body)
    })
}


module.exports = SpmCustomMetrics

/**
 * This functions collects process and os memory/load metrics and adds it as datapoint
 * a copy of the metric is returned
 * @returns {object} collected values including timestamp
 */
SpmCustomMetrics.prototype.collectProcessMetrics = function () {
    var time = new Date().getTime();
    var metrics = {timestamp: time}
    // { rss: 15556608, heapTotal: 10324992, heapUsed: 4426416 }
    var pm = process.memoryUsage()
    metrics.processMemoryRss = pm.rss
    metrics.processMemoryHeapTotal = pm.heapTotal
    metrics.processMemoryheapUsed = pm.heapUsed
    metrics.osLoadAvg1m = os.loadavg()[0]    // [1, 5, 15] min unix loadavarage for 1,5,15 minutes
    metrics.osFreemem = os.freemem()
    metrics.osTotalmem = os.totalmem()
    metrics.osUsedMem = metrics.osTotalmem - metrics.osFreemem
    for (x in metrics)
        this.add(metrics.timestamp, x, metrics[x], 'avg', 'process=' + process.mainModule.filename, x)
    return metrics;
}

