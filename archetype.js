const express = require('express');
const utils = require('utils')();

const app = express();

app.get('/', (req, res) => res.send('Archetype: Second service that pulls the job from the queue and continues the new relic tracing process.!'));

app.get('/getSQS', (req, res) => {
    res.send('Queue retrieved!');
    console.log('Queue retrieved');
});

app.listen(4000, function() {
    utils.initNewRelic('Archetype');
    console.log('ARCHETYPE: Second service listening and running on port 4000.');
});
