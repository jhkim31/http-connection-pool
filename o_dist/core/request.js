"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const node_https_1 = __importDefault(require("node:https"));
async function request(requestOptions) {
    const url = new URL(requestOptions.url);
    const method = requestOptions.method;
    const headers = requestOptions.headers;
    const isHttps = url.protocol === "https:";
    const transport = isHttps ? node_https_1.default : node_http_1.default;
    const agent = new transport.Agent({ keepAlive: true });
    return new Promise((resolve, reject) => {
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
                });
            });
            res.on('error', (e) => {
                reject(e);
            });
        });
        if (requestOptions.body) {
            if (typeof requestOptions.body == "string") {
                req.write(requestOptions.body);
            }
            else {
                req.write(JSON.stringify(requestOptions.body));
            }
        }
        req.end();
    });
}
exports.default = request;
