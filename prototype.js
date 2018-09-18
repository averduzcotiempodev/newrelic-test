const express = require('express');

const app = express();

function initializeNewRelicAgent() {
    process.env.NEW_RELIC_NO_CONFIG_FILE = true;
    process.env.NEW_RELIC_APP_NAME = 'Prototype';
    process.env.NEW_RELIC_LICENSE_KEY = '1db362c9e9debd8db3a486d18368614b92e611ed';
    process.env.NEW_RELIC_DISTRIBUTED_TRACING_ENABLED = true;
    require('newrelic');
}

app.get('/', (req, res) => res.send('Prototype: First service that push the job in the queue and starts the new relic tracing process!'));

app.get('/setSQS', (req, res) => {
    res.send('Queue sent!');
    console.log('Queue sent');
});

app.listen(3000, function() {
    initializeNewRelicAgent();
    console.log('PROTOTYPE: First service listening and running on port 3000.');
});
