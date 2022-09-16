export interface SerializerInterface {
  collection: (resourceKey: string, data: Record<string, any>[]) => Record<string, any>;

  item: (resourceKey: string, data: Record<string, any>) => Record<string, any>;

  null: () => any;

  meta: (meta: any) => any;
}
