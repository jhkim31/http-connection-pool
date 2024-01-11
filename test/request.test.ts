import Request from "../src/core/request";

describe("Request Module Test", () => {
  test('valid json string', () => {
    const r = new Request({
      url: "http://localhost:3000/get",
      retry: {
        maxRetryCount: 3,
        retryDelay: 1000    
      }  
    })
    r.call();
  })
})