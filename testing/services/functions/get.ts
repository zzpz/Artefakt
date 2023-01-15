import handler from "util/handler";
import dynamo from "util/dynamo";
import { Table } from "@serverless-stack/node/table";

export const main = handler(async (event) => {
  const params = {
    TableName: Table.Items.tableName,
    Key: {
      userId: "123",
      noteId: event.pathParameters.id,
    },
  };

  const result = await dynamo.get(params);
  if (!result.Item) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return result.Item;
});
