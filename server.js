const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.json({});
});

app.listen(port);
console.log('Listening on port ' + port);

module.exports = app;