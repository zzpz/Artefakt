import handler from "../util/handler";
import eORM from "core/electro/eService";

export const main = handler(async (event, context) => {
  // console.log(event.pathParameters.id);

  let id: string = event.pathParameters?.id ??
    "beedabe8-e34e-4d41-9272-0755be9a2a9f";
  id = id.trim(); //FIXME: for now it makes copy pasting easier


  //assuming we reach here with valid(ated) inputs we can
  
  //query by version and partial ID
  // const {data,cursor} = await eORM.entities.item.query.byVersion({version:0}).begins({itemID:"testing_"}).go()

  //query by exact ID and version
  // const data = await eORM.entities.item.get({itemID:"testing_01H04Z6X7V8KTXTWFDNGK53Y6W",version:0}).go()

  //query by collection for this itemID => returning the ITEM + it's comments
  const {data,cursor} = await eORM.collections.comments({itemID:"testing_01H04Z6X7V8KTXTWFDNGK53Y6W"}).go()
  return data;
});

const uuid = (): any => {
  throw new Error("Function not implemented.");
};
