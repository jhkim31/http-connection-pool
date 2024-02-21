import FormData from 'form-data';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import converter from "xml2js";

import HcpHttpClient from '../../src/core/hcpHttpClient';
import app from '../server';

const PROTOCOL = "http";
const HOST = "localhost";
const PORT = 3003;
describe("HcpHTTPClient module test", () => {
  let server: any;
  beforeAll(() => {
    server = app.listen(PORT)
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
      requestBody: "POST",
      requestHeaders: {
        "Content-Type": "text/plain"
      }
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
      requestBody: { "test": 123 },
      requestHeaders: {
        "Content-Type": "application/json"
      }
    })
    await r.call()
      .then(d => {
        expect(d.statusCode).toBe(200);
        expect(JSON.parse(d.body)).toStrictEqual({ 'test': 123 });
      })
  })

  test('POST send xml', async () => {
    /**
     * * Send a json to the body and receive thet json string as a result.
     */
    app.post('/post/send/xml', async (req, res) => {
      const parser = new converter.Parser({ explicitArray: false, trim: true });
      const parsedXML = await parser.parseStringPromise(req.body);      
      res.json(parsedXML);      
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3003/post/send/xml"),
      method: "post",
      requestBody: `<xml>
        <head>head</head>
        <body>body</body>
      </xml>
      `,
      requestHeaders: {
        "Content-Type": "text/xml"
      }
    })
    await r.call()
      .then(d => {
        expect(d.statusCode).toBe(200);
        expect(JSON.parse(d.body)).toStrictEqual({ xml: { head: "head", body: "body" } });
      })
  })

  test('POST send file', async () => {
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    app.post('/post/upload', upload.single('file'), (req, res) => {
      res.json({
        name: req.file?.originalname,
        size: req.file?.size,
        mimetype: req.file?.mimetype
      });
    })

    const formData = new FormData();
    formData.append('file', fs.createReadStream(path.resolve(__dirname, './sample.png')));
    const r = new HcpHttpClient({
      url: new URL(`${PROTOCOL}://${HOST}:${PORT}/post/upload`),
      method: "post",
      requestBody: formData,
      requestHeaders: formData.getHeaders()
    })
    await r.call()
      .then(d => {
        expect(d.statusCode).toBe(200);
        expect(JSON.parse(d.body)).toStrictEqual({ name: 'sample.png', size: 4431, mimetype: 'image/png' });
      })
  })

  test('Set headers', async () => {
    app.get('/headers', (req, res) => {
      res.json(req.headers);
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3003/headers"),
      requestHeaders: {      
        "content-type" : "application/test",
        "Test-Header": "TestHeader"
      },
      requestBody: {
        "a": 123
      }
    })
    await r.call()
      .then(d => {
        expect(d.statusCode).toBe(200);
        expect(JSON.parse(d.body)).toHaveProperty("test-header", "TestHeader");
        expect(JSON.parse(d.body)).toHaveProperty("content-type", "application/test");
      })
  });

  test('ignore status code test', async () => {
    app.get('/404', (req, res) => {
      res.sendStatus(404)
    })

    const r = new HcpHttpClient({
      url: new URL("http://localhost:3003/404"),
      ignoreStatusCodes: [404]
    })
    await r.call()
      .then(d => {
        expect(d.statusCode).toBe(404);        
      })
      .catch(e => {
        expect(true).toBe(false);
      })
  });
});