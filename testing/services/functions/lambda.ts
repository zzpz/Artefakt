import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { Bucket } from "sst/node/bucket";

const dynamoDb = new DynamoDB.DocumentClient();

export async function main() {
  const getParams = {
    // Get the table name from the environment variable
    TableName: Table.Items.tableName,
    // Get the row where the counter is called "hits"
    Key: {
      itemID: "id1",
      version: "test",
    },
  };

  const results = await dynamoDb.get(getParams).promise();

  // If there is a row, then get the value of the
  // column called "tally"
  let count = results.Item ? results.Item.tally : 0;

  const putParams = {
    TableName: Table.Items.tableName,
    Key: {
      itemID: "id1",
      version: "test",
    },
    UpdateExpression: "Set myList = :myList, tally = :count",
    ExpressionAttributeValues: {
      ":myList": ["comment1", "comment2"],
      ":count": ++count,
    },
    // Update the "tally" column
    // UpdateExpression: "SET tally = :count, SET myList = :myList",
    // ExpressionAttributeValues: {
    //   // Increase the count
    //   ":count": ++count,
    //   ":myList": ["comment1", "comment2"],
    // },
  };

  const out = await dynamoDb.update(putParams).promise();

  return {
    statusCode: 200,
    body: {
      before: results.Item,
      after: out,
      bucket: Bucket.Uploads.bucket,
    },
  };
}
