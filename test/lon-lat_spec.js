var should = require("should");
var helper = require("node-red-node-test-helper");
var lowerNode = require("../lon-lat/lon-lat.js");

helper.init(require.resolve('node-red'));


describe('lon-lat Node', function () {

  beforeEach(function (done) {
    helper.startServer(done);
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    var flow = [{
      id: "n1",
      type: "lon-lat",
      name: "lon-lat"
    }];
    helper.load(lowerNode, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.default('name', 'lon-lat');
      n1.should.have.default('querytimerange', 'lon-lat');
      done();
    });
  });
});