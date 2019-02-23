"use strict";

const aws = require("aws-sdk");
const DYNAMO = new aws.DynamoDB.DocumentClient();

module.exports.handler = async event => {
  try {
    let { username, password } = JSON.parse(event.body);
    if (username && password) {
      let result = await DYNAMO.get({
        TableName: "users",
        Key: { username: username }
      }).promise();
      if (result.Item && result.Item.password) {
        return { statusCode: 409 };
      }

      await DYNAMO.put({
        TableName: "users",
        Item: {
          username: username,
          password: password
        }
      }).promise();
    } else {
      return { statusCode: 400 };
    }
  } catch (err) {
    console.log("\n" + err);
  }

  return { statusCode: 202 };
};
