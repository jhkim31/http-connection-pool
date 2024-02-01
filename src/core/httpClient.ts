export abstract class HttpClient {
  abstract call(): Promise<any>;
}