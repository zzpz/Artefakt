import handler from "../../util/handler";
import eORM from "core/electro/eService";

export const main = handler(async (event, context) => {
  // console.log(event.pathParameters.id);

  let testCommentID = "01H051RH7PQCS93SMV2XK698Z2"
  let testItemID = "testing_01H04Z6X7V8KTXTWFDNGK53Y6W"


  //assuming we reach here with valid(ated) inputs we can
  
  //query by comment ID and a partial itemID
//   const {data,cursor} = await eORM.entities.comment.query.byCommentID({commentID:testCommentID}).begins({itemID:"testing_"}).go()

  //query by exact PK + SK => ItemID:CommentID
//   const data = await eORM.entities.comment.get({itemID:testItemID,commentID:testCommentID}).go()

  //query by collection for this itemID => returning the ITEM + it's comments... this needs the returned properties to be reduced
  const {data,cursor} = await eORM.collections.comments({itemID:"testing_01H04Z6X7V8KTXTWFDNGK53Y6W"}).go()
  return data;
});

const uuid = (): any => {
  throw new Error("Function not implemented.");
};
