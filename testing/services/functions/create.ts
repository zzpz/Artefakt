import handler from "../util/handler";
import { Book, Task } from "../core/electItem";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  // const params = {
  //   TableName: Table.Items.tableName,
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

  const b = await Book.create({
    bookId: Math.random().toString(),
    storeId: "pdx-45",
    author: "Stephen King",
    title: "IT",
    condition: "GOOD",
    price: 15,
    genre: ["HORROR", "THRILLER"],
    published: Date.parse("1986-09-15"),
  }).go();

  return b;
});

const uuid = (): any => {
  return Math.random().toString();
  // throw new Error("Function not implemented.");
};
