import { ItemResource } from './resource';
import { CollectionResource } from './resource/collection';
import { ResourceInterface } from './resource/interface';
import { DataSerializer } from './serializer/data';
import { SerializerInterface } from './serializer/interface';

export class Manager {
  protected resource: ResourceInterface;

  protected recursionLimit = 10;

  protected serializer: SerializerInterface = new DataSerializer();

  public getRecursionLimit(): number {
    return this.recursionLimit;
  }

  public setRecursionLimit(recursionLimit: number): this {
    this.recursionLimit = recursionLimit;

    return this;
  }

  public getSerializer(): SerializerInterface {
    return this.serializer;
  }

  public setSerializer(serializer: SerializerInterface): this {
    this.serializer = serializer;

    return this;
  }

  public createData(resource: ResourceInterface) {
    this.resource = resource;

    return this;
  }

  public toObject() {
    const serializer = this.getSerializer();
    const rawData = this.executeResourceTransformers();

    const data = this.serializeResourceData(serializer, rawData);

    const meta = this.serializeResourceMeta(serializer);

    return { ...data, ...meta };
  }

  protected executeResourceTransformers() {
    const transformer = this.resource.getTransformer();
    const data = this.resource.getData();

    if (this.resource instanceof ItemResource) {
      return transformer(data);
    } else if (this.resource instanceof CollectionResource) {
      const ret = [];
      for (let value of data) {
        ret.push(transformer(value));
      }
      return ret;
    } else {
      throw new Error('Argument resource should be an instance of ItemResource or CollectionResource');
    }
  }

  protected serializeResourceData(serializer: SerializerInterface, data: any) {
    const resourceKey = this.resource.getResourceKey();

    if (this.resource instanceof CollectionResource) {
      return serializer.collection(resourceKey, data);
    }

    if (this.resource instanceof ItemResource) {
      return serializer.item(resourceKey, data);
    }

    return serializer.null();
  }

  protected serializeResourceMeta(serializer: SerializerInterface) {
    return serializer.meta(this.resource.getMeta());
  }
}
