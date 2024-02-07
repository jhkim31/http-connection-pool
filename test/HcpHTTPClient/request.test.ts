import HcpHttpClient from '../../src/core/hcpHttpClient';
import app from '../server';

describe("HcpHTTPClient module test", () => {
  let server: any;
  beforeAll(() => {
    server = app.listen(3003)
  })

  afterAll(() => {
    server.close();
  })

  test('GET get string', async () => {
    /**
     * GET string
     */
    app.get('/get/string', (req, res) => {
      res.send('GET');
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3003/get/string"),
      method: "get",
    })
    await r.call()
      .then(d => {
        expect(d.statusCode).toBe(200);
        expect(d.body).toStrictEqual('GET');
      });
  })

  test('GET get json', async () => {
    /**
     * GET json
     */
    app.get('/get/json', (req, res) => {
      res.json({ message: 'GET' });
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3003/get/json"),
      method: "get",
    })
    await r.call()
      .then(d => {
        expect(d.statusCode).toBe(200);
        expect(JSON.parse(d.body)).toStrictEqual({ message: 'GET' });
      });
  })

  test('GET url query', async () => {
    /**
     * validate url query
     */
    app.get('/get/query', (req, res) => {
      res.send(req.query);
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3003/get/query?a=1"),
      method: "get",
    })
    await r.call()
      .then(d => {
        expect(d.statusCode).toBe(200);
        expect(JSON.parse(d.body)).toStrictEqual({ a: '1' });
      });
  })

  test('POST get string', async () => {
    /**
     * Get string
     */
    app.post('/post/string', (req, res) => {
      res.send('POST');
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3003/post/string"),
      method: "post"
    })
    await r.call()
      .then(d => {
        expect(d.statusCode).toBe(200);
        expect(d.body).toStrictEqual('POST');
      });
  })

  test('POST get json', async () => {
    /**
     * Get json
     */
    app.post('/post/json', (req, res) => {
      res.json({ message: 'POST' });
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3003/post/json"),
      method: "post",
      requestBody: "test"
    })
    await r.call()
      .then(d => {
        expect(d.statusCode).toBe(200);
        expect(JSON.parse(d.body)).toStrictEqual({ message: 'POST' });
      })
  })

  test('POST send string', async () => {
    /**
     * Send a string to the body and receive thet string as a result.
     */
    app.post('/post/send/string', (req, res) => {
      res.send(req.body);
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3003/post/send/string"),
      method: "post",
      requestBody: "POST"
    })
    await r.call()
      .then(d => {
        expect(d.statusCode).toBe(200);
        expect(d.body).toStrictEqual("POST");
      })
  })

  test('POST send json', async () => {
    /**
     * * Send a json to the body and receive thet json string as a result.
     */
    app.post('/post/send/json', (req, res) => {
      res.json(req.body);
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3003/post/send/json"),
      method: "post",
      requestBody: { "test": 123 }
    })
    await r.call()
      .then(d => {
        expect(d.statusCode).toBe(200);
        expect(JSON.parse(d.body)).toStrictEqual({ 'test': 123 });
      })
  })

  test('Set headers', async () => {
    app.get('/headers', (req, res) => {                  
      res.json(req.headers);
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3003/headers"),      
      requestHeaders: {
        "Test-Header": "TestHeader"
      },
      requestBody: {
        "a" : 123
      }
    })
    await r.call()
      .then(d => {
        expect(d.statusCode).toBe(200);        
        expect(JSON.parse(d.body)).toHaveProperty("test-header", "TestHeader");
      })
  });
});