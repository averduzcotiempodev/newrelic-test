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
            require('newrelic');
        }
    }

}

module.exports = Utils;
