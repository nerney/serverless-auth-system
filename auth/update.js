"use strict";

const aws = require("aws-sdk");
const DYNAMO = new aws.DynamoDB.DocumentClient();

module.exports.handler = async event => {
  try {
    let { oldEmail, newEmail, oldPassword, newPassword } = JSON.parse(
      event.body
    );
    if (oldEmail && newEmail && oldPassword && newPassword) {
      let result = await DYNAMO.get({
        TableName: "users",
        Key: { email: oldEmail }
      }).promise();

      if (result.Item && result.Item.password == oldPassword) {
        await DYNAMO.put({
          TableName: "users",
          Item: {
            email: newEmail,
            password: newPassword
          }
        }).promise();
      } else {
        return { statusCode: 400 };
      }
    } else {
      return { statusCode: 400 };
    }
  } catch (err) {
    console.log(err);
  }

  return { statusCode: 202 };
};
