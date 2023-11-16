#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __assign = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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

// src/cli.ts
var fs4 = __toModule(require("fs-extra"));
var path5 = __toModule(require("path"));

// src/commands/index.ts
var import_commander = __toModule(require("commander"));

// src/commands/list.ts
var import_chalk2 = __toModule(require("chalk"));
var import_os = __toModule(require("os"));

// src/lib/filterManifestByPath.ts
var import_minimatch = __toModule(require("minimatch"));
var filterManifestByPath = (pathMatch, manifest) => {
  const filtered = Object.keys(manifest.lambdas).filter(import_minimatch.default.filter(pathMatch)).reduce((current, next) => __assign(__assign({}, current), {
    lambdas: __assign(__assign({}, current.lambdas), {[next]: manifest.lambdas[next]})
  }), __assign(__assign({}, manifest), {lambdas: {}}));
  if (!Object.keys(filtered.lambdas).length)
    throw new Error(`No Lambdas found at "${pathMatch}"`);
  return filtered;
};

// src/lib/readManifest.ts
var path = __toModule(require("path"));
var fs = __toModule(require("fs-extra"));

// src/consts.ts
var CDK_WATCH_MANIFEST_FILE_NAME = "manifest.cdk-watch.json";
var CDK_WATCH_OUTDIR = "cdk-watch";
var CDK_WATCH_CONTEXT_NODE_MODULES_DISABLED = "cdk-watch:nodeModulesInstallDisabled";

// src/lib/readManifest.ts
var readManifest = () => {
  const manifestPath = path.join(process.cwd(), "cdk.out", CDK_WATCH_MANIFEST_FILE_NAME);
  return fs.readJsonSync(manifestPath, {throws: false});
};

// src/lib/runSynth.ts
var import_execa = __toModule(require("execa"));

// src/lib/twisters.ts
var import_chalk = __toModule(require("chalk"));
var import_twisters = __toModule(require("twisters"));
var twisters = new import_twisters.default({
  pinActive: true,
  messageDefaults: {
    render: (message, frame) => {
      const {active, text, meta} = message;
      const prefix = (meta == null ? void 0 : meta.prefix) ? `${meta == null ? void 0 : meta.prefix} ` : "";
      const completion = (meta == null ? void 0 : meta.error) ? `error: ${import_chalk.default.red(meta.error.toString())}` : "done";
      return active && frame ? `${prefix}${text}... ${frame}` : `${prefix}${text}... ${completion}`;
    }
  }
});

// src/lib/writeManifest.ts
var path2 = __toModule(require("path"));
var fs2 = __toModule(require("fs-extra"));
var writeManifest = (manifest) => {
  const cdkOut = path2.join(process.cwd(), "cdk.out");
  const manifestPath = path2.join(cdkOut, CDK_WATCH_MANIFEST_FILE_NAME);
  fs2.ensureDirSync(cdkOut);
  fs2.writeJsonSync(manifestPath, manifest);
};

// src/lib/runSynth.ts
var runSynth = async (options) => {
  writeManifest({region: "", lambdas: {}});
  const synthProgressText = "synthesizing CDK app";
  twisters.put("synth", {text: synthProgressText});
  const command = [
    "synth",
    ...options.context.map((context) => `--context=${context}`),
    ...options.context.some((context) => context.includes(CDK_WATCH_CONTEXT_NODE_MODULES_DISABLED)) ? [] : [`--context=${CDK_WATCH_CONTEXT_NODE_MODULES_DISABLED}=1`],
    "--quiet",
    options.profile && `--profile=${options.profile}`,
    options.app && `--app=${options.app}`
  ].filter(Boolean);
  const result = await (0, import_execa.default)("cdk", command, {
    preferLocal: true,
    cleanup: true,
    reject: false,
    all: true
  });
  if (result.exitCode !== 0) {
    console.log(result.all);
    console.log(`
Synth failed using the following command:`);
    console.log(["cdk", ...command].join(" "));
    console.log("");
    process.exit(result.exitCode);
  }
  twisters.put("synth", {active: false, text: synthProgressText});
};

