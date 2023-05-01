import { Service } from "electrodb";
import { client, table } from "../../util/dynamo";
import { Book, Comment, Item, Task } from "./electItem";

//register any entities here rather than hitting them directly
const electroORM = new Service({
  item: Item,
  comment: Comment,
  book: Book,
  task: Task,
}, { client, table });

export default electroORM;
