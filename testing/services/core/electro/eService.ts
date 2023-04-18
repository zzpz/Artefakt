import { Service } from "electrodb";
import { client, table } from "../../util/dynamo";
import { Book, Task } from "./electItem";

//register any entities here rather than hitting them directly
const electroORM = new Service({
  item: Book,
  comment: Task,
}, { client, table });

export default electroORM;