// src/commands/list.ts
var list = async (pathGlob, options) => {
  await runSynth({
    context: options.context || [],
    app: options.app,
    profile: options.profile
  });
  const manifest = readManifest();
  if (!manifest)
    throw new Error("cdk-watch manifest file was not found");
  const filteredManifest = pathGlob ? filterManifestByPath(pathGlob, manifest) : manifest;
  console.log(Object.keys(filteredManifest.lambdas).map((key) => `- ${import_chalk2.default.blue(key)}`).join(import_os.default.EOL));
};

// src/lib/initAwsSdk.ts
var AWS = __toModule(require("aws-sdk"));
var initAwsSdk = (region, profile) => {
  AWS.config.region = region;
  if (profile) {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
      profile
    });
  }
};

// src/lib/resolveLambdaNamesFromManifest.ts
var import_aws_sdk2 = __toModule(require("aws-sdk"));

// src/lib/resolveStackNameForLambda.ts
var import_aws_sdk = __toModule(require("aws-sdk"));
var resolveStackNameForLambda = async (lambdaManifest) => {
  const cfn = new import_aws_sdk.CloudFormation({maxRetries: 10});
  return lambdaManifest.nestedStackLogicalIds.reduce((promise, nextNestedStack) => promise.then((stackName) => cfn.describeStackResource({
    StackName: stackName,
    LogicalResourceId: nextNestedStack
  }).promise().then((result) => {
    var _a;
    return (_a = result.StackResourceDetail) == null ? void 0 : _a.PhysicalResourceId;
  })), Promise.resolve(lambdaManifest.rootStackName));
};

// src/lib/resolveLambdaNamesFromManifest.ts
var resolveLambdaNameFromManifest = async (lambdaManifest) => {
  var _a;
  const cfn = new import_aws_sdk2.CloudFormation({maxRetries: 10});
  const lambda = new import_aws_sdk2.Lambda({maxRetries: 10});
  const lambdaStackName = await resolveStackNameForLambda(lambdaManifest);
  const {StackResourceDetail} = await cfn.describeStackResource({
    StackName: lambdaStackName,
    LogicalResourceId: lambdaManifest.lambdaLogicalId
  }).promise();
  if (!(StackResourceDetail == null ? void 0 : StackResourceDetail.PhysicalResourceId)) {
    throw new Error(`Could not find name for lambda with Logical ID ${lambdaManifest.lambdaLogicalId}`);
  }
  const functionName = StackResourceDetail == null ? void 0 : StackResourceDetail.PhysicalResourceId;
  const config3 = await lambda.getFunctionConfiguration({FunctionName: functionName}).promise();
  return {
    layers: ((_a = config3.Layers) == null ? void 0 : _a.map((layer) => {
      var _a2;
      const {6: name} = ((_a2 = layer.Arn) == null ? void 0 : _a2.split(":")) || "";
      return name;
    }).filter(Boolean)) || [],
    functionName,
    lambdaManifest
  };
};
var resolveLambdaNamesFromManifest = (manifest) => Promise.all(Object.keys(manifest.lambdas).map(async (lambdaCdkPath) => {
  const details = await resolveLambdaNameFromManifest(manifest.lambdas[lambdaCdkPath]);
  return __assign({lambdaCdkPath}, details);
}));

