const fs = require('fs');
const express = require('express');

const router = express.Router();
const files = fs.readdirSync(__dirname).filter((f) => f !== 'index.js').map((m) => m.split('.')[0]);

files.forEach((modName) => {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  router.use(`/${modName}`, require(`./${modName}`));
});

module.exports = router;
