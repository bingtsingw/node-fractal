export interface ResourceInterface {
  getResourceKey: () => string;

  getData: () => any;

  setData: (data: any) => this;

  getTransformer: () => any;

  setTransformer: (transformer) => this;

  getMeta: () => Record<string, any>;
}
