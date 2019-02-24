"use strict";

const aws = require("aws-sdk");
const DYNAMO = new aws.DynamoDB.DocumentClient();
const parseCookie = require("cookie").parse;

module.exports.handler = async event => {
  let effect = "Deny";

  try {
    let cookie = parseCookie(event.headers.Cookie);
    if (cookie.SESSION_COOKIE) {
      let result = await DYNAMO.get({
        TableName: "sessions",
        Key: { session: cookie.SESSION_COOKIE }
      }).promise();

      if (result.Item && result.Item.email) {
        effect = "Allow";
      }
    }
  } catch (err) {
    console.log(err);
  }

  return {
    principalId: event.headers.Cookie,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: "*"
        }
      ]
    }
  };
};
