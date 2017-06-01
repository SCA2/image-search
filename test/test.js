var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var mongoose = require('mongoose');
var query = require('../query');

var expect = chai.expect;

chai.use(chaiHttp);

describe('image search abstraction layer', () => {
  describe('/', () => {
    it('should redirect to api/latest/imagesearch', (done) => {
      chai.request(server)
      .get('/').redirects(0)
      .end((err, res) => {
        expect(res).to.redirectTo('/api/latest/imagesearch');
        done();
      });
    });
  });

  describe('/api/imagesearch', () => {
    it('should respond with status 500', (done) => {
      chai.request(server)
      .get('/api/imagesearch')
      .end((err, res) => {
        expect(res.status).to.equal(500);
        done();
      })
    })

    it('should return an error message', (done) => {
      chai.request(server)
      .get('/api/imagesearch')
      .end((err, res) => {
        var err_msg = JSON.parse(res.text).error;
        expect(err_msg).to.equal('Missing search term');
        done();
      });
    });
  });

  describe('/api/imagesearch/search', () => {
    it('should respond with status 200', (done) => {
      chai.request(server)
      .get('/api/imagesearch/kittens')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      })
    })

    it('should return array of image objects', (done) => {
      chai.request(server)
      .get('/api/imagesearch/kittens')
      .end((err, res) => {
        expect(JSON.parse(res.text)).to.be.an('array');
        done();
      })
    })

    it('should have objects with specific keys', (done) => {
      chai.request(server)
      .get('/api/imagesearch/kittens')
      .end((err, res) => {
        expect(JSON.parse(res.text)[0]).to.have.all.keys('url', 'snippet', 'thumbnail', 'context');
        done();
      })
    })

    it('accepts an offset', (done) => {
      chai.request(server)
      .get('/api/imagesearch/kittens')
      .end((err, res) => {
        var item_4 = JSON.parse(res.text)[4];
        chai.request(server)
        .get('/api/imagesearch/kittens?offset=5')
        .end((err2, res2) => {
          var item_0 = JSON.parse(res2.text)[0];
          expect(item_0.url).to.equal(item_4.url);
          done();
        })
      })
    })
  })

  describe('recent queries', () => {
    beforeEach((done) => {
      query.remove({}, (err) => { 
        done();         
      });     
    });

    describe('/api/latest/imagesearch', () => {
      it('it should GET all the queries', (done) => {
        chai.request(server)
        .get('/api/latest/imagesearch')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(0);
          done();
        });
      });
    });
  });
})