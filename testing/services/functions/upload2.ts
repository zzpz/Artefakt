import handler from "../util/handler";
import uploads from "../util/uploads";
import { PresignedPostOptions } from "@aws-sdk/s3-presigned-post";
import { Bucket } from "@serverless-stack/node/bucket";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";

//** todo: review this with V2 to use APIHandler() */
export const main = handler(
  async (event: APIGatewayProxyEventV2) => {
    event.headers;
    // we receive JSON
    // TODO: validate inputs --> zod? trpc?

    const validatedInput = JSON.parse(event.body!);

    const options: PresignedPostOptions = {
      Bucket: Bucket.Uploads.bucketName,
      Key: validatedInput.Key ? validatedInput.Key : "error", //this is an error
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
  },
);
