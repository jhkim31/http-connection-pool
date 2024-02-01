import HcpHttpClient from '../src/core/hcpHttpClient';
import app from './server';

describe("Request Module Test", () => {
  let server: any;
  beforeAll(() => {
    server = app.listen(3000)
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
      url: new URL("http://localhost:3000/get/string"),
      method: "get",
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual('GET');
  })

  test('GET get json', async () => {
    /**
     * GET json
     */
    app.get('/get/json', (req, res) => {
      res.json({ message: 'GET' });
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3000/get/json"),
      method: "get",
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toStrictEqual({ message: 'GET' });
  })

  test('POST get string', async () => {
    /**
     * Get string
     */
    app.post('/post/string', (req, res) => {
      res.send('POST');
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3000/post/string"),
      method: "post"
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual('POST');
  })

  test('POST get json', async () => {
    /**
     * Get json
     */
    app.post('/post/json', (req, res) => {
      res.json({ message: 'POST' });
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3000/post/json"),
      method: "post",
      requestBody: "test"
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toStrictEqual({ message: 'POST' });
  })

  test('POST send string', async () => {
    /**
     * Send a string to the body and receive thet string as a result.
     */
    app.post('/post/send/string', (req, res) => {
      res.send(req.body);
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3000/post/send/string"),
      method: "post",
      requestBody: "POST"
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual("POST");
  })

  test('POST send json', async () => {
    /**
     * * Send a json to the body and receive thet json string as a result.
     */
    app.post('/post/send/json', (req, res) => {
      res.json(req.body);
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3000/post/send/json"),
      method: "post",
      requestBody: { "test": 123 }
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toStrictEqual({ 'test': 123 });
  })
});