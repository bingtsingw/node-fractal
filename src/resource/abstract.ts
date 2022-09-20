import { TransformerAbstract } from '..';
import { ResourceInterface } from './interface';

type Transformer<T> = (data: T) => any;
type Meta = Record<string, any>;

export abstract class ResourceAbstract<T extends Record<string, any>> implements ResourceInterface {
  protected data: T | T[];
  protected meta: Meta = {};
  protected resourceKey: string;
  protected transformer: Transformer<T> | TransformerAbstract;

  public constructor(data: T | T[], transformer: Transformer<T> | TransformerAbstract, resourceKey = '') {
    this.data = data;
    this.transformer = transformer;
    this.resourceKey = resourceKey;
  }

  public getResourceKey(): string {
    return this.resourceKey;
  }

  public setResourceKey(resourceKey: string): this {
    this.resourceKey = resourceKey;

    return this;
  }

  public getMeta() {
    return this.meta;
  }

  public setMeta(meta: Meta) {
    this.meta = meta;

    return this;
  }

  public getMetaValue(metaKey: string) {
    return this.meta[metaKey];
  }

  public setMetaValue(metaKey: string, metaValue: any) {
    this.meta[metaKey] = metaValue;

    return this;
  }

  public getData() {
    return this.data;
  }

  public setData(data: T) {
    this.data = data;

    return this;
  }

  public getTransformer() {
    return this.transformer;
  }

  public setTransformer(transformer: Transformer<T>) {
    this.transformer = transformer;

    return this;
  }
}
