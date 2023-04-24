const fs = require('fs');
const path = require('path');

// const asciiFrom = 65; // ASCII code for "A"
// const asciiTo = 90; // ASCII code for "Z"

const readWordsFromFile = (filePath) => {
  const words = fs.readFileSync(filePath, 'utf-8').split('\n').map((word) => word.trim());
  return words.filter((word) => word.length >= 3).map((word) => word.toUpperCase());
};

const bigWordList = readWordsFromFile(path.join(__dirname, 'words_alpha.txt'));

// const dictionary = {};

// for (let i = asciiFrom; i <= asciiTo; i++) {
//   const firstChar = String.fromCharCode(i);
//   dictionary[firstChar] = bigWordList.filter((word) => word.startsWith(firstChar));
// }

const data = bigWordList.join('\n');

fs.writeFileSync(path.join(__dirname, 'words.txt'), data, 'utf-8');
