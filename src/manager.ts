import { ResourceInterface } from './resource/interface';

export class Manager {
  private resource: ResourceInterface;

  public createData(resource: ResourceInterface) {
    this.resource = resource;

    return this;
  }

  public toObject() {
    const transformer = this.resource.getTransformer();
    const rawData = this.resource.getData();

    return transformer(rawData);
  }
}
