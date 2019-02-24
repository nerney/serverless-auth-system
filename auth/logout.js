"use strict";

const aws = require("aws-sdk");
const DYNAMO = new aws.DynamoDB.DocumentClient();

module.exports.handler = async event => {
  try {
    let cookie = parseCookie(event.headers.Cookie);
    if (cookie.SESSION_COOKIE) {
      await DYNAMO.delete({
        TableName: "sessions",
        Key: { session: cookie.SESSION_COOKIE }
      }).promise();
    }
  } catch (err) {
    console.log(err);
  }
  return {
    statusCode: 200,
    headers: {
      "set-cookie": "SESSION_COOKIE=0;"
    }
  };
};