// src/lib/tailLogsForLambdas/resolveLogEndpointDetailsFromLambdas.ts
var import_aws_sdk3 = __toModule(require("aws-sdk"));
var resolveLogEndpointDetailsFromLambdas = async (lambdas) => {
  const cfn = new import_aws_sdk3.CloudFormation({maxRetries: 10});
  const apigw = new import_aws_sdk3.ApiGatewayV2({maxRetries: 10});
  return Promise.all(lambdas.map(async (lambda) => {
    var _a, _b, _c;
    if (!lambda.lambdaManifest.realTimeLogsStackLogicalId || !lambda.lambdaManifest.realTimeLogsApiLogicalId)
      return [lambda.lambdaCdkPath, void 0];
    const logsStackResource = await cfn.describeStackResource({
      StackName: lambda.lambdaManifest.rootStackName,
      LogicalResourceId: lambda.lambdaManifest.realTimeLogsStackLogicalId
    }).promise();
    if (!((_a = logsStackResource.StackResourceDetail) == null ? void 0 : _a.PhysicalResourceId)) {
      throw new Error("Could not find resource for real-time logs api, make sure your stack is up-to-date");
    }
    const logsApiResource = await cfn.describeStackResource({
      StackName: (_b = logsStackResource.StackResourceDetail) == null ? void 0 : _b.PhysicalResourceId,
      LogicalResourceId: lambda.lambdaManifest.realTimeLogsApiLogicalId
    }).promise();
    if (!((_c = logsApiResource.StackResourceDetail) == null ? void 0 : _c.PhysicalResourceId)) {
      throw new Error("Could not find resource for real-time logs api, make sure your stack is up-to-date");
    }
    const res = await apigw.getApi({
      ApiId: logsApiResource.StackResourceDetail.PhysicalResourceId
    }).promise();
    return [lambda.lambdaCdkPath, `${res.ApiEndpoint}/v1`];
  })).then(Object.fromEntries);
};

// src/lib/tailLogsForLambdas/tailCloudWatchLogsForLambda.ts
var import_aws_sdk4 = __toModule(require("aws-sdk"));
var import_events = __toModule(require("events"));

// src/lib/tailLogsForLambdas/parseCloudwatchLog.ts
var os = __toModule(require("os"));

// src/lib/tailLogsForLambdas/logToString.ts
var import_chalk3 = __toModule(require("chalk"));
var import_util = __toModule(require("util"));
var import_json5 = __toModule(require("json5"));
var asJson = (msgParam) => {
  try {
    return import_json5.default.parse(msgParam);
  } catch (e) {
    return null;
  }
};
var logLevelColorMap = {
  emerg: import_chalk3.default.bgRedBright,
  alert: import_chalk3.default.bgRed,
  crit: import_chalk3.default.bgRed,
  error: import_chalk3.default.red,
  warning: import_chalk3.default.yellow,
  warn: import_chalk3.default.yellow,
  notice: import_chalk3.default.blue,
  info: import_chalk3.default.blue,
  debug: import_chalk3.default.green
};
var colorFromLogLevel = (level) => {
  const color = logLevelColorMap[level] || logLevelColorMap.info;
  return color(level);
};
var isLogLevelObject = (log) => {
  return log.level && log.message && logLevelColorMap[log.level];
};
var prettyJsonString = (jsonLog) => {
  return (0, import_util.inspect)(jsonLog, {colors: true, depth: null});
};
var formatJsonLog = (log) => {
  const jsonLog = typeof log === "object" ? log : asJson(log);
  if (!jsonLog)
    return log;
  if (isLogLevelObject(jsonLog)) {
    const logLevelMessageAsJsonOrString = asJson(jsonLog.message) || jsonLog.message;
    return [
      `[${colorFromLogLevel(jsonLog.level)}]`,
      typeof logLevelMessageAsJsonOrString === "object" ? prettyJsonString(logLevelMessageAsJsonOrString) : logLevelMessageAsJsonOrString
    ].join(" ");
  }
  return prettyJsonString(jsonLog);
};
var logToString = (log) => {
  const time = log.info.timestamp.toLocaleTimeString().split(":").slice(0, 3).map((num) => import_chalk3.default.blue(num)).join(":");
  switch (log.event) {
    case "START":
    case "END":
    case "REPORT": {
      const report = [
        time,
        import_chalk3.default.yellow(log.event),
        import_chalk3.default.gray(log.info.requestId)
      ].filter(Boolean).join(" ");
      if (log.event === "REPORT") {
        return [
          report,
          [
            log.info.duration,
            log.info.billedDuration,
            log.info.initDuration,
            log.info.maxMemoryUsed
          ].filter(Boolean).join(" ")
        ].join(": ");
      }
      return report;
    }
    case "JSON_LOG":
    case "NATIVE_LOG": {
      return [time, formatJsonLog(log.message)].join(" ");
    }
    case "UNKNOWN":
      return [time, log.message].join(" ");
    default:
      return [time, log.message].join(" ");
  }
};

