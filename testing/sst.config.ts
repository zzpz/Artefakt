// replaces stacks/index.ts and sst.json

import type { SSTConfig } from "sst"
import { RemovalPolicy } from "aws-cdk-lib";

import { ApiStack } from "./stacks/ApiStack";
import { StorageStack } from "./stacks/StorageStack";
import { AuthStack } from "./stacks/AuthStack";
import { WebStack } from "./stacks/WebStack";
import { ConfigStack } from "./stacks/Config";


export default {
  config(input) {
    return {
      name: "testing",
      region: "ap-southeast-2",
    //   profile: "my-company-dev"
    }
  },
  stacks(app) {
    app.setDefaultFunctionProps({
        runtime: "nodejs16.x",
        architecture: "arm_64",
        // srcPath: "services",
        // bundle: {
        //   format: "esm",
        // },
      })
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
  app.stack(WebStack)
    },

} satisfies SSTConfig



// {
//     "name": "testing",
//     "region": "ap-southeast-2",
//     "main": "stacks/index.ts"
//   }
  


// import { App } from "sst/constructs";
// import { RemovalPolicy } from "aws-cdk-lib";

// import { ApiStack } from "./ApiStack";
// import { StorageStack } from "./StorageStack";
// import { AuthStack } from "./AuthStack";
// import { WebStack } from "./WebStack";
// import { ConfigStack } from "./Config";

// export default function main(app: App) {
//   // console.log(app.name, app.stage, app.stageName, app.outdir);

//   app.setDefaultFunctionProps({
//     runtime: "nodejs16.x",
//     srcPath: "services",
//     bundle: {
//       format: "esm",
//     },
//   });

//   // Remove all resources when the dev stage is removed
//   if (app.stage === "dev") {
//     app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
//   }
//   if (app.stage === "prod") {
//     app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
//   }

//   app.stack(ConfigStack);
//   app.stack(StorageStack);
//   app.stack(AuthStack).stack(ApiStack);
//   app.stack(WebStack);
// }