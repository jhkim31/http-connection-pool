import Request from "../src/core/request";
import { HcpRequestError } from "../src/lib/error";
import app from "./server";

describe("Simple Request Module Test", () => {
  let server: any;
  beforeAll(async () => {
    server = app.listen(3000)
  })

  afterAll(async () => {
    await server.close();
  })

  test('GET get string', async () => {
    app.get('/get/string', (req, res) => {
      res.send('GET');
    })

    const r = new Request({
      url: new URL("http://localhost:3000/get/string"),
      method: "get",
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual('GET');
  })

  test('GET get json', async () => {
    app.get('/get/json', (req, res) => {
      res.json({ message: 'GET' });
    })

    const r = new Request({
      url: new URL("http://localhost:3000/get/json"),
      method: "get",
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toStrictEqual({ message: 'GET' });
  })

  test('POST get string', async () => {
    app.post('/post/string', (req, res) => {
      res.send('POST');
    })

    const r = new Request({
      url: new URL("http://localhost:3000/post/string"),
      method: "post"
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual('POST');
  })

  test('POST get json', async () => {
    app.post('/post/json', (req, res) => {
      res.json({ message: 'POST' });
    })

    const r = new Request({
      url: new URL("http://localhost:3000/post/json"),
      method: "post",
      requestBody: "test"
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toStrictEqual({ message: 'POST' });
  })

  test('POST send string', async () => {
    app.post('/post/send/string', (req, res) => {
      res.send(req.body);
    })

    const r = new Request({
      url: new URL("http://localhost:3000/post/send/string"),
      method: "post",
      requestBody: "POST"
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual("POST");
  })

  test('POST send json', async () => {
    app.post('/post/send/json', (req, res) => {
      res.json(req.body);
    })

    const r = new Request({
      url: new URL("http://localhost:3000/post/send/json"),
      method: "post",
      requestBody: { "test": 123 }
    })
    const res = await r.call();

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toStrictEqual({ 'test': 123 });
  })

  // test('url query test', async () => {
  //   app.get('/url/query', (req, res) => {
  //     console.log(req.query);
  //     res.json(req.query);
  //   })
  //   const r = new Request({
  //     url: new URL("http://localhost:3000/url/query?a=1&b=2"),
  //     method: "get",
  //   })
  //   const res = await r.call();

  //   expect(res.statusCode).toBe(200);
  //   expect(JSON.parse(res.body)).toStrictEqual({ a: '1', b: '2' });
  // });
});