// src/lib/tailLogsForLambdas/parseCloudwatchLog.ts
var asJson2 = (msgParam) => {
  try {
    return JSON.parse(msgParam);
  } catch (e) {
    return null;
  }
};
var isDate = (str) => {
  return !Number.isNaN(new Date(str).getTime());
};
var KNOWN_NATIVE_LOG_LEVELS = ["ERROR", "INFO", "WARN"];
var KNOWN_ERROR_MESSAGES = [
  "Unknown application error occurredError",
  "Process exited before completing request"
];
var reportMessageToObject = (message, prefix) => {
  if (prefix === "START") {
    const [RequestId] = message.replace(`${prefix} RequestId: `, "").split(" Version: ");
    return {RequestId};
  }
  return Object.fromEntries(message.replace(`${prefix} `, "").split("	").map((part) => {
    return part.split(": ");
  }));
};
var parseStartEvent = (message, timestamp) => {
  const objectified = reportMessageToObject(message, "START");
  return {
    raw: message,
    event: "START",
    message,
    info: {requestId: objectified.RequestId, timestamp},
    toString() {
      return logToString(this);
    }
  };
};
var parseEndEvent = (message, timestamp) => {
  const objectified = reportMessageToObject(message, "END");
  return {
    raw: message,
    event: "END",
    message,
    info: {requestId: objectified.RequestId, timestamp},
    toString() {
      return logToString(this);
    }
  };
};
var parseReportEvent = (message, timestamp) => {
  const objectified = reportMessageToObject(message, "REPORT");
  return {
    raw: message,
    event: "REPORT",
    message,
    info: {
      requestId: objectified.RequestId,
      duration: objectified.Duration,
      billedDuration: objectified["Billed Duration"],
      memorySize: objectified["Memory Size"],
      maxMemoryUsed: objectified["Max Memory Used"],
      initDuration: objectified["Init Duration"],
      timestamp
    },
    toString() {
      return logToString(this);
    }
  };
};
var parseCloudWatchLog = (log, timestamp) => {
  const msg = log.replace(os.EOL, "");
  if (msg.startsWith("START")) {
    return parseStartEvent(msg, timestamp);
  }
  if (msg.startsWith("END")) {
    return parseEndEvent(msg, timestamp);
  }
  if (msg.startsWith("REPORT")) {
    return parseReportEvent(msg, timestamp);
  }
  if (KNOWN_ERROR_MESSAGES.includes(msg.trim())) {
    return {
      raw: msg,
      event: "ERROR",
      message: msg.trim(),
      info: {
        requestId: void 0,
        level: "ERROR",
        timestamp
      },
      toString() {
        return logToString(this);
      }
    };
  }
  const jsonMessage = asJson2(msg);
  if (jsonMessage) {
    return {
      raw: msg,
      event: "JSON_LOG",
      message: jsonMessage,
      info: {timestamp},
      toString() {
        return logToString(this);
      }
    };
  }
  const splitMessage = msg.split("	");
  if (splitMessage.length < 3) {
    return {
      raw: msg,
      event: "UNKNOWN",
      message: msg,
      info: {timestamp},
      toString() {
        return logToString(this);
      }
    };
  }
  let date = "";
  let reqId = "";
  let level = "";
  let text = "";
  let textParts = [];
  if (isDate(splitMessage[0])) {
    if (KNOWN_NATIVE_LOG_LEVELS.includes(splitMessage[2])) {
      [date, reqId, level, ...textParts] = splitMessage;
      text = textParts.join(`	`);
    } else {
      [date, reqId, ...textParts] = splitMessage;
      text = textParts.join(`	`);
    }
  } else if (isDate(splitMessage[1])) {
    [level, date, reqId, ...textParts] = splitMessage;
    text = textParts.join(`	`);
  } else {
    return {
      raw: msg,
      event: "UNKNOWN",
      message: msg,
      info: {timestamp},
      toString() {
        return logToString(this);
      }
    };
  }
  return {
    raw: msg,
    event: "NATIVE_LOG",
    message: text,
    info: {
      timestamp: new Date(date),
      requestId: reqId === "undefined" ? void 0 : reqId,
      level
    },
    toString() {
      return logToString(this);
    }
  };
};

