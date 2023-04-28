/**
 * A two-dimensional array of strings (presumed to be single letters), representing a Boggle matrix
 * @typedef {Array<Array<string>>} Matrix
 */

const ASCII_RANGE = {
  FROM: 65, // ASCII code for "A"
  TO: 90, // ASCII code for "Z"
};

/**
 * To allow for this solver to be generalized to larger or smaller matrices, we'll define the size here.
 * Better than hardcoding in several places.
 * @type {{ROWS: number, COLUMNS: number}}
 */
const MATRIX_MAX = {
  ROWS: 4,
  COLUMNS: 4,
};

const minWordLength = 3;

/**
 * A small utility function to return a random capital letter.
 * @returns {string} a random capital letter
 */
const randomCapLetter = () => String.fromCharCode(Math.floor(Math.random() * (ASCII_RANGE.TO - ASCII_RANGE.FROM + 1)) + ASCII_RANGE.FROM);

const cubeDefinitions = [
  ['A', 'A', 'E', 'E', 'G', 'N'],
  ['A', 'B', 'B', 'J', 'O', 'O'],
  ['A', 'C', 'H', 'O', 'P', 'S'],
  ['A', 'F', 'F', 'K', 'P', 'S'],
  ['A', 'O', 'O', 'T', 'T', 'W'],
  ['C', 'I', 'M', 'O', 'T', 'U'],
  ['D', 'E', 'I', 'L', 'R', 'X'],
  ['D', 'E', 'L', 'R', 'V', 'Y'],
  ['D', 'I', 'S', 'T', 'T', 'Y'],
  ['E', 'E', 'G', 'H', 'N', 'W'],
  ['E', 'E', 'I', 'N', 'S', 'U'],
  ['E', 'H', 'R', 'T', 'V', 'W'],
  ['E', 'I', 'O', 'S', 'S', 'T'],
  ['E', 'L', 'R', 'T', 'T', 'Y'],
  ['H', 'I', 'M', 'N', 'U', 'QU'],
  // ['QU', 'QU', 'QU', 'QU', 'QU', 'QU'],
  ['H', 'L', 'N', 'N', 'R', 'Z'],
];

const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomCapCubeLetter = (cubeIndex) => {
  const cubeSide = randomIntegerInRange(0, 5);
  return cubeDefinitions[cubeIndex][cubeSide];
};

/**
 * A small utility function to determine whether a value is a single letter. Used to test for matrix validity.
 * @param {*} value - the value we are testing
 * @returns {boolean} true if the value is a single letter (upper or lower case)
 */
const isSingleLetter = (value) => (/^[A-Za-z]$/m.test(value));

const isSingleLetterOrQu = (value) => isSingleLetter(value) || value.toUpperCase() === 'QU';

/**
 * Class representing a Boggle matrix with methods to solve it
 */
class BoggleMatrix {
  static SIZE = MATRIX_MAX;

  /**
   * @param {Set} dictionary - a Set containing all words to consider in a solution
   * @param {Matrix} matrix - a two-dimensional array (columns nested in rows), representing the Boggle matrix
   */
  constructor(dictionary, matrix) {
    // @TODO: check params
    this.dictionary = dictionary;
    if (matrix !== undefined) {
      if (BoggleMatrix.isValidBoggleMatrix(matrix)) {
        this.matrix = BoggleMatrix.capitalizeMatrix(matrix);
      } else {
        throw new Error('If you pass a matrix to the BoggleMatrix constructor, it must be a valid matrix.');
      }
    } else {
      this.shake(false);
    }
  }

  /**
   * Creates a new randomized matrix.
   * @param {boolean} purelyRandom - if true, we generate completely random letters - if false, we use cube definitions
   * @see {@link MATRIX_MAX}
   */
  shake(purelyRandom = false) {
    this.matrix = [];
    for (let rowIndex = 0; rowIndex < BoggleMatrix.SIZE.ROWS; rowIndex++) {
      const row = [];
      for (let colIndex = 0; colIndex < BoggleMatrix.SIZE.COLUMNS; colIndex++) {
        const cubeIndex = rowIndex * 4 + colIndex;
        if (purelyRandom) {
          row.push(randomCapLetter());
        } else {
          row.push(randomCapCubeLetter(cubeIndex));
        }
      }
      this.matrix.push(row);
    }
  }

  /**
   * Just adds a little syntactic sugar for accessing a single element in the two-dimensional array
   * @param {number} rowIndex - the row index
   * @param {number} colIndex - the column index
   * @returns {string} Assuming the matrix only contains letters, the method returns the letter at the given indices.
   */
  getLetter(rowIndex, colIndex) {
    if (BoggleMatrix.indicesInRange(rowIndex, colIndex)) {
      return this.matrix[rowIndex][colIndex];
    } else {
      throw new Error('When calling getLetter, both row and col must be integers in the range of 0-3.');
    }
  }

  /**
   * Just so we don't have to deal with capitalization issues, the word list (dictionary) and matrix
   * are both in upper case.  This just ensure that the matrix is capitalized.
   * @param {Matrix} matrix - the Boggle matrix
   * @returns {Matrix} the Boggle matrix, having capitalized all elements
   */
  static capitalizeMatrix(matrix) {
    // @TODO: Consider calling isValidBoggleMatrix first, though shouldn't be strictly necessary.
    const retval = [];
    for (let rowIndex = 0; rowIndex < BoggleMatrix.SIZE.ROWS; rowIndex++) {
      const row = [];
      for (let colIndex = 0; colIndex < BoggleMatrix.SIZE.COLUMNS; colIndex++) {
        const letter = matrix[rowIndex][colIndex];
        row.push(letter.toUpperCase());
      }
      retval.push(row);
    }
    return retval;
  }

