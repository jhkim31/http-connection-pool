import Server from "./server";

const s = new Server();
beforeAll(async () => {
  s.start();
});

afterAll(() => {
  s.stop();
});
