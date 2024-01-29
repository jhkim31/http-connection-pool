const EventEmitter = require('events');

const myEmitter = new EventEmitter();

// 'myEvent' 이벤트에 한 번만 실행되는 리스너 등록
myEmitter.once('myEvent', () => {
  console.log('Listener executed only once.');
});
myEmitter.once('myEvent', () => {
  console.log('Listener executed only once.');
});
myEmitter.once('myEvent', () => {
  console.log('Listener executed only once.');
});

// 이벤트 발생
myEmitter.emit('myEvent');

// 이벤트에 등록된 리스너가 자동으로 삭제되었으므로 다시 호출해도 아무 동작도 일어나지 않음
myEmitter.emit('myEvent');