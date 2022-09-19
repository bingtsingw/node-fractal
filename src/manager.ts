import { DataSerializer, ResourceInterface, Scope, SerializerInterface } from '.';

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

  public createData(
    resource: ResourceInterface,
    scopeIdentifier: string = null,
    parentScopeInstance: Scope = null,
  ): Scope {
    const scopeInstance = new Scope(this, resource, scopeIdentifier);

    if (parentScopeInstance !== null) {
      // This will be the new children list of parents (parents parents, plus the parent)
      const scopeArray = parentScopeInstance.getParentScopes();
      scopeArray.push(parentScopeInstance.getScopeIdentifier());

      scopeInstance.setParentScopes(scopeArray);
    }

    return scopeInstance;
  }
}
