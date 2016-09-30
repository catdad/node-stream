var expect = require('chai').expect;

var getReadableStream = require('../_utilities/getReadableStream.js');
var getDuplexStream = require('../_utilities/getDuplexStream.js');
var wait = require('../../').wait;

describe('[v1-wait]', function () {
  var data = ['item1', new Buffer('item2'), 'item3', 'item4'];

  function runTest(stream, done) {

    function onEnd(err, content) {
      expect(arguments).to.have.lengthOf(2);

      expect(err).to.equal(null);

      expect(content).to.be.an.instanceof(Buffer);
      expect(content).to.deep.equal(Buffer.concat(data.map(function (item) {
        return new Buffer(item);
      })));

      done();
    }

    wait(stream, onEnd);
  }

  it('waits for a Readable stream', function (done) {
    var readableStream = getReadableStream(data);

    runTest(readableStream, done);
  });

  it('waits for a Readable object stream', function (done) {
    var readableStream = getReadableStream(data, {
      objectMode: true
    });

    runTest(readableStream, done);
  });

  it('returns an error for a Readable stream', function (done) {
    var readableStream = getReadableStream(data.concat([12]));

    wait(readableStream, function (err) {
      expect(arguments).to.have.lengthOf(1);
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('Invalid non-string/buffer chunk');
      done();
    });
  });

  it('waits for a Duplex stream', function (done) {
    var duplexStream = getDuplexStream(data);

    runTest(duplexStream, done);
  });

  it('waits for a Duplex object stream', function (done) {
    var duplexStream = getDuplexStream(data, {
      objectMode: true
    });

    runTest(duplexStream, done);
  });

  it('returns an error for a Duplex stream', function (done) {
    var duplexStream = getDuplexStream(data.concat([12]));

    wait(duplexStream, function (err) {
      expect(arguments).to.have.lengthOf(1);
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('Invalid non-string/buffer chunk');
      done();
    });
  });
});
