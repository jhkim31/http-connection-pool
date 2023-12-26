import ConnectionPool, {QueueItem} from "../src";

const c = new ConnectionPool(2);

const i: QueueItem = {
    url: "https://example.com",
    "method" : 'post',
    "reject" : (e) => {
        console.log('e');
    },
    "resolve" : (d) => {
        console.log('d');
    }
}

c.add(i);
c.add(i);
c.add(i);
c.add(i);
c.add(i);
c.add(i);
c.add(i);
c.add(i);
c.add(i);
c.add(i);
c.add(i);
