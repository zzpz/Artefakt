import { S3Client } from "@aws-sdk/client-s3";
import {
  createPresignedPost,
  PresignedPostOptions,
} from "@aws-sdk/s3-presigned-post";
const region: string = "ap-southeast-2";
const client = new S3Client({});

createPresignedPost;

export default {
  client,
  region,
  getUrlWithKeys: (params: PresignedPostOptions) =>
    createPresignedPost(client, params),
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html
