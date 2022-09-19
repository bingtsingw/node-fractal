import { CollectionResource, ItemResource, Manager, ResourceInterface, SerializerInterface } from '.';

export class Scope {
  protected manager: Manager;

  protected resource: ResourceInterface;

  protected scopeIdentifier: string = null;

  protected parentScopes = [];

  public constructor(manager: Manager, resource: ResourceInterface, scopeIdentifier: string) {
    this.manager = manager;
    this.resource = resource;
    this.scopeIdentifier = scopeIdentifier;
  }

  public getManager(): Manager {
    return this.manager;
  }

  public getResource(): ResourceInterface {
    return this.resource;
  }

  public getScopeIdentifier(): string {
    return this.scopeIdentifier;
  }

  public getParentScopes(): string[] {
    return this.parentScopes;
  }

  public setParentScopes(parentScopes: string[]): this {
    this.parentScopes = parentScopes;

    return this;
  }

  /**
   * Get the unique identifier for this scope.
   */
  public getIdentifier(appendIdentifier: string = null): string {
    const parts = [...this.parentScopes, this.scopeIdentifier, appendIdentifier];

    return parts.filter((v) => v !== null).join(',');
  }

  public toObject() {
    const serializer = this.manager.getSerializer();

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
