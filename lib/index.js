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
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
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

// node_modules/@aws-cdk/aws-lambda-nodejs/lib/util.js
var require_util = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.LockFile = exports2.getEsBuildVersion = exports2.extractDependencies = exports2.exec = exports2.findUp = exports2.nodeMajorVersion = exports2.callsites = void 0;
  var child_process_1 = require("child_process");
  var fs5 = require("fs");
  var os = require("os");
  var path7 = require("path");
  function callsites() {
    var _a;
    const _prepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack2) => stack2;
    const stack = (_a = new Error().stack) === null || _a === void 0 ? void 0 : _a.slice(1);
    Error.prepareStackTrace = _prepareStackTrace;
    return stack;
  }
  exports2.callsites = callsites;
  function nodeMajorVersion() {
    return parseInt(process.versions.node.split(".")[0], 10);
  }
  exports2.nodeMajorVersion = nodeMajorVersion;
  function findUp3(name, directory = process.cwd()) {
    const absoluteDirectory = path7.resolve(directory);
    const file = path7.join(directory, name);
    if (fs5.existsSync(file)) {
      return file;
    }
    const {root} = path7.parse(absoluteDirectory);
    if (absoluteDirectory === root) {
      return void 0;
    }
    return findUp3(name, path7.dirname(absoluteDirectory));
  }
  exports2.findUp = findUp3;
  function exec(cmd, args, options) {
    var _a, _b;
    const proc = child_process_1.spawnSync(cmd, args, options);
    if (proc.error) {
      throw proc.error;
    }
    if (proc.status !== 0) {
      if (proc.stdout || proc.stderr) {
        throw new Error(`[Status ${proc.status}] stdout: ${(_a = proc.stdout) === null || _a === void 0 ? void 0 : _a.toString().trim()}


stderr: ${(_b = proc.stderr) === null || _b === void 0 ? void 0 : _b.toString().trim()}`);
      }
      throw new Error(`${cmd} exited with status ${proc.status}`);
    }
    return proc;
  }
  exports2.exec = exec;
  function extractDependencies2(pkgPath, modules) {
    var _a, _b, _c, _d;
    const dependencies = {};
    const pkgJson = require(pkgPath);
    const pkgDependencies = __assign(__assign(__assign({}, (_a = pkgJson.dependencies) !== null && _a !== void 0 ? _a : {}), (_b = pkgJson.devDependencies) !== null && _b !== void 0 ? _b : {}), (_c = pkgJson.peerDependencies) !== null && _c !== void 0 ? _c : {});
    for (const mod of modules) {
      try {
        const version = (_d = pkgDependencies[mod]) !== null && _d !== void 0 ? _d : require(`${mod}/package.json`).version;
        dependencies[mod] = version;
      } catch (err) {
        throw new Error(`Cannot extract version for module '${mod}'. Check that it's referenced in your package.json or installed.`);
      }
    }
    return dependencies;
  }
  exports2.extractDependencies = extractDependencies2;
  function getEsBuildVersion() {
    try {
      const npx = os.platform() === "win32" ? "npx.cmd" : "npx";
      const esbuild = child_process_1.spawnSync(npx, ["--no-install", "esbuild", "--version"]);
      if (esbuild.status !== 0 || esbuild.error) {
        return void 0;
      }
      return esbuild.stdout.toString().trim();
    } catch (err) {
      return void 0;
    }
  }
  exports2.getEsBuildVersion = getEsBuildVersion;
  var LockFile2;
  (function(LockFile3) {
    LockFile3["NPM"] = "package-lock.json";
    LockFile3["YARN"] = "yarn.lock";
  })(LockFile2 = exports2.LockFile || (exports2.LockFile = {}));
});

// src/index.ts
__markAsModule(exports);
__export(exports, {
  WatchableNodejsFunction: () => WatchableNodejsFunction
});

