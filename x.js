var Bluebird = require('bluebird');
var promiseWhile = require('promise-while')(Bluebird);
var Queue = require('queue-fifo');
var _ = require('lodash');

var tree = {
  name: 'sqlsn',
  children: [
    {name: 'sqlsn-core'},
    {name: 'sqlsn-run'}
  ]
};

var processNode = function (queue) {
  var node = queue.dequeue();
  console.log(node.name);
  _.forEach(node.children, function (value, name) {
    queue.enqueue(value)
  });
  return Bluebird.resolve();
};

var queue = new Queue();
queue.enqueue(tree);

promiseWhile(
  function () {
    return !queue.isEmpty();
  },
  function () {
    return processNode(queue);
  })
  .then(function () {
    console.log('tradaa!');
  });
