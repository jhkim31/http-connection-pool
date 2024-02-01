import { HttpClient as HttpClient } from "./httpClient";

export type RequestFunction<T=any> = (...args: any) => Promise<T>;
export default class ExternalHttpClient<ExternalHttpResponse = any> extends HttpClient {
  fn: RequestFunction;
  args: any;

  constructor (fn: RequestFunction, ...args: any) {
    super();
    this.fn = fn;
    this.args = args;
  }

  call(): Promise<ExternalHttpResponse> {
    console.log(...this.args);
    return this.fn(...this.args);
  }
}