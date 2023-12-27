import request from "./request";


request({
  url: "https://httpbin.org/get",
  method: "get"
})
.then(d => {
  console.log(d);
})


request({
  url: "https://httpbin.org/post",
  method: "post"
})
.then(d => {
  console.log(d);
})

request({
  url: "https://httpbin.org/post",
  method: "post",
  body: "test"
})
.then(d => {
  console.log(d);
})

request({
  url: "https://httpbin.org/post",
  method: "post",
  body: {a : 123}
})
.then(d => {
  console.log(d);
})

