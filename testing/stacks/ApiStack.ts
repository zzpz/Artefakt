import { Api as ApiGateway, StackContext, use } from "sst/constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { AuthStack } from "./AuthStack";
import { ConfigStack } from "./Config";
import { StorageStack } from "./StorageStack";

const functionPathPrefix = "services/";

export function ApiStack({ stack }: StackContext) {
  const { table } = use(StorageStack);
  const { bucket } = use(StorageStack);
  const { auth } = use(AuthStack);
  const config = use(ConfigStack);

  const apiDomain = stack.stage === "dev"
    ? "dev.api.qura.website"
    : "api." + config.DOMAIN.value;

  const api = new ApiGateway(stack, "api", {
    customDomain: {
      isExternalDomain: true,
      domainName: apiDomain,
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
      jwt: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: "jwt",
      // 403 - Forbidden - When the JWT validation is successful but the required scopes are not met
      // authorizationScopes: ["user.id", "user.email"],
      function: {
        //bind the resources to all functions
        bind: [table, bucket],
        //TODO: we will want to bind the bucket for uploads specifically later
      },
    },
    routes: {
      "POST /": {
        type: "function",
        function: {
          handler: functionPathPrefix + "functions/lambda.main",
        },
      },
      "POST /up": {
        function: functionPathPrefix + "functions/create.main",
        authorizer: "none",
      },
      "GET /notes/{id}": functionPathPrefix + "functions/get.main",
      "GET /notes": functionPathPrefix + "functions/list.main",
      "POST /upload": {
        function: functionPathPrefix + "functions/upload.main",
        authorizer: "jwt", // TODO: authorizer for getting a signedurl
      },
    },
  });

  //add auth permissions for users here?
  auth.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    API: api.url,
    domain: api.customDomainUrl || "err",
  });

  return { api };
}