// src/lib/tailLogsForLambdas/tailCloudWatchLogsForLambda.ts
var tailCloudWatchLogsForLambda = (lambdaName) => {
  const logGroupName = `/aws/lambda/${lambdaName}`;
  const cloudWatchLogs = new import_aws_sdk4.CloudWatchLogs();
  let startTime = Date.now();
  const emitter = new import_events.default();
  const getNextLogs = async () => {
    var _a;
    const {logStreams} = await cloudWatchLogs.describeLogStreams({
      logGroupName,
      descending: true,
      limit: 10,
      orderBy: "LastEventTime"
    }).promise();
    const logStreamNames = ((logStreams == null ? void 0 : logStreams.map(({logStreamName}) => logStreamName)) || []).filter(Boolean);
    const {events} = await cloudWatchLogs.filterLogEvents({
      logGroupName,
      logStreamNames,
      startTime,
      interleaved: true,
      limit: 50
    }).promise();
    if (events == null ? void 0 : events.length) {
      events.forEach((log) => {
        if (log.message) {
          emitter.emit("log", parseCloudWatchLog(log.message, log.timestamp ? new Date(log.timestamp) : new Date()));
        }
      });
      startTime = (((_a = events[events.length - 1]) == null ? void 0 : _a.timestamp) || Date.now()) + 1;
    }
  };
  let hasReportedResourceNotFoundException = false;
  const poll = () => {
    getNextLogs().catch((error) => {
      if (error.name === "ResourceNotFoundException" && !hasReportedResourceNotFoundException) {
        hasReportedResourceNotFoundException = true;
        error.message = `Lambda Log Group not found, this could mean it has not yet been invoked.`;
        emitter.emit("error", error);
      }
    });
  };
  setInterval(poll, 1e3);
  setImmediate(poll);
  return emitter;
};

// src/lib/tailLogsForLambdas/tailRealTimeLogsForLambdas.ts
var aws4 = __toModule(require("aws4"));
var AWS2 = __toModule(require("aws-sdk"));
var import_ws = __toModule(require("ws"));
var import_reconnecting_websocket = __toModule(require("reconnecting-websocket"));
var import_url = __toModule(require("url"));
var import_events2 = __toModule(require("events"));
var tailRealTimeLogsForLambdas = (endpoint, lambdas) => {
  const emitter = new import_events2.default();
  const url = new import_url.URL(endpoint);
  url.searchParams.append("lambdas", lambdas.join(","));
  const signedUrl = aws4.sign({
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: "GET"
  }, AWS2.config.credentials);
  class ReconnectWebSocket extends import_ws.default {
    constructor(address, protocols, options) {
      super(address, protocols, __assign(__assign({}, options), {headers: signedUrl.headers}));
    }
  }
  const socket = new import_reconnecting_websocket.default(`wss://${signedUrl.hostname}${signedUrl.path}`, [], {
    WebSocket: ReconnectWebSocket
  });
  socket.onopen = () => {
    emitter.emit("connect");
    setInterval(() => {
      socket.send("ping");
    }, 60 * 1e3);
    setImmediate(() => {
      socket.send("ping");
    });
  };
  socket.onclose = () => {
    emitter.emit("disconnect");
  };
  socket.onerror = (error) => {
    emitter.emit("error", error);
  };
  socket.onmessage = ({data}) => {
    const logs2 = JSON.parse(data);
    if (Array.isArray(logs2)) {
      logs2.forEach((log) => {
        emitter.emit("log", log);
      });
    }
  };
  return emitter;
};

// src/lib/createCLILoggerForLambda.ts
var import_chalk4 = __toModule(require("chalk"));
var import_cli_truncate = __toModule(require("cli-truncate"));
var createCLILoggerForLambda = (lambdaCdkPath, shouldPrefix = true) => {
  const functionName = (0, import_cli_truncate.default)(lambdaCdkPath, 20, {position: "start"});
  const prefix = shouldPrefix ? `[${import_chalk4.default.grey(functionName)}]` : "";
  return {
    prefix,
    log(...message) {
      if (prefix) {
        console.log(prefix, ...message);
      } else {
        console.log(...message);
      }
    },
    error(message) {
      const error = import_chalk4.default.red(typeof message === "string" ? message : message.toString());
      if (prefix) {
        console.error(prefix, error);
      } else {
        console.error(error);
      }
    }
  };
};

