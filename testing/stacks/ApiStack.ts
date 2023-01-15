import {
  Api as ApiGateway,
  StackContext,
  use,
} from "@serverless-stack/resources";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { AuthStack } from "./AuthStack";
import { ConfigStack } from "./Config";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack }: StackContext) {
  const { table } = use(StorageStack);
  const { bucket } = use(StorageStack);
  const { auth } = use(AuthStack);
  const config = use(ConfigStack);

  // const certArn: string =
  //   "arn:aws:acm:ap-southeast-2:759044112081:certificate/d873ad90-2f5f-49ad-a1ef-de4b61cbfe25";

  const api = new ApiGateway(stack, "api", {
    customDomain: {
      isExternalDomain: true,
      domainName: "api." + config.DOMAIN.value,
      cdk: {
        certificate: Certificate.fromCertificateArn(
          stack,
          "apiCert",
          config.API_CERT_ARN.value,
        ),
      },
    },
    cors: {
      allowOrigins: ["*"],
      allowMethods: ["GET", "POST"],
    },
    authorizers: {
      cognitoJWT: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: "cognitoJWT",
      authorizationScopes: ["user.id", "user.email"],
      function: {
        //bind the resources to all functions
        bind: [table, bucket],
      },
    },
    routes: {
      "POST /": {
        type: "function",
        function: {
          handler: "functions/lambda.main",
          functionName: "my_post_db_function",
        },
      },
      "POST /up": {
        function: "functions/create.main",
        authorizer: "none",
      },
      "GET /notes/{id}": "functions/get.main",
      "GET /notes": "functions/list.main",
    },
  });

  stack.addOutputs({
    API: api.url,
  });

  return { api };
}
