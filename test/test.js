var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var expect = chai.expect;

chai.use(chaiHttp);

describe('image search abstraction layer', () => {
  describe('/', () => {
    it('should respond with status 200', (done) => {
      chai.request(server)
      .get(path)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      })
    })

    it('should return list of images', (done) => {
      chai.request(server)
      .get(path)
      .end((err, res) => {
        expect(JSON.parse(res.text).videos).to.equal('');
        done();
      })
    })
  })
})