import { camelCase, upperFirst } from 'lodash';
import { CollectionResource, ItemResource, ResourceAbstract, ResourceInterface, Scope } from '.';

export abstract class TransformerAbstract {
  /**
   * Resources that can be included if requested.
   */
  protected availableIncludes: string[] = [];

  /**
   * Include resources without needing it to be requested.
   */
  protected defaultIncludes: string[] = [];

  /**
   * The transformer should know about the current scope, so we can fetch relevant params.
   */
  protected currentScope: Scope | null = null;

  public getAvailableIncludes(): string[] {
    return this.availableIncludes;
  }

  public setAvailableIncludes(availableIncludes: string[]): this {
    this.availableIncludes = availableIncludes;

    return this;
  }

  public getDefaultIncludes(): string[] {
    return this.defaultIncludes;
  }

  public setDefaultIncludes(defaultIncludes: string[]): this {
    this.defaultIncludes = defaultIncludes;

    return this;
  }

  public getCurrentScope() {
    return this.currentScope;
  }

  public setCurrentScope(currentScope: Scope): this {
    this.currentScope = currentScope;

    return this;
  }

  /**
   * This method is fired to loop through available includes, see if any of
   * them are requested and permitted for this scope.
   */
  public processIncludedResources(scope: Scope, data: any): Record<string, any> {
    let includedData = {};

    const includes = this.figureOutWhichIncludes(scope);

    for (let include of includes) {
      includedData = {
        ...this.includeResourceIfAvailable(scope, data, include),
        ...includedData,
      };
    }

    return includedData;
  }

  protected item(data, transformer, resourceKey: string = null): ItemResource<any> {
    return new ItemResource(data, transformer, resourceKey);
  }

  protected collection(data: any, transformer, resourceKey: string = null): CollectionResource<any> {
    return new CollectionResource(data, transformer, resourceKey);
  }

  private figureOutWhichIncludes(scope: Scope): string[] {
    const includes = this.getDefaultIncludes();

    return includes;
  }

  private includeResourceIfAvailable(scope: Scope, data, include: string): Record<string, any> {
    const resource = this.callIncludeMethod(scope, include, data);

    if (resource) {
      const childScope = scope.embedChildScope(include, resource);

      return {
        [include]: childScope.toObject(),
      };
    }

    return {};
  }

  private callIncludeMethod(scope: Scope, includeName: string, data: any): ResourceInterface | false {
    const scopeIdentifier = scope.getIdentifier(includeName);

    // Check if the method name actually exists
    const methodName = `include${upperFirst(camelCase(includeName))}`;

    if (typeof this[methodName] !== 'function') {
      return false;
    }

    const resource = this[methodName](data);

    if (!(resource instanceof ResourceAbstract)) {
      throw new Error(`Invalid return value from ${this.constructor.name}.${methodName}. Expected ResourceInterface.`);
    }

    return resource as ResourceInterface;
  }

  public abstract transform(data: any): any;
}
