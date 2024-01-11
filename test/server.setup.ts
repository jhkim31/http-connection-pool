// jest.setup.js

import express from "express";

let server: any;

// Jest 전역 설정을 수정하여 테스트 서버를 처음에 실행하도록 합니다.
beforeAll(async () => {
  const app = express();  

  // 간단한 라우트 설정
  app.get('/get', (req, res) => {
    console.log('test');
    res.json({ message: 'GET request received' });
  });

  app.post('/api/post', (req, res) => {
    res.json({ message: 'POST request received' });
  });

  // 서버를 3000번 포트에서 시작
  server = app.listen(3000, () => {
    console.log('Test server is running on port 3000');
  });
});

// Jest 전역 설정을 수정하여 테스트 서버를 종료하도록 합니다.
afterAll(() => {
  if (server) {
    server.close();
    console.log('Test server closed');
  }
});
