import { Entity } from "electrodb";
import { Table } from "sst/node/table";

//v3 SDK
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const region = "ap-southeast-2";
const client = new DynamoDBClient({ region });

//table is from storageStack->APIStack->bind()  -- currently ALL functions have access to the table
const table = Table.Items.tableName; //TODO: there must be a way to programatically bind "Items"

const Task = new Entity({
  model: {
    entity: "task",
    version: "1",
    service: "taskapp",
  },
  attributes: {
    task: {
      type: "string",
      default: () => uuid(),
    },
    project: {
      type: "string",
    },
    employee: {
      type: "string",
    },
    description: {
      type: "string",
    },
  },
  indexes: {
    task: {
      pk: {
        field: "pk",
        composite: ["task"],
      },
      sk: {
        field: "sk",
        composite: ["project", "employee"],
      },
    },
    project: {
      index: "gsi1pk-gsi1sk-index",
      pk: {
        field: "gsi1pk",
        composite: ["project"],
      },
      sk: {
        field: "gsi1sk",
        composite: ["employee", "task"],
      },
    },
    assigned: {
      collection: "assignments",
      index: "gsi3pk-gsi3sk-index",
      pk: {
        field: "gsi3pk",
        composite: ["employee"],
      },
      sk: {
        field: "gsi3sk",
        composite: ["project", "task"],
      },
    },
  },
}, { table, client });

const Book = new Entity({
  model: {
    entity: "book",
    version: "1",
    service: "store",
  },
  attributes: {
    storeId: {
      type: "string",
    },
    bookId: {
      type: "string",
    },
    price: {
      type: "number",
      required: true,
    },
    title: {
      type: "string",
    },
    author: {
      type: "string",
    },
    condition: {
      type: ["EXCELLENT", "GOOD", "FAIR", "POOR"] as const,
      required: true,
    },
    genre: {
      type: "set",
      items: "string",
    },
    published: {
      type: "number",
    },
  },
  indexes: {
    byLocation: {
      pk: {
        // highlight-next-line
        field: "pk",
        composite: ["storeId"],
      },
      sk: {
        // highlight-next-line
        field: "sk",
        composite: ["bookId"],
      },
    },
    byAuthor: {
      // highlight-next-line
      index: "gsi1pk-gsi1sk-index",
      pk: {
        // highlight-next-line
        field: "gsi1pk",
        composite: ["author"],
      },
      sk: {
        // highlight-next-line
        field: "gsi1sk",
        composite: ["title"],
      },
    },
  },
  // add your DocumentClient and TableName as a second parameter
}, { client, table });

const uuid = (): any => {
  return Math.random().toString();
  // throw new Error("Function not implemented.");
};

export { Book, Task };
