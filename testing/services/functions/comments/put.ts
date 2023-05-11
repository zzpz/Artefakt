import handler from "../../util/handler";
import electroORM from "../../core/electro/eService";
import { Comment } from "../../core/electro/electItem";

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

  //TODO: pull this all up into a Repository pattern eventually
  const testingCommentParams = {
    itemID: "testing_01H04Z6X7V8KTXTWFDNGK53Y6W",
    commentID: undefined,
    userID: "testing_USERID",
    description: "This is a comment about this Item",
    actioned: false,
    outcome: undefined,
    created: undefined,
    updated:undefined
  };

  const returnConfig = {
    data: "includeKeys" as const, //includeKeys defined in type
  };

  const res = await electroORM.entities.comment
    .put(testingCommentParams) // sending undefined params creates the item regardless because of default pk,sk values
    // .where((attr, op) => op.eq(attr.rent, "4500.00")) optional conditional expression
    .go(returnConfig);

  return res;
});

const uuid = (): any => {
    //generate our uuid server side, attempt ONE retry, if it collides then error
  throw new Error("Function not implemented.");
};
