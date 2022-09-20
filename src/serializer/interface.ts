export interface SerializerInterface {
  mergeIncludes: (transformedData: Record<string, any>, includedData: Record<string, any>) => Record<string, any>;

  collection: (resourceKey: string, data: Record<string, any>[]) => Record<string, any>;

  item: (resourceKey: string, data: Record<string, any>) => Record<string, any>;

  null: () => any;

  meta: (meta: any) => any;
}
