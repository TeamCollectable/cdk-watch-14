var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
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

// src/websocketHandlers/index.ts
__markAsModule(exports);
__export(exports, {
  onConnect: () => onConnect,
  onDisconnect: () => onDisconnect,
  onMessage: () => onMessage
});
var AWS = __toModule(require("aws-sdk"));
var dynamoDb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});
var onConnect = async (event) => {
  var _a, _b, _c;
  const lambdaIds = (_c = (_b = (_a = event.queryStringParameters) == null ? void 0 : _a.lambdas) == null ? void 0 : _b.split(",")) != null ? _c : [];
  if (!lambdaIds.length)
    return {
      statusCode: 400,
      body: "You must provide at least one lambda parameter"
    };
  const putParams = lambdaIds.map((lambdaId) => ({
    TableName: process.env.CDK_WATCH_CONNECTION_TABLE_NAME,
    Item: {
      connectionId: event.requestContext.connectionId,
      lambdaId
    }
  }));
  try {
    await Promise.all(putParams.map((putParam) => dynamoDb.put(putParam).promise()));
  } catch (err) {
    console.error(err);
    return {statusCode: 500, body: `Failed to connect.`};
  }
  return {statusCode: 200, body: "Connected."};
};
var onDisconnect = async (event) => {
  try {
    await dynamoDb.delete({
      TableName: process.env.CDK_WATCH_CONNECTION_TABLE_NAME,
      Key: {
        connectionId: event.requestContext.connectionId
      }
    }).promise();
  } catch (err) {
    console.error(err);
    return {statusCode: 500, body: `Failed to disconnect.`};
  }
  return {statusCode: 200, body: "Disconnected."};
};
var onMessage = async (event) => {
  if (event.body === "ping") {
    return {statusCode: 200, body: "pong"};
  }
  return {statusCode: 422, body: "wrong"};
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  onConnect,
  onDisconnect,
  onMessage
});
