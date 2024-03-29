import handler from "../util/handler";
import electroORM from "../core/electro/eService";
import { Book, Task } from "../core/electro/electItem";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body ?? "{}");
  const params = event.pathParameters;


  console.log(params)


  // const params = {
  //   Item: {
  //     // The attributes of the item to be created
  //     userId: "123", // The id of the author
  //     noteId: uuid.v1(), // A unique uuid
  //     content: data.content, // Parsed from request body
  //     attachment: data.attachment, // Parsed from request body
  //     createdAt: Date.now(), // Current Unix timestamp
  //   },
  // };
  // await dynamo.put(params);

  //TODO: pull this whole thing up into a Repository pattern eventually
  const testingItemParams = {
    // itemID: "0.5380767639070243", //undefined will give a default for testing
    version: 0,
    description: "Describe current version", 
    author: "Stephen King",
    title: "IT",
    condition: "GOOD" as const,
    price: 15,
    genre: ["HORROR", "THRILLER"],
    published: Date.parse("1986-09-15"),
  };

  const returnConfig = {
    data: "includeKeys" as const, //includeKeys defined in type
  };

  const b = await electroORM.entities.item
    .put(testingItemParams) // sending undefined params creates the item regardless because of default pk,sk values
    // .where((attr, op) => op.eq(attr.rent, "4500.00")) optional conditional expression
    .go(returnConfig);

  return b;
});

const uuid = (): any => {
  throw new Error("Function not implemented.");
};
