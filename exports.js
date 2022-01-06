// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
var docClient = new AWS.DynamoDB.DocumentClient()

exports.handler = function(event, context, callback) {
    // console.log('Received event:', JSON.stringify(event, null, 4));
    var message = event.Records[0].Sns.Message.split(",");
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    var data2;
    var params = {
      TableName: 'Token',
      Key: {
        'username': {S: message[0]}
      },
      ProjectionExpression: 'sent'
    };

    ddb.getItem(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.Item);
        data2 = data;
        console.log(data2.Item.sent.BOOL);
        if(!data2.Item.sent.BOOL){
          
         var params = {
            Destination: { /* required */
              ToAddresses: [
                message[0]
                /* more items */
              ]
            },
            Message: { /* required */
              Body: { /* required */
                Html: {
                 Charset: "UTF-8", 
                 Data: "Hello, thank you for signing up. <br>Please use the following link to verify account:<br> "+"https://"+message[2]+".yingyi.me/v1/verifyUserEmail?email="+message[0].replace(/\+/, "%2B")+"&token="+message[1]
                },
                Text: {
                 Charset: "UTF-8",
                 Data: "Hello, thank you for signing up. <br>Please use the following link to verify account:<br> "+"https://"+message[2]+".yingyi.me/v1/verifyUserEmail?email="+message[0].replace(/\+/, "%2B")+"&token="+message[1]
                }
               },
               Subject: {
                Charset: 'UTF-8',
                Data: 'Webapp verification email'
               }
              },
            Source: "info@"+message[2]+".yingyi.me" /* required */
          };


// Create the promise and SES service object
        var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

        sendPromise.then(
          function(data) {
            params = {
              TableName:"Token",
              Key:{
                "username": message[0]
              },
              UpdateExpression: "set sent = :s",
              ExpressionAttributeValues:{
                ":s":true
              },
              ReturnValues:"UPDATED_NEW"
            };
            
            docClient.update(params, function(err, data) {
              if (err) {
                  console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
              } else {
                  console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
              }
            });
            
            
        }).catch(
          function(err) {
            console.error(err, err.stack);
          });
        
        
        }
      }
  });
};