// src/constructs/WatchableNodejsFunction.ts
var import_aws_lambda_nodejs = __toModule(require("@aws-cdk/aws-lambda-nodejs"));
var import_aws_lambda3 = __toModule(require("@aws-cdk/aws-lambda"));
var import_aws_s3_assets = __toModule(require("@aws-cdk/aws-s3-assets"));
var path6 = __toModule(require("path"));
var fs4 = __toModule(require("fs-extra"));
var import_find_up = __toModule(require("find-up"));
var cdk2 = __toModule(require("@aws-cdk/core"));
var import_minimatch = __toModule(require("minimatch"));

// src/lib/readManifest.ts
var path = __toModule(require("path"));
var fs = __toModule(require("fs-extra"));

// src/consts.ts
var CDK_WATCH_MANIFEST_FILE_NAME = "manifest.cdk-watch.json";
var CDK_WATCH_OUTDIR = "cdk-watch";
var CDK_WATCH_CONTEXT_LOGS_ENABLED = "cdk-watch:forceRealTimeLoggingEnabled";
var CDK_WATCH_CONTEXT_NODE_MODULES_DISABLED = "cdk-watch:nodeModulesInstallDisabled";

// src/lib/readManifest.ts
var readManifest = () => {
  const manifestPath = path.join(process.cwd(), "cdk.out", CDK_WATCH_MANIFEST_FILE_NAME);
  return fs.readJsonSync(manifestPath, {throws: false});
};

// src/lib/writeManifest.ts
var path2 = __toModule(require("path"));
var fs2 = __toModule(require("fs-extra"));
var writeManifest = (manifest) => {
  const cdkOut = path2.join(process.cwd(), "cdk.out");
  const manifestPath = path2.join(cdkOut, CDK_WATCH_MANIFEST_FILE_NAME);
  fs2.ensureDirSync(cdkOut);
  fs2.writeJsonSync(manifestPath, manifest);
};

// src/constructs/RealTimeLambdaLogsAPI.ts
var path4 = __toModule(require("path"));
var cdk = __toModule(require("@aws-cdk/core"));
var dynamodb = __toModule(require("@aws-cdk/aws-dynamodb"));
var apigwv2 = __toModule(require("@aws-cdk/aws-apigatewayv2"));
var lambda = __toModule(require("@aws-cdk/aws-lambda"));
var logs = __toModule(require("@aws-cdk/aws-logs"));
var iam = __toModule(require("@aws-cdk/aws-iam"));
var import_core2 = __toModule(require("@aws-cdk/core"));

// src/constructs/LogsLayerVersion.ts
var path3 = __toModule(require("path"));
var import_aws_lambda = __toModule(require("@aws-cdk/aws-lambda"));
var import_core = __toModule(require("@aws-cdk/core"));
var LogsLayerVersion = class extends import_aws_lambda.LayerVersion {
  constructor(scope, id) {
    super(scope, id, {
      removalPolicy: import_core.RemovalPolicy.DESTROY,
      description: "Catches Lambda Logs and sends them to API Gateway Connections",
      code: import_aws_lambda.Code.fromAsset(path3.join(__dirname, "lambda-extension"))
    });
  }
};