// src/lib/tailLogsForLambdas/index.ts
var tailLogsForLambdas = async (lambdaFunctions, forceCloudwatch = false) => {
  const realTimeEndpointsForLambdas = await resolveLogEndpointDetailsFromLambdas(lambdaFunctions);
  const cloudwatchFunctions = (forceCloudwatch ? Object.keys(realTimeEndpointsForLambdas) : Object.keys(realTimeEndpointsForLambdas).filter((key) => !realTimeEndpointsForLambdas[key])).map((key) => {
    const found = lambdaFunctions.find((func) => func.lambdaCdkPath === key);
    if (!found)
      throw new Error("Lambda key not found");
    return found;
  });
  const realTimeLogsFunctionMap = forceCloudwatch ? {} : Object.keys(realTimeEndpointsForLambdas).filter((key) => !!realTimeEndpointsForLambdas[key]).reduce((current, nextKey) => {
    const endpoint = realTimeEndpointsForLambdas[nextKey];
    return __assign(__assign({}, current), {
      [endpoint]: [
        ...current[endpoint] || [],
        lambdaFunctions.find(({lambdaCdkPath}) => lambdaCdkPath === nextKey)
      ]
    });
  }, {});
  cloudwatchFunctions.forEach((lambda) => {
    const logger = createCLILoggerForLambda(lambda.lambdaCdkPath, lambdaFunctions.length > 1);
    tailCloudWatchLogsForLambda(lambda.functionName).on("log", (log) => logger.log(log.toString())).on("error", (log) => logger.error(log));
  });
  const loggers = Object.values(realTimeLogsFunctionMap).flat().reduce((curr, detail) => __assign(__assign({}, curr), {
    [detail.functionName]: createCLILoggerForLambda(detail.lambdaCdkPath, lambdaFunctions.length > 1)
  }), {});
  Object.keys(realTimeLogsFunctionMap).forEach((key) => {
    tailRealTimeLogsForLambdas(key, realTimeLogsFunctionMap[key].map(({functionName}) => functionName)).on("log", (log) => {
      if (loggers[log.lambda]) {
        loggers[log.lambda].log(...log.log);
      } else {
        console.log(...log.log);
      }
    }).on("disconnect", () => {
      console.error(`Logs WebSocket Disconnected`);
      process.exit(1);
    }).on("error", (error) => {
      console.error(`WebSocket Error`, error);
      process.exit(1);
    });
  });
};

// src/commands/logs.ts
var logs = async (pathGlob, options) => {
  await runSynth({
    context: options.context || [],
    app: options.app,
    profile: options.profile
  });
  const manifest = readManifest();
  if (!manifest)
    throw new Error("cdk-watch manifest file was not found");
  initAwsSdk(manifest.region, options.profile);
  const filteredManifest = filterManifestByPath(pathGlob, manifest);
  const lambdaFunctions = await resolveLambdaNamesFromManifest(filteredManifest);
  await tailLogsForLambdas(lambdaFunctions, options.forceCloudwatch);
};

// src/lib/updateLambdaFunctionCode.ts
var import_aws_sdk5 = __toModule(require("aws-sdk"));

// src/lib/zipDirectory.ts
var import_stream_buffers = __toModule(require("stream-buffers"));
var import_archiver = __toModule(require("archiver"));
var zipDirectory = (pathToDir) => new Promise((res, rej) => {
  const output = new import_stream_buffers.WritableStreamBuffer();
  const archive = (0, import_archiver.default)("zip", {
    zlib: {level: 9}
  });
  archive.on("error", rej);
  output.on("error", rej);
  output.on("finish", () => {
    const contents = output.getContents();
    if (contents)
      res(contents);
    else
      rej(new Error("No buffer contents"));
  });
  archive.directory(pathToDir, false);
  archive.pipe(output);
  archive.finalize();
});

