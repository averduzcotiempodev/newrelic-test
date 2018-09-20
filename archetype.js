const express = require('express');
const ApmConfigurator = require('./config/ApmConfigurator');

const app = express();

app.get('/', (req, res) => res.send('Archetype: Second service that pulls the job from the queue and continues the new relic tracing process.!'));

app.get('/getSQS', (req, res) => {
    let Archetype = require('./Services/Archetype');
    let archetype = new Archetype();
    archetype.retrieveSQSMessage();
    console.log('Queue retrieved');
    res.send('Queue retrieved!');
});

app.get('/getKinesisStream', (req, res) => {
    let Archetype = require('./Services/Archetype');
    let archetype = new Archetype();
    archetype.retrieveKinesisMessage();
    console.log('Stream retrieved');
    res.send('Stream retrieved!');
});

app.listen(4000, function() {
    let apmConfigurator = new ApmConfigurator();
    apmConfigurator.initAPM('Archetype');
    console.log('ARCHETYPE: Second service listening and running on port 4000.');
});
