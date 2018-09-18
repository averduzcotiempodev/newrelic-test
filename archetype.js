const express = require('express');

const app = express();

function initializeNewRelicAgent() {
    process.env.NEW_RELIC_NO_CONFIG_FILE = true;
    process.env.NEW_RELIC_APP_NAME = 'Archetype';
    process.env.NEW_RELIC_LICENSE_KEY = '1db362c9e9debd8db3a486d18368614b92e611ed';
    process.env.NEW_RELIC_DISTRIBUTED_TRACING_ENABLED = true;
    require('newrelic');
}

app.get('/', (req, res) => res.send('Archetype: Second service that pulls the job from the queue and continues the new relic tracing process.!'));

app.get('/getSQS', (req, res) => {
    res.send('Queue retrieved!');
    console.log('Queue retrieved');
});

app.listen(4000, function() {
    initializeNewRelicAgent();
    console.log('ARCHETYPE: Second service listening and running on port 4000.');
});
