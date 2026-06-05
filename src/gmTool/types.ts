export interface MetaBase {
  name: string;
  defaultValue: any;
}
export interface GmMeatBase<T> {
  get: () => T;
  set: (value: T) => void;
  name: string;
}

export interface TFSClientMeta {
  pat: string;
}
export interface GmMetaList {
  tfsClientMeta?: GmMeatBase<TFSClientMeta>;
}
