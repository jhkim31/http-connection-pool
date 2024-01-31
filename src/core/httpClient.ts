export abstract class HTTPClient<ResponseType> {
  abstract call(): Promise<ResponseType>;
}