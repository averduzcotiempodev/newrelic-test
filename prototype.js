const express = require('express');
const ApmConfigurator = require('./config/ApmConfigurator');

const app = express();

app.get('/', (req, res) => res.send('Prototype: First service that push the job in the queue and starts the new relic tracing process!'));

app.get('/setSQS', (req, res) => {
    let Prototype = require('./Services/Prototype');
    let prototype = new Prototype();
    prototype.sendSQSMessage();
    console.log('Queue sent');
    res.send('Queue sent!');
});

app.get('/setKinesisStream', (req, res) => {
    let Prototype = require('./Services/Prototype');
    let prototype = new Prototype();
    prototype.sendKinesisMessage();
    console.log('Stream sent');
    res.send('Stream sent!');
});

app.listen(3000, function() {
    let apmConfigurator = new ApmConfigurator();
    apmConfigurator.initAPM('Prototype');
    console.log('PROTOTYPE: First service listening and running on port 3000.');
});
