import { StackContext, StaticSite, use } from "@serverless-stack/resources";
import { AuthStack } from "./AuthStack";
import { ApiStack } from "./ApiStack";
import {
  AllowedMethods,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ConfigStack } from "./Config";

export function WebStack({ stack }: StackContext) {
  const config = use(ConfigStack);
  const certArn: string = config.SITE_CERT_ARN.value;
  const domain: string = config.DOMAIN.value;

  const { auth } = use(AuthStack);
  const { api } = use(ApiStack); // Not sure why this destructuring like this is necessary vs {api}

  const site = new StaticSite(stack, "frontend", {
    disablePlaceholder: false,
    path: "frontend/testfront",
    buildOutput: "build",
    buildCommand: "npm run build",
    environment: {
      REACT_APP_USER_POOL_ID: auth.userPoolId,
      REACT_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      REACT_APP_APP_STAGE: stack.stage,
      REACT_APP_DOMAIN: domain,
      REACT_APP_API_URL: api.url,
    },
    customDomain: {
      isExternalDomain: true,
      domainName: domain,
      // domainAlias: alias, Domain alias is only supported for domains hosted on Amazon Route 53
      cdk: {
        certificate: Certificate.fromCertificateArn(stack, "WebCert", certArn),
      },
    },
    cdk: {
      distribution: {
        defaultBehavior: {
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        },
        comment: "Distribution for my React website",
      },
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
    // apiweburl: api.url,
  });

  return site;
}
