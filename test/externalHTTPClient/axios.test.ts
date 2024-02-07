import axios, { AxiosResponse } from 'axios';

import ConnectionPool from '../../src';
import app from '../server';

const PORT = 3030;
const PROTOCOL = "http";
const HOST = "localhost";

describe('Axios Error Test', () => {
  let server: any;
  beforeAll(() => {
    server = app.listen(PORT)
  })

  afterAll(() => {
    server.close();
  })

  test('axios get string test', async () => {
    app.get('/get/string', (req, res) => {
      res.send("OK");
    })

    const c = new ConnectionPool();

    await c.addExternalHttpClient<AxiosResponse>(axios.get, `${PROTOCOL}://${HOST}:${PORT}/get/string`, { timeout: 1000 })
      .then(d => {
        expect(d.data).toBe("OK");
      })
  })

  test('axios get json test', async () => {
    app.get('/get/json', (req, res) => {
      res.send({ test: "OK" });
    })

    const c = new ConnectionPool();

    await c.addExternalHttpClient<AxiosResponse>(axios.get, `${PROTOCOL}://${HOST}:${PORT}/get/json`, { timeout: 1000 })
      .then(d => {
        expect(d.data).toEqual({ test: "OK" });
      })
  })

  test('axios post string test', async () => {
    app.post('/post/string', (req, res) => {
      res.send(req.body);
    })

    const c = new ConnectionPool();

    await c.addExternalHttpClient<AxiosResponse>(axios.post, `${PROTOCOL}://${HOST}:${PORT}/post/string`, "OK", {
      headers: {
        "Content-Type": "text/plain"
      },
      timeout: 1000
    })
      .then(d => {
        expect(d.data).toBe("OK");
      })
  })

  test('axios post json test', async () => {
    app.post('/post/json', (req, res) => {
      res.send(req.body);
    })

    const c = new ConnectionPool();

    await c.addExternalHttpClient<AxiosResponse>(axios.post, `${PROTOCOL}://${HOST}:${PORT}/post/json`, { test: "OK" }, { timeout: 1000 })
      .then(d => {
        expect(d.data).toEqual({ test: "OK" });
      })
  })

  test('axios timeout test', async () => {
    app.get('/timeout', (req, res) => {
      setTimeout(() => {
        res.send("OK");
      }, 10000)
    })

    const c = new ConnectionPool();

    await c.addExternalHttpClient<AxiosResponse>(axios.get, `${PROTOCOL}://${HOST}:${PORT}/timeout`, { timeout: 1000 })
      .catch(error => {
        expect(error.message).toBe("timeout of 1000ms exceeded");
        expect(error.code).toBe("ECONNABORTED");
      })
  })
})