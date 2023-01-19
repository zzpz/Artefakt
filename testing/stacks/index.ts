import { App } from "@serverless-stack/resources";
import { RemovalPolicy } from "aws-cdk-lib";

import { ApiStack } from "./ApiStack";
import { StorageStack } from "./StorageStack";
import { AuthStack } from "./AuthStack";
import { WebStack } from "./WebStack";
import { ConfigStack } from "./Config";

export default function main(app: App) {
  // console.log(app.name, app.stage, app.stageName, app.outdir);

  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  });

  // Remove all resources when the dev stage is removed
  if (app.stage === "dev") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
  }
  if (app.stage === "prod") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
  }

  app.stack(ConfigStack);
  app.stack(StorageStack);
  app.stack(AuthStack).stack(ApiStack);
  app.stack(WebStack);
}