// src/constructs/RealTimeLambdaLogsAPI.ts
var RealTimeLambdaLogsAPI = class extends cdk.NestedStack {
  constructor(scope, id) {
    super(scope, id);
    this.createIntegrationStr = (region, fnArn) => `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${fnArn}/invocations`;
    this.createConnectionString = (route, region, ref) => `https://${ref}.execute-api.${region}.amazonaws.com/${route}`;
    this.createResourceStr = (accountId, region, ref) => `arn:aws:execute-api:${region}:${accountId}:${ref}/*`;
    this.grantReadWrite = (lambdaFunction) => {
      this.connectionTable.grantReadWriteData(lambdaFunction);
    };
    const stack = import_core2.Stack.of(this);
    const routeSelectionKey = "action";
    const websocketHandlerCodePath = path4.join(__dirname, "websocketHandlers");
    this.logsLayerVersion = new LogsLayerVersion(this, "LogsLayerVersion");
    const websocketTable = new dynamodb.Table(this, "connections", {
      partitionKey: {
        name: "connectionId",
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
      writeCapacity: 5,
      readCapacity: 5
    });
    this.websocketApi = new apigwv2.CfnApi(this, "LogsWebsocketApi", {
      protocolType: "WEBSOCKET",
      routeSelectionExpression: `$request.body.${routeSelectionKey}`,
      name: `${id}LogsWebsocketApi`
    });
    const basePermissions = websocketTable.tableArn;
    const indexPermissions = `${basePermissions}/index/*`;
    this.lambdaDynamoConnectionPolicy = new iam.PolicyStatement({
      actions: ["dynamodb:*"],
      resources: [basePermissions, indexPermissions]
    });
    const connectLambdaRole = new iam.Role(this, "connect-lambda-role", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com")
    });
    connectLambdaRole.addToPolicy(this.lambdaDynamoConnectionPolicy);
    connectLambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
    const disconnectLambdaRole = new iam.Role(this, "disconnect-lambda-role", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com")
    });
    disconnectLambdaRole.addToPolicy(this.lambdaDynamoConnectionPolicy);
    disconnectLambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
    const messageLambdaRole = new iam.Role(this, "message-lambda-role", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com")
    });
    messageLambdaRole.addToPolicy(this.lambdaDynamoConnectionPolicy);
    messageLambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
    const resourceStr = this.createResourceStr(stack.account, stack.region, this.websocketApi.ref);
    this.executeApigwPolicy = new iam.PolicyStatement({
      actions: ["execute-api:Invoke", "execute-api:ManageConnections"],
      resources: [resourceStr],
      effect: iam.Effect.ALLOW
    });
    const lambdaProps = {
      code: lambda.Code.fromAsset(websocketHandlerCodePath),
      timeout: cdk.Duration.seconds(300),
      runtime: lambda.Runtime.NODEJS_14_X,
      logRetention: logs.RetentionDays.FIVE_DAYS,
      role: disconnectLambdaRole,
      environment: {
        CDK_WATCH_CONNECTION_TABLE_NAME: websocketTable.tableName
      }
    };
    const connectLambda = new lambda.Function(this, "ConnectLambda", __assign({
      handler: "index.onConnect",
      description: "Connect a user."
    }, lambdaProps));
    const disconnectLambda = new lambda.Function(this, "DisconnectLambda", __assign({
      handler: "index.onDisconnect",
      description: "Disconnect a user."
    }, lambdaProps));
    const defaultLambda = new lambda.Function(this, "DefaultLambda", __assign({
      handler: "index.onMessage",
      description: "Default"
    }, lambdaProps));
    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [
        connectLambda.functionArn,
        disconnectLambda.functionArn,
        defaultLambda.functionArn
      ],
      actions: ["lambda:InvokeFunction"]
    });
    const role = new iam.Role(this, `LogsWebsocketIamRole`, {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com")
    });
    role.addToPolicy(policy);
    const connectIntegration = new apigwv2.CfnIntegration(this, "connect-lambda-integration", {
      apiId: this.websocketApi.ref,
      integrationType: "AWS_PROXY",
      integrationUri: this.createIntegrationStr(stack.region, connectLambda.functionArn),
      credentialsArn: role.roleArn
    });
    const disconnectIntegration = new apigwv2.CfnIntegration(this, "disconnect-lambda-integration", {
      apiId: this.websocketApi.ref,
      integrationType: "AWS_PROXY",
      integrationUri: this.createIntegrationStr(stack.region, disconnectLambda.functionArn),
      credentialsArn: role.roleArn
    });
    const defaultIntegration = new apigwv2.CfnIntegration(this, "default-lambda-integration", {
      apiId: this.websocketApi.ref,
      integrationType: "AWS_PROXY",
      integrationUri: this.createIntegrationStr(stack.region, defaultLambda.functionArn),
      credentialsArn: role.roleArn
    });
    const connectRoute = new apigwv2.CfnRoute(this, "connect-route", {
      apiId: this.websocketApi.ref,
      routeKey: "$connect",
      authorizationType: "AWS_IAM",
      target: `integrations/${connectIntegration.ref}`
    });
    const disconnectRoute = new apigwv2.CfnRoute(this, "disconnect-route", {
      apiId: this.websocketApi.ref,
      routeKey: "$disconnect",
      authorizationType: "NONE",
      target: `integrations/${disconnectIntegration.ref}`
    });
    const defaultRoute = new apigwv2.CfnRoute(this, "default-route", {
      apiId: this.websocketApi.ref,
      routeKey: "$default",
      authorizationType: "NONE",
      target: `integrations/${defaultIntegration.ref}`
    });
    this.connectFn = connectLambda;
    this.disconnectFn = disconnectLambda;
    this.defaultFn = defaultLambda;
    this.connectionTable = websocketTable;
    this.apigwRole = messageLambdaRole;
    const apigwWssDeployment = new apigwv2.CfnDeployment(this, "apigw-deployment", {apiId: this.websocketApi.ref});
    const apiStage = new apigwv2.CfnStage(this, "apigw-stage", {
      apiId: this.websocketApi.ref,
      autoDeploy: true,
      deploymentId: apigwWssDeployment.ref,
      stageName: "v1",
      defaultRouteSettings: {
        throttlingBurstLimit: 500,
        throttlingRateLimit: 1e3
      }
    });
    const routes = new cdk.ConcreteDependable();
    routes.add(connectRoute);
    routes.add(disconnectRoute);
    routes.add(defaultRoute);
    apigwWssDeployment.node.addDependency(routes);
    this.CDK_WATCH_CONNECTION_TABLE_NAME = websocketTable.tableName;
    this.CDK_WATCH_API_GATEWAY_MANAGEMENT_URL = this.createConnectionString(apiStage.stageName, stack.region, this.websocketApi.ref);
  }
};

