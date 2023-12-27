import ConnectionPool, { QueueItem } from "../src";

const c = new ConnectionPool(2);
c.add({
  url: "http://httpbin.org/post",
  "method": 'post',
  "reject": (e) => {
    console.log('e');
  },
  "resolve": (d) => {
    console.log(d);
  }
});
c.add({
  url: "http://httpbin.org/get",
  "method": 'get',
  "reject": (e) => {
    console.log('e');
  },
  "resolve": (d) => {
    console.log(d);
  }
});
c.add({
  url: "http://httpbin.org/delete",
  "method": 'delete',
  "reject": (e) => {
    console.log('e');
  },
  "resolve": (d) => {
    console.log(d);
  }
});