const _ = require('lodash');
const config = require('./config.json');

class ApmConfigurator {

    constructor() {
        this.config = config;
        this.settings = config.settings;
    }

    initAPM(appName) {
        const newRelicKey = _.get(this.config.keys, `apm.newRelic.test.licenseKey`, null);
        if (!_.isNull(newRelicKey)) {
            process.env.NEW_RELIC_NO_CONFIG_FILE = true;
            process.env.NEW_RELIC_APP_NAME = appName;
            process.env.NEW_RELIC_LICENSE_KEY = newRelicKey;
            process.env.NEW_RELIC_DISTRIBUTED_TRACING_ENABLED = _.get(this.settings, 'apm.newRelic.distributedTracing', false);
            let newrelic = require('newrelic')
            newrelic.instrumentMessages('aws-sdk', this.apmCustomInstrumentation);
        }
    }

    customInstrumentation(shim, sdk, module) {
        try {

            this.instrument(shim, sdk, true);
            this.instrument(shim, sdk, false);

        } catch (e) {
            console.log('NEW RELIC: Error on custom instrumentation');
            console.log(e);
        }
    }

    instrument(shim, sdk, isPush) {
        let instrumentedServices = _.get(this.settings, 'apm.newRelic.instrumentedServices', { });
        console.log(instrumentedServices);
        _.forIn(instrumentedServices, function(value, key) {
            let client = _.get(sdk, key, null);
            if (!_.isNull(client)) {
                console.log('Configuring: ' + key);
                if (isPush) {
                    console.log('Producing for: ' + key);
                    this.produceMessage(shim, client, value.pushMethod);
                } else {
                    console.log('Consuming for: ' + key);
                    this.consumeMessage(shim, client, value.pullMethod);
                }
            }
        });
    }

    produceMessage(shim, client, pushMethod) {
        shim.recordProduce(client.prototype, pushMethod, function(shim, fn, name, args) {
            // The message headers must be pulled to enable distributed tracing.
            var options = args[1];
            var headers = options.headers;
            
            // misc key/value parameters can be recorded as a part of the trace segment
            var params = { };

            return {
                callback: shim.LAST,
                destinationName: name,
                destinationType: typeof client,
                headers: headers,
                parameters: params
            };
        });
    }

    consumeMessage(shim, client, pullMethod) {
        shim.recordConsume(client.prototype, pullMethod, {
            destinationName: shim.FIRST,
            callback: shim.LAST,
            messageHandler: function(shim, fn, name, args) {
                var message = args[1];
            
                // These headers are used to set up distributed tracing.
                var headers = message.properties.headers;
            
                // misc key/value parameters can be recorded as a part of the trace segment
                var params = { };
            
                return {
                    parameters: params,
                    headers: headers
                };
            }
        });
    }
}

module.exports = ApmConfigurator;
