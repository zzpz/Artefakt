import { Entity } from "electrodb";

const table = undefined; //this is overridden by the service
const client = undefined; //this is overridden by the service

//serviceName needs to come from config?

const serviceName = "electroORM";

const Task = new Entity({
  model: {
    entity: "task",
    version: "1",
    service: serviceName,
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
    service: serviceName,
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

const Item = new Entity({
  model: {
    entity: "item",
    version: "1",
    service: serviceName,
  },
  attributes: {
    itemID: { // uuid
      type: "string",
      default: "ULID()??",
    },
    description: { //current description
      type: "string",
      default: "",
    },
    currentVersion: { // 0 is reserved as the "current" data, all other versions are version control
      type: "number",
      default: 0, //default as 0 => first insert gives 0?
    },
    public: {
      type: "boolean",
      default: false,
    },
    history: {
      type: "map",
      properties: {
        version: {
          type: "number",
        },
        description: {
          type: "string",
        },
      },
    },
    created: {
      type: "number",
      readOnly: true,
      hidden: true,
      default: Date.now(),
    },
    updated: {
      type: "number",
      hidden: true,
      default: Date.now(),
    },
    // ASD: we select all the comments of an Item then filter for the historian,
    // our comments are unlikely to be large - optimise if the query gets bad, how to monitor? IDK
    // this is not the place but 'get the unprocessed comments for this item' is annoying
    // recording the highest comment last updated doesn't work... but it can be used if we expand our subset to a superset?
    // client receives a,aa,ab,bb,bc
    // client updates the item using comments aa, ab, bb, bc
    // a has not been processed -> we could write the value to a lookup as the lowest unprocessed comment...
    // forget it for now, premature optimisation. It can be done but it adds overhead to the query vs just select all, filter
  },
  indexes: {
    items: { //access pattern is get(itemID,currentVersion=0) => data:{descrip,etc}, transactWrite(update(itemId,currentVersion),put(itemID,currentVersion+1))
      pk: {
        field: "pk",
        //this is all we need? or should we include version in PK or SK or both?
        composite: ["itemID", "version"],
      },
      sk: {
        field: "sk", // no sort key for items?
        composite: ["version"],
        //template: $"v_{version}" ?
        // composite: ["version"], /
        //output is: $items#
      },
    },
    item: { // access pattern is getComments(itemID)=> filter(data) => {data}
      collection: "comments",
      index: "gsi1",
      pk: {
        field: "gsi1pk",
        composite: ["itemID"],
      },
    },
  },
  // {
  //   type: "string" | "number" | "boolean" | "list" | "map" | "set" | "any" | ReadonlyArray<string>;
  //   required?: boolean;
  //   default?: <type> | (() => <type>);
  //   validate?: RegExp | ((value: <type>) => void | string);
  //   field?: string;
  //   readOnly?: boolean;
  //   label?: string;
  //       cast?: "number"|"string"|"boolean";
  //   get?: (attribute: <type>, schema: any) => <type> | void | undefined;
  //   set?: (attribute?: <type>, schema?: any) => <type> | void | undefined;
  //   watch?: "*" | string[];
  //   padding?: {
  //       length: number;
  //       char: string;
  //   }
  // }
});

const Comment = new Entity({
  model: {
    entity: "comment",
    version: "1",
    service: serviceName,
  },
  attributes: {
    itemID: { // uuid
      type: "string",
      default: "ULID()??",
    },
    commentID: {
      type: "string",
      default: "ULID?", //ULID allows range queries on PK?
    },
    userID: {
      type: "string",
      required: false, // TODO
      default: "", //who made the comment
    },
    description: { // comment contents
      label: "comment",
      type: "string",
      default: "",
    },
    actioned: {
      type: "boolean",
      default: false,
    },
    outcome: {
      type: ["accepted", "rejected", "duplicate"] as const,
    },
    created: {
      type: "number",
      readOnly: true,
      hidden: true,
      default: Date.now(),
    },
    updated: {
      type: "number",
      hidden: true,
      default: Date.now(),
    },
  },
  indexes: {
    comment: { //access pattern is ?
      pk: {
        field: "pk",
        composite: ["commentID","itemID"], //$service#commentID_{value}#itemID_{value} 
      },
      sk: {
        field: "sk",
        composite: [""],
      },
    },
    itemComments: { // access pattern is getComments(itemID)=> filter(data) => {data}
      collection: "comments",
      index: "gsi1",
      pk: {
        field: "gsi1pk",
        composite: ["itemID"], //within this gsi, this field is our shared PK (composited with this collection? comments_itemID_etc?)
      },
      sk: {
        field: "gsi1sk",
        composite: []  // this is our
      }
    },
  },
});

const uuid = (): any => {
  return Math.random().toString();
  // throw new Error("Function not implemented.");
};

export { Book, Task };

// readonly model: {
//   readonly entity: string;
//   readonly service: string;
//   readonly version: string;
// }
// readonly attributes: {
//   readonly [a in A]: Attribute
// };
// readonly indexes: {
//   [accessPattern: string]: {
//       readonly index?: string;
//       readonly type?: 'clustered' | 'isolated';
//       readonly collection?: AccessPatternCollection<C>;
//       readonly pk: {
//           readonly casing?: "upper" | "lower" | "none" | "default";
//           readonly field: string;
//           readonly composite: ReadonlyArray<F>;
//           readonly template?: string;
//       }
//       readonly sk?: {
//           readonly casing?: "upper" | "lower" | "none" | "default";
//           readonly field: string;
//           readonly composite: ReadonlyArray<F>;
//           readonly template?: string;
//       }
//   }
