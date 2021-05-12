import { Injectable } from '@nestjs/common';

@Injectable()
export class RuntimeStorageService<O extends object> {
  private readonly data: O = {} as O;

  public getItem<K extends keyof O>(
    key: K,
    defaultValue?: O[K]
  ): O[K] | undefined {
    return this.data[key] || defaultValue;
  }

  public setItem<K extends keyof O>(key: K, value: O[K]): O[K] {
    return (this.data[key] = value);
  }
}