// src/lib/updateLambdaFunctionCode.ts
var updateLambdaFunctionCode = async (watchOutdir, functionName) => {
  const lambda = new import_aws_sdk5.Lambda({maxRetries: 10});
  return zipDirectory(watchOutdir).then((zip) => {
    return lambda.updateFunctionCode({
      FunctionName: functionName,
      ZipFile: zip
    }).promise();
  });
};

// src/commands/once.ts
var once = async (pathGlob, options) => {
  await runSynth({
    context: options.context || [],
    app: options.app,
    profile: options.profile
  });
  const manifest = readManifest();
  if (!manifest)
    throw new Error("cdk-watch manifest file was not found");
  initAwsSdk(manifest.region, options.profile);
  const filteredManifest = filterManifestByPath(pathGlob, manifest);
  const lambdaProgressText = "resolving lambda configuration";
  twisters.put("lambda", {text: lambdaProgressText});
  resolveLambdaNamesFromManifest(filteredManifest).then((result) => {
    twisters.put("lambda", {
      text: lambdaProgressText,
      active: false
    });
    return result;
  }).then((lambdaDetails) => Promise.all(lambdaDetails.map(async ({functionName, lambdaCdkPath, lambdaManifest}) => {
    const {prefix} = createCLILoggerForLambda(lambdaCdkPath);
    const lambdaUploadText = "uploading lambda function code";
    twisters.put(lambdaCdkPath, {
      meta: {prefix},
      text: lambdaUploadText
    });
    return updateLambdaFunctionCode(lambdaManifest.assetPath, functionName).then(() => twisters.put(lambdaCdkPath, {
      meta: {prefix},
      active: false,
      text: lambdaUploadText
    }));
  }))).catch((e) => {
    console.error(e);
    process.exit(1);
  });
};

// src/commands/watch.ts
var path4 = __toModule(require("path"));
var esbuild = __toModule(require("esbuild"));
var import_chalk5 = __toModule(require("chalk"));

// src/lib/copyCdkAssetToWatchOutdir.ts
var fs3 = __toModule(require("fs-extra"));

// src/lib/lambdaWatchOutdir.ts
var path3 = __toModule(require("path"));
var lambdaWatchOutdir = (lambdaManifest) => path3.join("cdk.out", CDK_WATCH_OUTDIR, path3.relative("cdk.out", lambdaManifest.assetPath));

// src/lib/copyCdkAssetToWatchOutdir.ts
var copyCdkAssetToWatchOutdir = (lambdaManifest) => {
  const watchOutdir = lambdaWatchOutdir(lambdaManifest);
  fs3.copySync(lambdaManifest.assetPath, watchOutdir, {
    errorOnExist: false,
    recursive: true,
    overwrite: true,
    dereference: true
  });
  return watchOutdir;
};

