import handler from "../util/handler";
import eORM from "core/electro/eService";

export const main = handler(async (event, context) => {
  console.log(event.pathParameters.id);

  let id: string = event.pathParameters.id ??
    "beedabe8-e34e-4d41-9272-0755be9a2a9f";
  id = id.trim(); //FIXME: for now it makes copy pasting easier

  //get item
  const item = await eORM.entities.item.get({
    itemID: id, //pk
    version: 0, //sk
  }).go();

  

  const {data,cursor} = await eORM.collections.comments({itemID:id}).go()

  // query
  // const { data, cursor } = await .query
  //   .byAuthor({ author: "Stephen King" })
  //   .go();

  return data;
});

const uuid = (): any => {
  throw new Error("Function not implemented.");
};
