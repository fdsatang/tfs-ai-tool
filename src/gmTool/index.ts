import GM_API from "./gmApi";
import { MetaBase } from "./types";
import { getDBData } from "./utils";

const metaBaseList: MetaBase[] = [
  {
    name: "tfsClientMeta",
    defaultValue: { pat: "" }
  }
];

const $ = {
  ...GM_API,
  DB: getDBData(metaBaseList)
};

export default $;
