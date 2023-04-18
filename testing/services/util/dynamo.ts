// export default {}; //to delete, move ORM into or become service discovery for clients + tables
import { Table } from "sst/node/table";

//v3 SDK
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"; // ES6 import

const region = "ap-southeast-2";

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: false, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: true, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

const dbclient = new DynamoDBClient({ region });
const client = DynamoDBDocumentClient.from(dbclient, translateConfig);

//table is from storageStack->APIStack->bind()  -- currently ALL functions have access to the table
const table = Table.Items.tableName; //TODO: there must be a way to programatically bind "Items"

export { client, table };
