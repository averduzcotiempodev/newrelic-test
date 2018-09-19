const express = require('express');
const utils = require('utils')();

const app = express();

app.get('/', (req, res) => res.send('Prototype: First service that push the job in the queue and starts the new relic tracing process!'));

app.get('/setSQS', (req, res) => {
    res.send('Queue sent!');
    console.log('Queue sent');
});

app.listen(3000, function() {
    utils.initNewRelic('Prototype');
    console.log('PROTOTYPE: First service listening and running on port 3000.');
});
