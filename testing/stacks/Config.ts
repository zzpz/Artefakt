import { Config, StackContext } from "@serverless-stack/resources";
import { Certificate, ICertificate } from "aws-cdk-lib/aws-certificatemanager";
//create the Certificates here and then make their ARN's paramaters
export function ConfigStack({ stack }: StackContext) {
  // const c: ICertificate = new Certificate(stack,id)

  const APP_VERSION = new Config.Parameter(stack, "APP_VERSION", {
    value: process.env["APP_VERSION"] || "error",
  });
  const API_CERT_ARN = new Config.Parameter(stack, "API_CERT_ARN", {
    value: process.env["API_CERT_ARN"] || "error",
  });
  const SITE_CERT_ARN = new Config.Parameter(stack, "SITE_CERT_ARN", {
    value: process.env["SITE_CERT_ARN"] || "error",
  });
  const DOMAIN = new Config.Parameter(stack, "DOMAIN", {
    value: process.env["DOMAIN"] || "error",
  });

  stack.addOutputs({ //creates paramaters in SSM
    APPVER: APP_VERSION,
    API_CERT: API_CERT_ARN,
    SITE_CERT: SITE_CERT_ARN,
  });

  return {
    APP_VERSION,
    API_CERT_ARN,
    SITE_CERT_ARN,
    DOMAIN,
  };
}
