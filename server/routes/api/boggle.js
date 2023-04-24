const express = require('express');

const boggle = require('../../controllers/boggle-controller');

const router = express.Router();

router.get('/matrix', boggle.generateRandomMatrix);
router.post('/solve', boggle.solveMatrix);

module.exports = router;
