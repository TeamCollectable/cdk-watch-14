import { NodejsFunctionProps, NodejsFunction, BundlingOptions } from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import { BuildOptions } from 'esbuild';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2';
import * as lambda from '@aws-cdk/aws-lambda';
import { LayerVersion } from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';

declare class LogsLayerVersion extends LayerVersion {
    constructor(scope: Construct, id: string);
}

declare class RealTimeLambdaLogsAPI extends cdk.NestedStack {
    readonly connectFn: lambda.Function;
    readonly disconnectFn: lambda.Function;
    readonly defaultFn: lambda.Function;
    /** role needed to send messages to websocket clients */
    readonly apigwRole: iam.Role;
    readonly CDK_WATCH_CONNECTION_TABLE_NAME: string;
    readonly CDK_WATCH_API_GATEWAY_MANAGEMENT_URL: string;
    private connectionTable;
    executeApigwPolicy: iam.PolicyStatement;
    logsLayerVersion: LogsLayerVersion;
    websocketApi: apigwv2.CfnApi;
    lambdaDynamoConnectionPolicy: iam.PolicyStatement;
    constructor(scope: cdk.Construct, id: string);
    private createIntegrationStr;
    private createConnectionString;
    private createResourceStr;
    grantReadWrite: (lambdaFunction: lambda.Function) => void;
}

declare type NodeModulesSelectOption = {
    include: string[];
} | {
    exclude: string[];
};
interface WatchableBundlingOptions extends BundlingOptions {
    /**
     * Similar to `bundling.nodeModules` however in this case your modules will be
     * bundled into a Lambda layer instead of being uploaded with your lambda
     * function code. This has upside when 'watching' your code as the only code
     * that needs to be uploaded each time is your core lambda code rather than
     * any modules, which are unlikely to change frequently. You can either select
     * the modules you  want t =o include in the layer, or include all and select
     * the module's you'd like to exclude. Globs are accepted here.
     */
    nodeModulesLayer?: NodeModulesSelectOption;
}
interface WatchableNodejsFunctionProps extends NodejsFunctionProps {
    /**
     * Bundling options.
     */
    bundling?: WatchableBundlingOptions;
    /**
     * CDK Watch Options
     */
    watchOptions?: {
        /**
         * Default: `false`
         * Set to true to enable this construct to create all the
         * required infrastructure for realtime logging
         */
        realTimeLoggingEnabled?: boolean;
    };
}
/**
 * `extends` NodejsFunction and behaves the same, however `entry` is a required
 * prop to prevent duplicating logic across NodejsFunction and
 * WatchableNodejsFunction to infer `entry`.
 */
declare class WatchableNodejsFunction extends NodejsFunction {
    esbuildOptions: BuildOptions;
    cdkWatchLogsApi?: RealTimeLambdaLogsAPI;
    readonly local?: cdk.ILocalBundling;
    private readonly nodeModulesLayerVersion;
    constructor(scope: cdk.Construct, id: string, props: WatchableNodejsFunctionProps);
    /**
     * Returns all the parents of this construct's  stack (i.e. if this construct
     * is within a NestedStack etc etc).
     */
    private get parentStacks();
    /**
     * When this stack is synthesized, we output a manifest which gives the CLI
     * the info it needs to run the lambdas in watch mode. This will include the
     * logical IDs and the stack name (and logical IDs of nested stacks).
     */
    synthesize(session: cdk.ISynthesisSession): void;
}

export { WatchableNodejsFunction, WatchableNodejsFunctionProps };
