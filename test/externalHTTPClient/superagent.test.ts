import superagent, { Response } from 'superagent';

import ConnectionPool from '../../src';
import app from '../server';

const PORT = 3040;
const PROTOCOL = "http";
const HOST = "localhost";

describe('superagent Error Test', () => {
  let server: any;
  beforeAll(() => {
    server = app.listen(PORT)
  })

  afterAll(() => {
    server.close();
  })

  test('superagent get string test', async () => {
    app.get('/get/string', (req, res) => {
      res.send("OK");
    })

    const c = new ConnectionPool();

    await c.addExternalHttpClient<Response>(superagent.get, `${PROTOCOL}://${HOST}:${PORT}/get/string`)
      .then(d => {
        expect(d.text).toBe("OK");
      })         
  })

  test('superagent get json test', async () => {
    app.get('/get/json', (req, res) => {
      res.send({test : "OK"});
    })

    const c = new ConnectionPool();

    await c.addExternalHttpClient<Response>(superagent.get, `${PROTOCOL}://${HOST}:${PORT}/get/json`)
      .then(d => {
        expect(d.body).toEqual({test: "OK"});
      })         
  })
})