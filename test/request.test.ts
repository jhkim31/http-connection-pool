import Request from "../src/core/request";

const r = new Request({
  url: "https://httpbin31232.org/get",
  retry: 3,
  hooks: {
    beforeRetryHook: (n) => console.log(n)
  }  
})
r.call().then(d => console.log(d)).catch(e => console.log(e));
// describe("default test", () => {
//   test('get', async () => {
//     console.log(123);
    
//   })
// })