  /**
   * A little utility method to make sure row and column indices are valid
   * @param {number} rowIndex - the row index ... obviously
   * @param {number} colIndex - the column index ... obviously
   * @returns {boolean} true if rowIndex and colIndex are integers within a valid range for this matrix
   * @see {@link MATRIX_MAX}
   */
  static indicesInRange(rowIndex, colIndex) {
    const rowInRange = Number.isInteger(rowIndex) && rowIndex >= 0 && rowIndex < BoggleMatrix.SIZE.ROWS;
    const colInRange = Number.isInteger(colIndex) && colIndex >= 0 && colIndex < BoggleMatrix.SIZE.COLUMNS;
    return rowInRange && colInRange;
  }

  /**
   * When a matrix is passed to the constructor, we want to make reasonably sure it is valid.
   * This method does some rudimentary checking.
   * @param {Matrix} matrix - the matrix we are testing
   * @returns {boolean} true if we believe this is a valid matrix
   */
  static isValidBoggleMatrix(matrix) {
    const hasCorrectNumberOfRows = Array.isArray(matrix) && matrix?.length === BoggleMatrix.SIZE.ROWS;
    let matrixIsValid = true; // assume it is valid until we find something we don't like

    if (hasCorrectNumberOfRows) {
      matrix.forEach((row) => {
        const rowIsArray = Array.isArray(row);
        if (rowIsArray) {
          // const letters = row.filter((element) => isSingleLetter(element));
          const letters = row.filter((element) => isSingleLetterOrQu(element));
          matrixIsValid = matrixIsValid && letters.length === BoggleMatrix.SIZE.COLUMNS;
        } else {
          matrixIsValid = false;
        }
      });
    }

    return matrixIsValid;
  }

  /**
   * Solves the Boggle matrix - finding all words in the dictionary that can be solutions.
   * Optional onlyRowIndex and onlyColIndex allow us to solve ONLY starting from the indicated
   * position. This makes testing simpler.
   * @param {number?} onlyRowIndex - if passed, we will only solve from the given index
   * @param {number?} onlyColIndex - if passed, we will only solve from the given index
   * @returns {Array<string>} an array of strings that are solutions to the matrix
   * @todo When there is no element in this.dictionary that starts with the value of segment, we
   * could stop searching. This would optimize for speed. Currently, the code will run out all strings
   * of adjacent cells, even when there is no possibility that the addition of the next cell would
   * result in a found word.
   * @todo This should really be async!
   */
  getSolutions(onlyRowIndex, onlyColIndex) {
    const rowCount = this.matrix.length;
    const colCount = this.matrix[0].length; // assumes all rows have the same number of columns
    const visitedCells = Array(rowCount).fill().map(() => Array(colCount).fill(false));
    const words = [];

    // const runningWordList = [];
    let paredList = this.dictionary;

    /**
     * This function is nested inside getSolutions so we can call it recursively, but easily keep
     * track of words found and cells visited, so far.  We start at rowIndex, colIndex and look at
     * all adjacent cells for potential words
     * @param {number} rowIndex - the starting row index
     * @param {number} colIndex - the starting column index
     * @param {Set<string>} progressiveWordList - the progressively-smaller set of words for us to search
     * @param {string} segment - the letters accumulated so far by following a string of adjacent cells
     * @see {@link getSolutions} for thoughts about optimization
     */
    const searchFromPosition = (rowIndex, colIndex, progressiveWordList, segment = '') => {
      if (BoggleMatrix.indicesInRange(rowIndex, colIndex) && !visitedCells[rowIndex][colIndex]) {
        const letter = this.getLetter(rowIndex, colIndex);
        const candidate = `${segment}${letter}`;
        visitedCells[rowIndex][colIndex] = true;

        // I do this length check as a point of optimization. It is not strictly needed, as no
        // 2-character words will ever be found.  But, it should provide a speed benefit, since
        // each of these Set.has() calls is fairly expensive.
        if (candidate.length >= minWordLength && paredList.has(candidate)) {
          words.push(candidate);
        }

        if (paredList.size > 0) {
          // look horizontally and vertically
          searchFromPosition(rowIndex - 1, colIndex, paredList, candidate);
          searchFromPosition(rowIndex + 1, colIndex, paredList, candidate);
          searchFromPosition(rowIndex, colIndex - 1, paredList, candidate);
          searchFromPosition(rowIndex, colIndex + 1, paredList, candidate);
          // look diagonally
          searchFromPosition(rowIndex - 1, colIndex - 1, paredList, candidate);
          searchFromPosition(rowIndex - 1, colIndex + 1, paredList, candidate);
          searchFromPosition(rowIndex + 1, colIndex - 1, paredList, candidate);
          searchFromPosition(rowIndex + 1, colIndex + 1, paredList, candidate);
        }

        visitedCells[rowIndex][colIndex] = false;
      }
    };

    if (Number.isInteger(onlyRowIndex) && Number.isInteger(onlyColIndex)) {
      searchFromPosition(onlyRowIndex, onlyColIndex, paredList);
    } else {
      for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
          paredList = this.dictionary;
          searchFromPosition(row, col, paredList);
        }
      }
    }

    return words;
  }
}

module.exports = BoggleMatrix;
