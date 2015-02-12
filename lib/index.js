var MAX_DP = 99;
var request = require('request')
var os = require('os')
var events = require('events');
var logger = null;
var events = require('events')
var ipAddress = require("ip").address();
/**
 *
 * @param {string} token - your token for your app (created in SPM UI)
 * @param {int} processMetricsInterval - 0 disabled, >0 interval in milliseconds to send metrics from  collectProcessMetrics
 * @param {string} metricsApiEndpoint - default value is 'http://spm-receiver.sematext.com/receiver/custom/receive.json?token='
 * @constructor
 */
function SpmCustomMetrics(tokens, processMetricsInterval, metricsApiEndpoint) {
    this.metricsUrl = (metricsApiEndpoint || 'https://spm-receiver.sematext.com/receiver/custom/receive.json?token=') + tokens.spm;
    this.tokens = tokens
    this.datapoints = []
    this.logs = []
    //this.events = []
    events.EventEmitter.call(this);
    SpmCustomMetrics.prototype.__proto__ = events.EventEmitter.prototype;
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
SpmCustomMetrics.prototype.add = function (name, value, aggregation, filter1, filter2) {
    var dp = {timestamp: (new Date().getTime()), name: name, value: value, aggregation: aggregation, filter1: filter1, filter2: filter2}
    this.datapoints.push(dp)
    // SPM is accepting maximum 100 datapoints in one request
    // we need to send it if we reach this number
    this.emit('add', dp)
    if (this.datapoints.length === MAX_DP)
        this.send()
}

/**
 * Sending log entry  to LOGSENSE
 * @type {string} typename of the log entry (e.g. 'security')
 * @tags {string|array} any tag to be added to the log message (useful in LOGSENSE UI)
 * @messageText {string} the actual log message
 * @fields {object} additional fields to be added (e.g. source, hostname etc.)
 * @callback {function} optional callback function
 */
SpmCustomMetrics.prototype.log = function (type, tags, messageText, fields, callback) {
    var msg = {tags: tags, '@timestamp': new Date().toISOString(), host: os.hostname() + ' ' + ipAddress, source: process.mainModule.filename, message: messageText, '@source': process.mainModule.filename}
    for (var x in fields) {
        msg[x] = fields[x]
    }


    var options = {
        url: 'https://logsene-receiver.sematext.com/' + this.tokens.logsene + '/' + type,
        headers: {
            'User-Agent': 'node-spm',
            'Content-Type': 'application/json'
            //'Keep-Alive': false
        },
        body: JSON.stringify(msg),
        method: 'POST'
    };
    console.log(options.body)
    request.post(options, function (err, res) {
        console.log(err || res.body)
        if (err)
            this.emit('error', {source: 'log', err: err})
        if (callback)
            callback(err, res)
    })
}


/**
 * Sending collected datapoints to SPM
 * fires event 'error' and event 'send metrics'
 */
SpmCustomMetrics.prototype.send = function () {
    var options = {
        url: this.metricsUrl,
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
    var self = this
    request.post(options, function (err, res) {
        console.log(err || res.body)
        if (err)
            self.emit('error', {source: 'log', err: err})
        else
            self.emit('send metrics', {source: 'log', err: err})
    })
}

/**
 * Sends an event to SPM - please note this function is called from "logEvent"
 * @param type type of the event
 * @param event SPM Event - an Object with at least "timestamp" as ISO String and "message"
 */
SpmCustomMetrics.prototype.sendEvent = function (type, event, callback) {
    var options = {
        url: 'http://event-receiver.sematext.com/' + this.tokens.spm + '/' + type,
        headers: {
            'User-Agent': 'node-spm',
            'Content-Type': 'application/json'
            //'Keep-Alive': false
        },
        body: JSON.stringify(event),
        method: 'POST'
    };
    this.events = []
    var self = this
    console.log('POST ' + options.url)
    console.log(options.body)
    request.post(options, function (err, res) {
        console.log(err || res.body)
        if (err)
            self.emit('error', {source: 'send event', err: err})
        else
            self.emit('send event', {source: 'send event', event: event, err: err})
        if (callback)
            callback(err, res)
    })
}

/**
 * Adds a data point to the metrics array
 * Data structure according to https://sematext.atlassian.net/wiki/display/PUBSPM/Custom+Metrics
 * @param {number} timestamp
 * @param {string[]} message
 * @param {string} name
 * @param {array} tags
 * @param {string} creator
 * @param {string} data (base64 if binary)
 */
SpmCustomMetrics.prototype.logEvent = function (type, priority, message, name, tags, creator, data, callback) {
    var event = {timestamp: new Date().toISOString(), priority: priority, message: message, name: name, tags: tags, creator: creator, data: data}
    this.sendEvent(type, event, callback)

}



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
        this.add(x, metrics[x], 'avg', 'process=' + process.mainModule.filename, x)
    return metrics;
}



module.exports = SpmCustomMetrics

