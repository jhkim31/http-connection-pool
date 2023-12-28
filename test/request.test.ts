import request from "../src/core/request";


describe("default test", () => {
  test('get', async () => {
    const result = await request({
      url: "https://httpbin.org",
      method: "get"
    })
    expect(typeof result).toBe("object");
  })

  test('404', async () => {
    const result = await request({
      url: "https://httpbin.org/status/404",
      method: "get"
    })
    expect(result.status).toStrictEqual(404);
  })

  test('post', async () => {
    const result = await request({
      url: "https://httpbin.org/post",
      method: "post",
      body: {
        data : "string"
      }
    })
    expect(typeof result).toBe('object');
  })

  test('post json', async () => {
    const result = await request({
      url: "https://httpbin.org/post",
      method: "post",
      body: {
        data : { "abc" : "string"}
      }
    })
    expect(typeof result).toBe('object');
  })

  test('error', async () => {
    const result = await request({
      url: "https://httpbin123ab.com/get",
      method: "get",      
    })
    expect(typeof result).toBe('object');
  })
})