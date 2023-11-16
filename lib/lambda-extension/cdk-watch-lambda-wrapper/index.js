#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// src/lambda-extension/cdk-watch-lambda-wrapper/index.ts
var AWS = __toModule(require("aws-sdk"));

// src/lambda-extension/cdk-watch-lambda-wrapper/patchConsole.ts
var patchConsole = (logs2) => {
  const {log, debug, info, warn, error, trace, fatal} = console;
  console.log = (...params) => {
    logs2.push({
      lambda: process.env.AWS_LAMBDA_FUNCTION_NAME,
      level: "info",
      date: Date.now(),
      log: params
    });
    log.apply(console, params);
  };
  console.debug = (...params) => {
    logs2.push({
      lambda: process.env.AWS_LAMBDA_FUNCTION_NAME,
      level: "debug",
      date: Date.now(),
      log: params
    });
    debug.apply(console, params);
  };
  console.info = (...params) => {
    logs2.push({
      lambda: process.env.AWS_LAMBDA_FUNCTION_NAME,
      level: "info",
      date: Date.now(),
      log: params
    });
    info.apply(console, params);
  };
  console.warn = (...params) => {
    logs2.push({
      lambda: process.env.AWS_LAMBDA_FUNCTION_NAME,
      level: "warn",
      date: Date.now(),
      log: params
    });
    warn.apply(console, params);
  };
  console.error = (...params) => {
    logs2.push({
      lambda: process.env.AWS_LAMBDA_FUNCTION_NAME,
      level: "error",
      date: Date.now(),
      log: params
    });
    error.apply(console, params);
  };
  console.trace = (...params) => {
    logs2.push({
      lambda: process.env.AWS_LAMBDA_FUNCTION_NAME,
      level: "trace",
      date: Date.now(),
      log: params
    });
    trace.apply(console, params);
  };
  console.fatal = (...params) => {
    logs2.push({
      lambda: process.env.AWS_LAMBDA_FUNCTION_NAME,
      level: "fatal",
      date: Date.now(),
      log: params
    });
    fatal.apply(console, params);
  };
};

// src/lambda-extension/cdk-watch-lambda-wrapper/index.ts
var logs = [];
var file = process.argv.pop();
var ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});
var apigwManagementApi = new AWS.ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint: process.env.CDK_WATCH_API_GATEWAY_MANAGEMENT_URL
});
var handlerFunctionName = "cdkWatchWrappedHandler";
var originalHandlerName = process.env._HANDLER;
var postToWS = async (postData) => {
  let connectionData;
  try {
    connectionData = await ddb.scan({
      TableName: process.env.CDK_WATCH_CONNECTION_TABLE_NAME,
      ProjectionExpression: "connectionId"
    }).promise();
  } catch (e) {
    console.error(`Failed to scan for connections`, e);
    return;
  }
  const postCalls = connectionData.Items && connectionData.Items.map(async ({connectionId}) => {
    try {
      await apigwManagementApi.postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(postData, null, 2)
      }).promise();
    } catch (e) {
      if (e.statusCode === 410) {
        await ddb.delete({
          TableName: process.env.CDK_WATCH_CONNECTION_TABLE_NAME,
          Key: {connectionId}
        }).promise().catch((error) => console.log("Failed to delete connection", error));
      } else {
        console.log("Failed to send log", e);
      }
    }
  });
  await Promise.all(postCalls || []);
};
try {
  const handlerPath = `${process.env.LAMBDA_TASK_ROOT}/${originalHandlerName}`;
  const handlerArray = handlerPath.split(".");
  const functionName = handlerArray.pop();
  const handlerFile = handlerArray.join("");
  process.env._HANDLER = `${handlerFile}.${handlerFunctionName}`;
  const handler = require(handlerFile);
  const originalFunction = handler[functionName];
  const wrappedHandler = async (...args) => {
    const sendLogs = async () => {
      const payload = [...logs];
      logs.splice(0);
      if (!payload.length)
        return;
      await postToWS(payload).catch(console.error);
    };
    const interval = setInterval(sendLogs, 100);
    try {
      const result = await originalFunction(...args);
      clearInterval(interval);
      await sendLogs();
      return result;
    } catch (e) {
      console.error("Main handler threw error", e);
      clearInterval(interval);
      await sendLogs();
      throw e;
    }
  };
  Object.defineProperty(handler, handlerFunctionName, {
    get: () => wrappedHandler,
    enumerable: true
  });
} catch (error) {
  console.log("Failed wrapping handler", error);
}
module.exports = require(file);
patchConsole(logs);
