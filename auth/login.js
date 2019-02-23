"use strict";

const random = require("crypto-random-string");
const aws = require("aws-sdk");
const DYNAMO = new aws.DynamoDB.DocumentClient();

module.exports.handler = async event => {
  let cookie = "SESSION_COOKIE=NO";
  try {
    let { username, password } = JSON.parse(event.body);

    if (username && password) {
      let result = await DYNAMO.get({
        TableName: "users",
        Key: { username: username }
      }).promise();

      if (result.Item.password == password) {
        let session = random(16);
        let now = Math.floor(Date.now() / 1000.0);

        await DYNAMO.put({
          TableName: "sessions",
          Item: {
            session: session,
            ttl: now + 2419200
          }
        }).promise();

        cookie = "SESSION_COOKIE=" + session;
      }
    } else {
      return { statusCode: 400 };
    }
  } catch (err) {
    console.log("\n" + err);
  }

  return {
    statusCode: 200,
    "set-cookie": cookie
  };
};
