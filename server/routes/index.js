const fs = require('fs');
// const path = require('path');
const express = require('express');

const router = express.Router();

// Not going to bother with static routes, since this will only run in dev mode, for now.
// By default, everything else should come static from /dist
// router.use('/css', express.static(path.join(__dirname, '../../dist/css')));
// router.use('/fonts', express.static(path.join(__dirname, '../../dist/fonts')));
// router.use('/img', express.static(path.join(__dirname, '../../dist/img')));
// router.use('/js', express.static(path.join(__dirname, '../../dist/js')));
// router.get('/favicon.ico', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../dist/favicon.ico'));
// });
// router.get('/robots.txt', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../dist/robots.txt'));
// });

const files = fs.readdirSync(__dirname).filter((f) => f !== 'index.js').map((m) => m.split('.')[0]);

// This exists just to provide a place to drop a breakpoint, if needed.
router.use((req, res, next) => {
  next();
});

files.forEach((modName) => {
  // eslint-disable-next-line global-require
  router.use(`/${modName}`, require(`./${modName}`));
});

// Not going to bother with static routes, since this will only run in dev mode, for now.
// Serve index.html for anything else
// router.get('*', (req, res) => {
//   console.log(req.url);
//   res.sendFile(path.join(__dirname, '../../dist/index.html'));
// });

module.exports = router;
