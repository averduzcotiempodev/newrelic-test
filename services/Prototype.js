var AWS = require('aws-sdk');

class Prototype {
    constructor() {
        AWS.config.update({region: 'us-west-2'});
    }

    sendSQSMessage() {
        var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
        var params = {
            DelaySeconds: 10,
            MessageAttributes: {
                "Test": {
                    DataType: "String",
                    StringValue: "Test"
                }
            },
            MessageBody: "Test body.",
            QueueUrl: "https://sqs.us-west-2.amazonaws.com/181007624280/test"
        };

        sqs.sendMessage(params, function(err, data) {
            if (err) {
               console.log("Error", err);
            } else {
               console.log("Success", data.MessageId);
            }
        });
    }

    sendKinesisMessage() {
        var kinesis = new AWS.Kinesis({
            apiVersion: '2013-12-02'
        });

        var recordData = [];

        var record = {
            Data: JSON.stringify({
                Test: 'Test stream.'
            }),
            PartitionKey: 'partition-1'
        };
        recordData.push(record);

        if (!recordData.length) {
            return;
        }

        kinesis.putRecords({
            Records: recordData,
            StreamName: 'TEST_STREAM'
        }, function(err, data) {
            if (err) {
                console.error(err);
            }
        });

        recordData = [];
    }
}

module.exports = Prototype;
