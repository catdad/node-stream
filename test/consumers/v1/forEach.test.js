var _ = require('lodash');
var expect = require('chai').expect;

var getReadableStream = require('../../_utilities/getReadableStream.js');
var getDuplexStream = require('../../_utilities/getDuplexStream.js');
var runBasicStreamTests = require('../../_utilities/runBasicStreamTests.js');
var forEach = require('../../../').forEach;

describe('[v1-forEach]', function () {
  var data = ['item1', new Buffer('item2'), 'item3', 'item4'];

  function runTest(stream, objectMode, done) {
    var idx = 0;

    function onData(chunk) {

      expect(chunk).to.be.an.instanceof(Buffer);
      expect(chunk).to.deep.equal(new Buffer(data[idx]));

      idx += 1;
    }

    function onEnd() {
      expect(arguments).to.have.lengthOf(0);
      expect(idx).to.equal(data.length);

      done();
    }

    forEach(stream, onData, onEnd);
  }

  runBasicStreamTests(data, data, runTest);

  it('returns an error for a Readable stream', function (done) {
    var readableStream = getReadableStream(data.concat([12]));

    forEach(readableStream, _.noop, function (err) {
      expect(arguments).to.have.lengthOf(1);
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('Invalid non-string/buffer chunk');
      done();
    });
  });

  it('returns an error for a Duplex stream', function (done) {
    var duplexStream = getDuplexStream(data.concat([12]));

    forEach(duplexStream, _.noop, function (err) {
      expect(arguments).to.have.lengthOf(1);
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('Invalid non-string/buffer chunk');
      done();
    });
  });
});
