import { HTTPClient } from "./httpClient";

export type RequestFunction<T=any> = (...args: any) => Promise<T>;
export default class ExternalHTTPClient<ExternalHTTPResponse = any> extends HTTPClient<ExternalHTTPResponse> {
  fn: RequestFunction;
  args: any[];

  constructor (fn: RequestFunction, args: any[]) {
    super();
    this.fn = fn;
    this.args = args;
  }

  call(): Promise<ExternalHTTPResponse> {
    return this.fn(this.args);
  }
}