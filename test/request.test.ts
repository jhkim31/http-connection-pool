import Request from "../src/core/request";
import { HcpRequestOptions } from "../src/types";

const r = new Request({
  url: "https://httpbin.org/get",
  retry: {
    maxRetryCount: 3,
    retryDelay: 1000,
    hooks: {
      afterRetryHook: (c) => console.log(c)
    }
  }  
})
r.call()
.then(d => {
  console.log('resolve');
  console.log(d)
})
.catch(e => {
  console.log('error');
  console.log(e)
})
// describe("default test", () => {
//   test('get', async () => {
//     console.log(123);
    
//   })
// })