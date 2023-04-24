const fs = require('fs');
const path = require('path');

const createError = require('http-errors');
const BoggleMatrix = require('../modules/boggle-matrix/BoggleMatrix');

/**
 * Opens a newline separated text file of words for our dictionary and returns a Set containing those words.
 * @param {string} filePath - the absolute path of the file containing the word list
 * @returns {Set<string>} a set containing all words from the file
 */
const createDictionaryFromFile = (filePath) => {
  const words = fs.readFileSync(filePath, 'utf-8').split('\n').map((word) => word.trim());
  const dictionaryArray = words.filter((word) => word.length >= 3).map((word) => word.toUpperCase());
  return new Set(dictionaryArray);
};

const dictionary = createDictionaryFromFile(path.join(__dirname, '../big_word_list.txt'));

// async to be consistent with other handlers that may need to be async
// eslint-disable-next-line require-await
const generateRandomMatrix = async (req, res, next) => {
  try {
    // TODO: In reality, we don't need to instantiate a BoggleMatrix with a dictionary just to get a matrix.
    // But, as I originally designed this, you would really only generate a matrix with its solutions
    // all in one go.  By adding the UI, I decided to decouple these, but have not refactored BoggleMatrix
    // accordingly.
    const bm = new BoggleMatrix(dictionary);
    return res.send(bm.matrix);
  } catch (err) {
    console.error(err);
    const reErr = createError(500, 'Unable to create a matrix');
    return next(reErr);
  }
};

// async to be consistent with other handlers that may need to be async
// eslint-disable-next-line require-await
const solveMatrix = async (req, res, next) => {
  try {
    const matrix = req.body;
    const bm = new BoggleMatrix(dictionary, matrix);
    const solutions = bm.getSolutions();
    return res.send(solutions.sort());
  } catch (err) {
    console.error(err);
    const reErr = createError(500, 'Unable to create a matrix');
    return next(reErr);
  }
};

module.exports = {
  generateRandomMatrix,
  solveMatrix,
};
