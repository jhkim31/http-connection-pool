import request from "../src/core/request";


test('a', () => {
  request({
    url: "https://www.naver.com",
    method : "get"
  })
})
