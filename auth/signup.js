"use strict";

const aws = require("aws-sdk");
const DYNAMO = new aws.DynamoDB.DocumentClient();

module.exports.handler = async event => {
  try {
    let { email, password } = JSON.parse(event.body);
    if (email && password) {
      let result = await DYNAMO.get({
        TableName: "users",
        Key: { email: email }
      }).promise();

      if (result.Item && result.Item.password) {
        return { statusCode: 409 };
      }

      await DYNAMO.put({
        TableName: "users",
        Item: {
          email: email,
          password: password
        }
      }).promise();
    } else {
      return { statusCode: 400 };
    }
  } catch (err) {
    console.log(err);
  }

  return { statusCode: 202 };
};
