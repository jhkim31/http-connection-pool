import isJsonString from "../src/utils/isJsonString";
import sleep from "../src/utils/sleep";
import createUrl from "../src/lib/createUrl";
import createRetry from "../src/lib/createRetry";

describe("lib & utils Test", () => {  
  test('[utils/isJsonString] valid json string', () => {
    const j = {
      'a' : 123
    }
    expect(isJsonString(JSON.stringify(j))).toBe(true);
  })

  test('[utils/isJsonString] invalid json string', () => {
    expect(isJsonString('test')).toBe(false);
  })

  test(`[lib/sleep] sleep delay test`, async () => {
    const st = new Date();
    await sleep(1000);

    const et = new Date();
    expect(et.getTime() - st.getTime()).toBeGreaterThanOrEqual(1000);
  })
  
  test(`[createUrl] valid url string)`, async () => {
    const urlStr = "http://localhost:3000";

    const url = createUrl(urlStr);

    expect(url instanceof URL).toBe(true);
  })

  test(`[createUrl] invalid url string)`, async () => {    
    let url1, url2;    
    try {
      
      const urlStr1 = "http://localhost:70000";    
      url1 = createUrl(urlStr1);
    } catch(error: any) {      
      expect(error.code).toBe("ERR_INVALID_URL");       
    }    

    try {
      const urlStr2 = "localhost:3000";    
      url2 = createUrl(urlStr2);
    } catch(error: any) {
      expect(error.code).toBe("ERR_INVALID_URL"); 
    }    
  })

  test(`[createUrl] valid property`, async () => {    
    const url = createUrl({
      host: "localhost",
      protocol: "http",
      path: "test/abc",
      urlQuery: {
        a : '1',
        b : '2'
      }
    });

    expect(url instanceof URL).toBe(true);
    expect(url.href).toBe("http://localhost/test/abc?a=1&b=2");
  })

  test(`[createUrl] invalid property`, async () => {    
    try {
      const url = createUrl({
        host: "localhost",
        protocol: "http",
        path: "//test",
        port: 70000
      });
    } catch (error: any) {
      expect(error.code).toBe("ERR_INVALID_URL"); 
    }
  })
})