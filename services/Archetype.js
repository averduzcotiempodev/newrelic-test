var AWS = require('aws-sdk');

class Archetype {
    constructor() {
        AWS.config.update({region: 'us-west-2'});
    }

    retrieveSQSMessage() {
        var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

        var queueURL = "https://sqs.us-west-2.amazonaws.com/181007624280/test";

        var params = {
            AttributeNames: [
                "SentTimestamp"
            ],
            MaxNumberOfMessages: 1,
            MessageAttributeNames: [
                "All"
            ],
            QueueUrl: queueURL,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 0
        };

        sqs.receiveMessage(params, function(err, data) {
            if (err) {
                console.log("Receive Error", err);
            } else if (data.Messages) {
                var deleteParams = {
                    QueueUrl: queueURL,
                    ReceiptHandle: data.Messages[0].ReceiptHandle
                };
                sqs.deleteMessage(deleteParams, function(err, data) {
                    if (err) {
                        console.log("Delete Error", err);
                    } else {
                        console.log("Message Deleted", data);
                    }
                });
            }
        });
    }

    retrieveKinesisMessage() {
        var kinesis = new AWS.Kinesis({
            apiVersion: '2013-12-02'
        });

        var params = {
            ShardIterator: 'TEST_STREAM',
            Limit: 0
        };
        
        kinesis.getRecords(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                console.log(data);
            }
        });
    }
}

module.exports = Archetype;