// src/commands/watch.ts
var watch = async (pathGlob, options) => {
  await runSynth({
    context: options.context || [],
    app: options.app,
    profile: options.profile
  });
  const manifest = readManifest();
  if (!manifest)
    throw new Error("cdk-watch manifest file was not found");
  initAwsSdk(manifest.region, options.profile);
  const filteredManifest = filterManifestByPath(pathGlob, manifest);
  const lambdaProgressText = "resolving lambda configuration";
  twisters.put("lambda", {text: lambdaProgressText});
  resolveLambdaNamesFromManifest(filteredManifest).then((result) => {
    twisters.put("lambda", {
      text: lambdaProgressText,
      active: false
    });
    return result;
  }).then(async (lambdaDetails) => {
    if (options.logs) {
      await tailLogsForLambdas(lambdaDetails, options.forceCloudwatch);
    }
    return Promise.all(lambdaDetails.map(async ({functionName, lambdaCdkPath, layers, lambdaManifest}) => {
      var _a, _b, _c;
      if (lambdaManifest.nodeModulesLayerVersion && !layers.includes(lambdaManifest.nodeModulesLayerVersion)) {
        console.warn(import_chalk5.default.yellow("[Warning]: Function modules layer is out of sync with published layer version, this can lead to runtime errors. To fix, do a full `cdk deploy`."));
      }
      const logger = createCLILoggerForLambda(lambdaCdkPath, lambdaDetails.length > 1);
      const watchOutdir = copyCdkAssetToWatchOutdir(lambdaManifest);
      const updateFunction = () => {
        const uploadingProgressText = "uploading function code";
        twisters.put(`${lambdaCdkPath}:uploading`, {
          meta: {prefix: logger.prefix},
          text: uploadingProgressText
        });
        return updateLambdaFunctionCode(watchOutdir, functionName).then(() => {
          twisters.put(`${lambdaCdkPath}:uploading`, {
            meta: {prefix: logger.prefix},
            text: uploadingProgressText,
            active: false
          });
        }).catch((e) => {
          twisters.put(`${lambdaCdkPath}:uploading`, {
            text: uploadingProgressText,
            meta: {error: e},
            active: false
          });
        });
      };
      if (!options.skipInitial) {
        await updateFunction();
      }
      logger.log("waiting for changes");
      esbuild.build(__assign(__assign({}, lambdaManifest.esbuildOptions), {
        outfile: path4.join(watchOutdir, "index.js"),
        treeShaking: (_a = lambdaManifest.esbuildOptions.treeShaking) != null ? _a : true,
        minify: (_b = lambdaManifest.esbuildOptions.minify) != null ? _b : true,
        logLevel: (_c = lambdaManifest.esbuildOptions.logLevel) != null ? _c : "error",
        watch: {
          onRebuild: (error) => {
            if (error) {
              logger.error(`failed to rebuild lambda function code ${error.toString()}`);
            } else {
              updateFunction();
            }
          }
        }
      })).catch((e) => {
        logger.error(`error building lambda: ${e.toString()}`);
      });
    }));
  }).catch((e) => {
    console.error(e);
    process.exit(1);
  });
};

// src/commands/index.ts
var CdkWatchCommand = class extends import_commander.Command {
  constructor(version2) {
    super();
    this.version(version2);
    const profileOption = new import_commander.Option("-p, --profile <profile>", "pass the name of the AWS profile that you want to use");
    const logsOption = new import_commander.Option("--no-logs", "don't subscribe to CloudWatch logs for each of your lambdas");
    const forceCloudwatchLogsOption = new import_commander.Option("--force-cloudwatch", "force polling cloudwatch streams rather than using real-time logs");
    const cdkContextOption = new import_commander.Option("-c, --context <key=value...>", "pass context to the cdk synth command");
    const cdkAppOption = new import_commander.Option("-a, --app <app>", "pass the --app option to the underlying synth command");
    const skipInitialOption = new import_commander.Option("--skip-initial", "prevent cdk from uploading the function code until a file has changed").default(false);
    this.command("watch", {isDefault: true}).arguments("<pathGlob>").description("for each lambda matched by the path glob, watch the source-code and redeploy on change").addHelpText("after", `
Example:
    $ cdkw "**"
    $ cdkw "MyStack/API/**"
    $ cdkw "**" --profile=planes --no-logs
`).addOption(cdkContextOption).addOption(skipInitialOption).addOption(profileOption).addOption(cdkAppOption).addOption(logsOption).addOption(forceCloudwatchLogsOption).action(watch);
    this.command("logs").arguments("<pathGlob>").description("for each lambda matched by the path glob, poll the associated log groups").addOption(cdkContextOption).addOption(profileOption).addOption(forceCloudwatchLogsOption).action(logs);
    this.command("once").arguments("<pathGlob>").description("for each lambda matched by the path glob, build and deploy the source code once").addOption(cdkContextOption).addOption(profileOption).action(once);
    this.command("list").alias("ls").arguments("<pathGlob>").description("list all lambdas matching the path glob").addOption(cdkContextOption).addOption(profileOption).action(list);
  }
};

// src/cli.ts
var {version} = fs4.readJSONSync(path5.resolve(__dirname, "../package.json"));
var program = new CdkWatchCommand(version);
program.parseAsync(process.argv).catch((e) => {
  console.log(e);
  process.exit(1);
});
