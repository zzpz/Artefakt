import handler from "../util/handler";
import dynamo from "../util/dynamo";
import { Table } from "@serverless-stack/node/table";

export const main = handler(async () => {
  const params = {
    TableName: Table.Items.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    KeyConditionExpression: "userId = :userId",
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be the id of the author
    ExpressionAttributeValues: {
      ":userId": "123",
    },
  };

  const result = await dynamo.query(params);

  // Return the matching list of items in response body
  return result.Items;
});
