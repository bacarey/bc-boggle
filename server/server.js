const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index');

const port = process.env.PORT || 5000;
const app = express();

app.use((req, res, next) => {
  next();
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

// error handler
// noinspection JSUnusedLocalSymbols
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.statusCode || 500).send(err.message || 'An error has occurred');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
