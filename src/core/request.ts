import http from 'node:http';
import https from 'node:https';

import { RequestOptions, Response } from '../types';

export default async function request(requestOptions: RequestOptions) {
  const url = new URL(requestOptions.url);
  const method = requestOptions.method;
  const headers = requestOptions.headers;

  const isHttps = url.protocol === "https:";

  const transport = isHttps ? https : http;
  const agent = new transport.Agent({ keepAlive: true });

  return new Promise<Response>((resolve, reject) => {
    const req = transport.request(url, {
      method,
      agent,
      headers
    }, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        })
      });

      res.on('error', (e) => {
        reject(e);
      })
    })

    if (requestOptions.body) {
      if (typeof requestOptions.body == "string") {
        req.write(requestOptions.body);
      } else {
        req.write(JSON.stringify(requestOptions.body));
      }
    }
    req.end();
  })
}