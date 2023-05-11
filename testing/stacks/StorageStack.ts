import { Bucket, StackContext, Table, use } from "sst/constructs";
import { ConfigStack } from "./Config";

export function StorageStack({ stack }: StackContext) {
  // Create the DynamoDB table

  //config import dependency?
  const config = use(ConfigStack);

  const dynamoName: string = config.DYNAMO_TABLE.value; //CloudFormation cannot update a stack when a custom-named resource requires replacing
  const table = new Table(stack, dynamoName, {
    fields: {
      pk: "string",
      sk: "string",
      gsi1pk: "string",
      gsi1sk: "string",
      gsi2pk: "string",
      gsi2sk: "string"
    },
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
    globalIndexes: {
      "gsi1pk-gsi1sk-index": {
        partitionKey: "gsi1pk",
        sortKey: "gsi1sk",
        projection: "all", //TODO: pretty sure I can project specified attributes
      },
      "gsi2pk-gsi2sk-index": {
        partitionKey: "gsi2pk",
        sortKey: "gsi2sk",
        projection: "all", //TODO: pretty sure I can project specified attributes
      },
    },
  });

  //create S3 storage
  const bucket = new Bucket(stack, "Uploads", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
  });

  return {
    table,
    bucket,
  };
}
