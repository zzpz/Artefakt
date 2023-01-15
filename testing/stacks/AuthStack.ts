import { Cognito, StackContext, use } from "@serverless-stack/resources";
import { ApiStack } from "./ApiStack";

export function AuthStack({ stack }: StackContext) {
  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });

  stack.addOutputs({
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });

  return {
    auth,
  };
}

// import * as iam from "aws-cdk-lib/aws-iam";
// import { Cognito, StackContext, use } from "@serverless-stack/resources";
// import { StorageStack } from "./StorageStack";
// import { Api } from "./Api";

// export function AuthStack({ stack }: StackContext) {
//   const bucket = use(StorageStack).bucket;
//   const { api } = use(Api);

//   // Create a Cognito User Pool and Identity Pool
//   const auth = new Cognito(stack, "Auth", {
//     login: ["email"],
//   });

//   auth.attachPermissionsForAuthUsers(stack,[api]);

//   auth.attachPermissionsForAuthUsers(stack, [
//     // Allow access to the API
//     api,
//     // Policy granting access to a specific folder in the bucket
//     new iam.PolicyStatement({
//       actions: ["s3:*"],
//       effect: iam.Effect.ALLOW,
//       resources: [
//         bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
//       ],
//     }),
//   ]);

//   // Show the auth resources in the output
//   stack.addOutputs({
//     Region: app.region,
//     UserPoolId: auth.userPoolId,
//     IdentityPoolId: auth.cognitoIdentityPoolId,
//     UserPoolClientId: auth.userPoolClientId,
//   });

//   // Return the auth resource
//   return {
//     auth,
//   };
// }

// //   const auth = new Cognito(stack, "Auth", {
// //     login: ["email"],
// //   });

// //   auth.attachPermissionsForAuthUsers(stack, [
// //     //Allow access to api
// //     api,
// //     //policy to grant access to a specific folder in bucket
// //     new iam.PolicyStatement({
// //       actions: ["s3:*"],
// //       effect: iam.Effect.ALLOW,
// //       resources: [
// //         bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
// //       ],
// //     }),
// //   ]);

// //   //Show the auth resources in output
// //   stack.addOutputs({
// //     Region: app.region,
// //     UserPoolID: auth.userPoolId,
// //     UserPoolClientId: auth.userPoolClientId,
// //   });

// //   // Return the auth resource
// //   return {
// //     auth,
// //   };
// // }
