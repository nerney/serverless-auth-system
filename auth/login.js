"use strict";

const random = require("crypto-random-string");
const aws = require("aws-sdk");
const DYNAMO = new aws.DynamoDB.DocumentClient();

module.exports.handler = async event => {
  let cookie = "SESSION_COOKIE=0;";

  try {
    let { email, password } = JSON.parse(event.body);

    if (email && password) {
      let result = await DYNAMO.get({
        TableName: "users",
        Key: { email: email }
      }).promise();

      if (result.Item && result.Item.password == password) {
        let id = random(24);
        let now = Math.floor(Date.now() / 1000.0);

        await DYNAMO.put({
          TableName: "sessions",
          Item: {
            id: id,
            email: email,
            ttl: now + 604800
          }
        }).promise();

        cookie = "SESSION_COOKIE=" + id + ";";
      }
    } else {
      return { statusCode: 400 };
    }
  } catch (err) {
    console.log(err);
  }

  return {
    statusCode: 200,
    headers: {
      "set-cookie": cookie
    }
  };
};
