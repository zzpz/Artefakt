import { PresignedPostOptions } from "@aws-sdk/s3-presigned-post";
import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";
import { Bucket } from "sst/node/bucket";
import uploads from "util/uploads"; //presignedpost
import { monotonicFactory } from "ulid";

import handler from "util/handler";

export const main = handler(async (
  event,
) => {
  //validate input
  // TODO: middy / trpc / zod
  const input = event.body ?? JSON.stringify({ fail: "fail" });
  const validatedInput = JSON.parse(input);

  let valid = true;
  let authorised = false;
  var groups: string =
    event.requestContext?.authorizer?.jwt.claims["cognito:groups"] ?? " error ";

  //generate the Key for insert
  const ulid = monotonicFactory();

  //validate authorised group
  groups = groups.substring(1, groups.length - 1);

  if (groups === "error") {
    throw new Error("not authorised");
  } else {
    groups = groups.split(",");
  }

  //narrow to array
  if (Array.isArray(groups)) {
    authorised = groups.includes("historian");
  }

  if (authorised && valid) { //and valid (we shouldn't be doing this here)
    //renaming fields to be x-amz-meta-field

    //extract all keys and the file type
    let { fileType, ...reqFields } = validatedInput.fields;
    reqFields = renameKeys(reqFields);
    reqFields["Content-Type"] = fileType;

    const options: PresignedPostOptions = {
      Bucket: Bucket.Uploads.bucketName,
      Key: ulid(),
      Fields: reqFields ? reqFields : { "acl": "private" },
      Conditions: undefined, // required if we send auth headers to s3 post url
      Expires: 600,
    };

    const { url, fields } = await uploads.getUrlWithKeys(options);
    return (
      { url: url, fields: fields }
    );
  }

  //rename fields to x-amz-meta-field

  function renameKeys(obj) {
    const keyValues = Object.keys(obj).map((key) => {
      const newKey = "x-amz-meta-" + key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }
});
