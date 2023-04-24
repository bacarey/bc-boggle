/**
 * @file This is just working file to serve as an example for usage and facilitate development/debugging.
 * This isn't "real" code.  See README.md for more specific usage details.
 */

const fs = require('fs');
const path = require('path');
const BoggleMatrix = require('./modules/boggle-matrix/BoggleMatrix');

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

const dictionary = createDictionaryFromFile(path.join(__dirname, 'big_word_list.txt'));

// This is the definition of a matrix that should be acceptable to the BoggleMatrix constructor
// const goodMatrix = [
//   ['t', 'w', 'y', 'r'],
//   ['e', 'n', 'p', 'h'],
//   ['g', 's', 'c', 'r'],
//   ['o', 'n', 's', 'e'],
// ];

// This is the definition of a matrix that should be unacceptable to the BoggleMatrix constructor
// const badMatrix = [
//   ['a', 'b', 'c', 'd'],
//   ['e', '2', 'g', 'h'],
//   ['i', 'j', 'k', 'l'],
//   ['m', 'n', 'o', 'p'],
// ];

const bm = new BoggleMatrix(dictionary);
// const bm = new BoggleMatrix(dictionary, goodMatrix);
// const bm = new BoggleMatrix(dictionary, badMatrix);

console.log(bm.matrix); // Shows the matrix that was randomly generated
const solutions = bm.getSolutions();
// const solutions = bm.getSolutions(2, 2);
console.log(solutions); // The list of valid solutions
