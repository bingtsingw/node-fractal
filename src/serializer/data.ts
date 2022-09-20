import { isEmpty } from 'lodash';
import { SerializerInterface } from './interface';

export class DataSerializer implements SerializerInterface {
  public mergeIncludes(transformedData: Record<string, any>, includedData: Record<string, any>): Record<string, any> {
    return {
      ...transformedData,
      ...includedData,
    };
  }

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
