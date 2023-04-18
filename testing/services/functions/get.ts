import handler from "../util/handler";
import electroORM from "core/electro/eService";

export const main = handler(async (event, context) => {
  console.log(event.pathParameters.id);

  let id: string = event.pathParameters.id ??
    "beedabe8-e34e-4d41-9272-0755be9a2a9f";
  id = id.trim(); //FIXME: for now it makes copy pasting easier

  //get item
  const book = await electroORM.entities.item.get({
    bookId: id, //pk
    storeId: "pdx-45", //sk
  }).go();

  // query
  // const { data, cursor } = await Book.query
  //   .byAuthor({ author: "Stephen King" })
  //   .go();

  return book;
});

const uuid = (): any => {
  throw new Error("Function not implemented.");
};