// src/constructs/NodeModulesLayer.ts
var import_aws_lambda2 = __toModule(require("@aws-cdk/aws-lambda"));
var import_util = __toModule(require_util());
var import_core3 = __toModule(require("@aws-cdk/core"));
var import_execa = __toModule(require("execa"));
var fs3 = __toModule(require("fs-extra"));
var path5 = __toModule(require("path"));
var import_object_hash = __toModule(require("object-hash"));
var Installer;
(function(Installer2) {
  Installer2["NPM"] = "npm";
  Installer2["YARN"] = "yarn";
})(Installer || (Installer = {}));
var getDepsLock = (propsDepsLockFilePath) => {
  var _a;
  let depsLockFilePath;
  if (propsDepsLockFilePath) {
    if (!fs3.existsSync(propsDepsLockFilePath)) {
      throw new Error(`Lock file at ${propsDepsLockFilePath} doesn't exist`);
    }
    if (!fs3.statSync(propsDepsLockFilePath).isFile()) {
      throw new Error("`depsLockFilePath` should point to a file");
    }
    depsLockFilePath = path5.resolve(propsDepsLockFilePath);
  } else {
    const lockFile = (_a = (0, import_util.findUp)(import_util.LockFile.YARN)) != null ? _a : (0, import_util.findUp)(import_util.LockFile.NPM);
    if (!lockFile) {
      throw new Error("Cannot find a package lock file (`yarn.lock` or `package-lock.json`). Please specify it with `depsFileLockPath`.");
    }
    depsLockFilePath = lockFile;
  }
  return depsLockFilePath;
};
var NodeModulesLayer = class extends import_aws_lambda2.LayerVersion {
  constructor(scope, id, props) {
    const depsLockFilePath = getDepsLock(props.depsLockFilePath);
    const {pkgPath} = props;
    const dependenciesPackageJson = {
      dependencies: (0, import_util.extractDependencies)(pkgPath, props.nodeModules)
    };
    let installer = Installer.NPM;
    let lockFile = import_util.LockFile.NPM;
    if (depsLockFilePath.endsWith(import_util.LockFile.YARN)) {
      lockFile = import_util.LockFile.YARN;
      installer = Installer.YARN;
    }
    const layerBase = path5.join(process.cwd(), "cdk.out", CDK_WATCH_OUTDIR, "node-module-layers", scope.node.addr);
    const outputDir = path5.join(layerBase, "nodejs");
    fs3.ensureDirSync(outputDir);
    fs3.copyFileSync(depsLockFilePath, path5.join(outputDir, lockFile));
    fs3.writeJsonSync(path5.join(outputDir, "package.json"), dependenciesPackageJson);
    const layerVersion = (0, import_object_hash.default)(dependenciesPackageJson);
    if (!props.skip) {
      console.log("Installing node_modules in layer");
      import_execa.default.sync(installer, ["install"], {
        cwd: outputDir,
        stderr: "inherit",
        stdout: "ignore",
        stdin: "ignore"
      });
    }
    super(scope, id, {
      removalPolicy: import_core3.RemovalPolicy.DESTROY,
      description: "NodeJS Modules Packaged into a Layer by cdk-watch",
      code: import_aws_lambda2.Code.fromAsset(layerBase),
      layerVersionName: layerVersion
    });
    this.layerVersion = layerVersion;
  }
};

