import { PresignedPostOptions } from "@aws-sdk/s3-presigned-post";
import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";
import { Bucket } from "@serverless-stack/node/bucket";
import uploads from "util/uploads"; //presignedpost

import handler from "util/handler";

export const main = handler(async (
  event,
) => {
  //validate input
  const input = event.body ?? JSON.stringify({ fail: "fail" });
  const validatedInput = JSON.parse(input);
  let authorised = false;
  var groups: string =
    event.requestContext?.authorizer?.jwt.claims["cognito:groups"] ?? " error ";

  //validate authorised group
  groups = groups.substring(1, groups.length - 1);

  if (groups === "error") {
    throw new Error("not authorised");
  } else {
    groups = groups.split(",");
  }

  //narrow
  if (Array.isArray(groups)) {
    authorised = groups.includes("historian");
  }

  if (authorised) {
    const options: PresignedPostOptions = {
      Bucket: Bucket.Uploads.bucketName,
      Key: validatedInput.Key ? validatedInput.Key : "error", //this is not good validating
      Fields: validatedInput.Fields
        ? validatedInput.Fields
        : { "acl": "private" },
      Conditions: validatedInput.Conditions
        ? validatedInput.Conditions
        : undefined,
      Expires: 600,
    };

    const { url, fields } = await uploads.getUrlWithKeys(options);
    return (
      { url: url, fields: fields }
    );
  }
});
