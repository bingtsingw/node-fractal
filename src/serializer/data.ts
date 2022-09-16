import isEmpty from 'lodash.isempty';
import { SerializerInterface } from './interface';

export class DataSerializer implements SerializerInterface {
  public collection(resourceKey: string, data: Record<string, any>[]) {
    return {
      data: data,
    };
  }

  public item(resourceKey: string, data: Record<string, any>) {
    return data;
  }

  public null() {
    return {};
  }

  public meta(meta: any): any {
    if (isEmpty(meta)) {
      return {};
    }

    return { meta };
  }
}