// src/constructs/WatchableNodejsFunction.ts
var getNodeModuleLayerDependencies = (pkgJsonPath, selectOption) => {
  if ("include" in selectOption) {
    return selectOption.include;
  }
  const packageJson = fs4.readJSONSync(pkgJsonPath);
  return Object.keys(packageJson.dependencies || {}).filter((key) => !selectOption.exclude.some((pattern) => (0, import_minimatch.default)(key, pattern)));
};
var WatchableNodejsFunction = class extends import_aws_lambda_nodejs.NodejsFunction {
  constructor(scope, id, props) {
    var _a, _b, _c, _d, _e, _f;
    if (!props.entry)
      throw new Error("Expected props.entry");
    const pkgPath = import_find_up.default.sync("package.json", {
      cwd: path6.dirname(props.entry)
    });
    if (!pkgPath) {
      throw new Error("Cannot find a `package.json` in this project. Using `nodeModules` requires a `package.json`.");
    }
    const nodeModulesLayerSelectOption = (_a = props.bundling) == null ? void 0 : _a.nodeModulesLayer;
    let moduleNames = null;
    if (nodeModulesLayerSelectOption) {
      moduleNames = getNodeModuleLayerDependencies(pkgPath, nodeModulesLayerSelectOption);
    }
    const bundling = __assign(__assign({}, props.bundling), {
      externalModules: [
        ...moduleNames || [],
        ...((_b = props.bundling) == null ? void 0 : _b.externalModules) || ["aws-sdk"]
      ]
    });
    super(scope, id, __assign(__assign({}, props), {
      bundling
    }));
    const shouldSkipInstall = scope.node.tryGetContext(CDK_WATCH_CONTEXT_NODE_MODULES_DISABLED) === "1";
    if (moduleNames) {
      const nodeModulesLayer = new NodeModulesLayer(this, "NodeModulesLayer", {
        nodeModules: moduleNames,
        pkgPath,
        depsLockFilePath: props.depsLockFilePath,
        skip: shouldSkipInstall
      });
      this.addLayers(nodeModulesLayer);
      this.nodeModulesLayerVersion = nodeModulesLayer.layerVersion;
    }
    const {entry} = props;
    if (!entry)
      throw new Error("`entry` must be provided");
    const targetMatch = (props.runtime || import_aws_lambda3.Runtime.NODEJS_12_X).name.match(/nodejs(\d+)/);
    if (!targetMatch) {
      throw new Error("Cannot extract version from runtime.");
    }
    const target = `node${targetMatch[1]}`;
    this.esbuildOptions = {
      target,
      bundle: true,
      entryPoints: [entry],
      platform: "node",
      minify: (_c = bundling == null ? void 0 : bundling.minify) != null ? _c : false,
      sourcemap: bundling == null ? void 0 : bundling.sourceMap,
      external: [
        ...(_d = bundling == null ? void 0 : bundling.externalModules) != null ? _d : ["aws-sdk"],
        ...(_e = bundling == null ? void 0 : bundling.nodeModules) != null ? _e : [],
        ...moduleNames != null ? moduleNames : []
      ],
      loader: bundling == null ? void 0 : bundling.loader,
      define: bundling == null ? void 0 : bundling.define,
      logLevel: bundling == null ? void 0 : bundling.logLevel,
      keepNames: bundling == null ? void 0 : bundling.keepNames,
      tsconfig: (bundling == null ? void 0 : bundling.tsconfig) ? path6.resolve(entry, path6.resolve(bundling == null ? void 0 : bundling.tsconfig)) : import_find_up.default.sync("tsconfig.json", {cwd: path6.dirname(entry)}),
      banner: bundling == null ? void 0 : bundling.banner,
      footer: bundling == null ? void 0 : bundling.footer
    };
    if (scope.node.tryGetContext(CDK_WATCH_CONTEXT_LOGS_ENABLED) || ((_f = props.watchOptions) == null ? void 0 : _f.realTimeLoggingEnabled)) {
      const [rootStack] = this.parentStacks;
      const logsApiId = "CDKWatchWebsocketLogsApi";
      this.cdkWatchLogsApi = rootStack.node.tryFindChild(logsApiId) || new RealTimeLambdaLogsAPI(rootStack, logsApiId);
      this.addEnvironment("AWS_LAMBDA_EXEC_WRAPPER", "/opt/cdk-watch-lambda-wrapper/index.js");
      this.addLayers(this.cdkWatchLogsApi.logsLayerVersion);
      this.addToRolePolicy(this.cdkWatchLogsApi.executeApigwPolicy);
      this.addToRolePolicy(this.cdkWatchLogsApi.lambdaDynamoConnectionPolicy);
      this.addEnvironment("CDK_WATCH_CONNECTION_TABLE_NAME", this.cdkWatchLogsApi.CDK_WATCH_CONNECTION_TABLE_NAME);
      this.addEnvironment("CDK_WATCH_API_GATEWAY_MANAGEMENT_URL", this.cdkWatchLogsApi.CDK_WATCH_API_GATEWAY_MANAGEMENT_URL);
    }
  }
  get parentStacks() {
    const parents = [this.stack];
    while (parents[0].nestedStackParent) {
      parents.unshift(parents[0].nestedStackParent);
    }
    return parents;
  }
  synthesize(session) {
    var _a;
    super.synthesize(session);
    const asset = this.node.findAll().find((construct) => construct instanceof import_aws_s3_assets.Asset);
    if (!asset) {
      throw new Error("WatchableNodejsFunction could not find an Asset in it's children");
    }
    const assetPath = path6.join(session.outdir, asset.assetPath);
    const [rootStack, ...nestedStacks] = this.parentStacks;
    const cdkWatchManifest = readManifest() || {
      region: this.stack.region,
      lambdas: {}
    };
    if (cdk2.Token.isUnresolved(this.stack.region)) {
      throw new Error("`stack.region` is an unresolved token. `cdk-watch` requires a concrete region to be set.");
    }
    cdkWatchManifest.region = this.stack.region;
    cdkWatchManifest.lambdas = typeof cdkWatchManifest.lambdas === "object" ? cdkWatchManifest.lambdas : {};
    cdkWatchManifest.lambdas[this.node.path] = {
      assetPath,
      nodeModulesLayerVersion: this.nodeModulesLayerVersion,
      realTimeLogsStackLogicalId: this.cdkWatchLogsApi ? this.stack.getLogicalId(this.cdkWatchLogsApi.nestedStackResource) : void 0,
      realTimeLogsApiLogicalId: ((_a = this.cdkWatchLogsApi) == null ? void 0 : _a.websocketApi) ? this.stack.getLogicalId(this.cdkWatchLogsApi.websocketApi) : void 0,
      esbuildOptions: this.esbuildOptions,
      lambdaLogicalId: this.stack.getLogicalId(this.node.defaultChild),
      rootStackName: rootStack.stackName,
      nestedStackLogicalIds: nestedStacks.map((nestedStack) => {
        var _a2;
        return (_a2 = nestedStack.nestedStackParent) == null ? void 0 : _a2.getLogicalId(nestedStack.nestedStackResource);
      })
    };
    writeManifest(cdkWatchManifest);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WatchableNodejsFunction
});
