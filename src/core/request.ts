import http from 'node:http';
import https from 'https';

import { RequestOptions, Response } from '../interfaces';

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
          headers: res.headers,
          body: body
        })
      });

      res.on('error', (error) => {
        reject(error);
      })
    })

    if (requestOptions.body) {
      try {
        req.write(JSON.stringify(requestOptions.body));
      } catch (e) {
        req.write(requestOptions.body);
      }      
    }
    req.end();
  })  
}