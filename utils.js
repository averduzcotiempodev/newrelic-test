const _ = require('lodash');
const config = require('./config.json');

class Utils {

    constructor() {
        this.config = config;
        this.settings = config.settings;
    }

    initNewRelic(appName) {
        const newRelicKey = _.get(this.config.keys, `apm.newRelic.test.licenseKey`, null);
        if (!_.isNull(newRelicKey)) {
            process.env.NEW_RELIC_NO_CONFIG_FILE = true;
            process.env.NEW_RELIC_APP_NAME = appName;
            process.env.NEW_RELIC_LICENSE_KEY = newRelicKey;
            process.env.NEW_RELIC_DISTRIBUTED_TRACING_ENABLED = _.get(this.settings, 'apm.newRelic.distributedTracing', false);
            let newrelic = require('newrelic')
            newrelic.instrumentMessages('SQS', this.instrumentSQS);
        }
    }

    instrumentSQS(shim, client, module) {
        var client = client.Client;

        this.instrumentPush();
        this.instrumentPull();
        this.instrumentSubscription();
    }

    instrumentPush() {
        shim.recordProduce(Client.prototype, 'publish', function(shim, fn, name, args) {
            var queueName = args[0]

            // The message headers must be pulled to enable cross-application tracing.
            var options = args[1]
            var headers = options.headers

            // misc key/value parameters can be recorded as a part of the trace segment
            var params = {}

            return {
                callback: shim.LAST,
                destinationName: queueName,
                destinationType: shim.QUEUE,
                headers: headers,
                parameters: params
            }
        });
    }

    instrumentPull() {
        shim.recordConsume(Client.prototype, 'getMessage', {
            destinationName: shim.FIRST,
            callback: shim.LAST,
            messageHandler: function(shim, fn, name, args) {
                var message = args[1]
            
                // These headers are used to set up cross-application tracing.
                var headers = message.properties.headers
            
                // misc key/value parameters can be recorded as a part of the trace segment
                var params = {
                    routing_key: message.properties.routingKey
                }
            
                return {
                    parameters: params,
                    headers: headers
                }
            }
        });
    }

    instrumentSubscription() {
        shim.recordSubcribedConsume(Client.prototype, 'subscribe', {
            consumer: shim.LAST,
            messageHandler: function(shim, consumer, name, args) {
                var message = args[0]
            
                // These headers are used to set up cross-application tracing.
                var headers = message.properties.headers
            
                return {
                    destinationName: message.properties.queueName,
                    destinationType: shim.QUEUE,
                    headers: headers
                }
            }
        })
    }
}

module.exports = Utils;
