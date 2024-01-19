import Request from "../src/core/request";
import { HcpRequestError } from "../src/lib/error";

describe("Simple Request Module Test", () => {
  test('simple get test', async () => {
    const r = new Request({
      url : new URL("http://localhost:3000/get"),
      method: "get",
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);    
    expect(JSON.parse(res.body)).toStrictEqual({ message: 'GET request received' });
  })

  test('simple post test', async () => {
    const r = new Request({
      url : new URL("http://localhost:3000/post"),
      method: "post"
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);       
    expect(JSON.parse(res.body)).toStrictEqual({ message: 'POST request received' });
  })

  test('post body test (string)', async () => {
    const r = new Request({
      url : new URL("http://localhost:3000/post_body"),
      method: "post",
      requestBody: "test"
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);          
    expect(JSON.parse(res.body)).toStrictEqual({ message: 'test' });
  })

  test('post body test (json)', async () => {
    const r = new Request({
      url : new URL("http://localhost:3000/post_body"),
      method: "post",
      requestBody: {"test" : 123}
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);           
    expect(JSON.parse(res.body)).toStrictEqual({ message: {'test' : 123} });
  })

  test('url query test', async () => {
    const r = new Request({
      url : new URL("http://localhost:3000/get_query?a=1&b=2"),
      method: "get",
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);    
    expect(JSON.parse(res.body)).toStrictEqual({ a : '1', b : '2' });
  });
})

describe('Request Module Error Test', () => {
  test('404 test', async () => {    
    const r = new Request({
      url : new URL("http://localhost:3000/404"),
      method: "get" 
    })
    try {
      await r.call()
    } catch (error: unknown) {
      if (error instanceof HcpRequestError) {
        expect(error?.res?.statusCode).toBe(404);
      }      
    }    
  })

  test('Unreachable test', async () => {    
    const r = new Request({
      url : new URL("https://jcopy.net"),
      method: "get" 
    })
    try {
      await r.call()
    } catch (error: unknown) {
      if (error instanceof HcpRequestError) {        
        expect(error.message).toBe("getaddrinfo ENOTFOUND jcopy.net");
      }      
    }    
  })

  test('retry test', async () => {
    let i = 0;
    const r = new Request({
      url : new URL("https://jcopy.net"),
      method: "get",
      retry: {
        maxRetryCount: 3,
        hooks: {
          beforeRetryHook: (c) => {i += c}
        }
      }
    })
    try {
      await r.call()
    } catch (error: unknown) {
      if (error instanceof HcpRequestError) {        
        expect(i).toBe(6);
      }      
    }    
  })
})