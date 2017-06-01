const express = require('express');
const request = require('request');
const mongoose = require('mongoose');
const Query = require('./query');

const url = `mongodb://localhost:27017/image-search`;

const app = express();
const port = process.env.PORT || 8080;
const db = mongoose.connect(url).connection;

const API_URL = 'https://www.googleapis.com/customsearch/v1';
const API_KEY = 'AIzaSyApVe4C7JonPQqI_x2XNN0ZtO-J2K8N3jY';
const CSE_ID = '001613859303396393003:zbesmlxd2aa';

var params = function(term, offset) {
  var start =  offset ? '&start=' + offset : '';
  return '?key=' + API_KEY + '&cx=' + CSE_ID + '&searchType=image' + '&q=' + term + start;
}

app.get('/api/imagesearch/:search', (req, res) => {
  const term = req.params.search;
  const offset = req.query.offset;

  // console.log("Search term: " + term);

  request.get({ url: API_URL + params(term, offset) }, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      var query = new Query({ term: term });
      query.save();
      var items = JSON.parse(body).items;
      items = items.map((item) => { return({
        url: item.link,
        snippet: item.snippet,
        thumbnail: item.image.thumbnailLink,
        context: item.image.contextLink
      })});
      res.json(items); 
    }
    if(err) {
      console.log(err);
    }
  });
});

app.get('/api/imagesearch', (req, res) => {
  res.status(500).json({ error: 'Missing search term' }); 
});

app.get('/api/latest/imagesearch', (req, res) => {
  Query.find((err, queries) => {
    if(err) res.send(err);
    queries = queries.map((query) => {return {term: query.term, when: query.createdAt}});
    queries = queries.slice(queries.length - 10, queries.length);
    res.json(queries);
  });
});

app.get('/', (req, res) => {
  res.redirect('/api/latest/imagesearch');
});

app.listen(port);
console.log('Listening on port ' + port);

module.exports = app;