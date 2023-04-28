const { readFileSync } = require('fs');
const { join } = require('path');
const BoggleMatrix = require('../BoggleMatrix');
const setupData = require('./setup-data.json');

let dictionary;

describe('BoggleMatrix Test Suite Setup', () => {
  beforeAll(() => {
    const dictionaryArray = readFileSync(join(__dirname, './short_word_list.txt'), 'utf-8').split('\n').map((word) => word.trim());
    dictionary = new Set(dictionaryArray);
  });

  test('dictionary is initialized', () => {
    expect(dictionary).toBeInstanceOf(Set);
  });
  test('setupData is initialized', () => {
    expect(setupData.badMatrix).toBeInstanceOf(Array);
    expect(setupData.badMatrix[0]).toBeInstanceOf(Array);
    expect(setupData.goodMatrix).toBeInstanceOf(Array);
    expect(setupData.goodMatrix[0]).toBeInstanceOf(Array);
  });
});

describe('Test static methods', () => {
  test('indicesInRange() succeeds when in range', () => {
    expect(BoggleMatrix.indicesInRange(0, 0)).toBe(true);
    expect(BoggleMatrix.indicesInRange(BoggleMatrix.SIZE.ROWS - 1, BoggleMatrix.SIZE.COLUMNS - 1)).toBe(true);
  });
  test('indicesInRange() fails when below range', () => {
    expect(BoggleMatrix.indicesInRange(0, -1)).toBe(false);
    expect(BoggleMatrix.indicesInRange(-1, 0)).toBe(false);
  });
  test('indicesInRange() fails when above range', () => {
    expect(BoggleMatrix.indicesInRange(BoggleMatrix.SIZE.ROWS - 1, BoggleMatrix.SIZE.COLUMNS)).toBe(false);
    expect(BoggleMatrix.indicesInRange(BoggleMatrix.SIZE.ROWS, BoggleMatrix.SIZE.COLUMNS - 1)).toBe(false);
  });
  test('isValidBoggleMatrix() fails when passed a bad matrix - need more specific tests', () => {
    expect(BoggleMatrix.isValidBoggleMatrix(setupData.badMatrix)).toBe(false);
  });
  test('isValidBoggleMatrix() succeeds when passed a good matrix', () => {
    expect(BoggleMatrix.isValidBoggleMatrix(setupData.goodMatrix)).toBe(true);
  });
  test('capitalizeMatrix() does what it says it does', () => {
    expect(BoggleMatrix.capitalizeMatrix(setupData.goodMatrix)[1][2]).toBe('P');
  });
});

describe('BoggleMatrix constructor', () => {
  test('initializing with a bad matrix throws an error', () => {
    expect(() => new BoggleMatrix(dictionary, setupData.badMatrix)).toThrow('If you pass a matrix to the BoggleMatrix constructor, it must be a valid matrix.');
  });
  test('initializing with a good matrix does not throw an error', () => {
    expect(() => new BoggleMatrix(dictionary, setupData.goodMatrix)).not.toThrow();
  });
  test('initializing with no matrix does not throw an error', () => {
    expect(() => new BoggleMatrix(dictionary)).not.toThrow();
  });
  test('initializing with no matrix produces a matrix of the appropriate dimensions', () => {
    const bm = new BoggleMatrix(dictionary);
    expect(bm?.matrix?.length).toBe(BoggleMatrix.SIZE.ROWS);
    expect(bm?.matrix[BoggleMatrix.SIZE.ROWS - 1].length).toBe(BoggleMatrix.SIZE.COLUMNS);
  });
});

describe('Test non-static methods', () => {
  let goodBM;

  beforeEach(() => {
    goodBM = new BoggleMatrix(dictionary, setupData.goodMatrix);
  });
  test('getLetter() returns the correct letter', () => {
    expect(goodBM.getLetter(1, 2)).toBe('P');
  });
  test('PLACEHOLDER: shake() does not throw an error - need actual test case(s)', () => {
    expect(() => goodBM.shake()).not.toThrow();
  });
  // test('getSolutions() at least returns an array', () => {
  //   expect(goodBM.getSolutions()).toBeInstanceOf(Array);
  // });
  // test('getSolutions(2, 2) at least returns an array', () => {
  //   expect(goodBM.getSolutions()).toBeInstanceOf(Array);
  // });
});

describe('Test solutions', () => {
  let goodBM;
  let solutionsAll; // all solutions in the matrix
  let solutionsSpecific; // solutions from [2, 2];
  const expectedSolutions = ['CPS', 'CSNET', 'CSP', 'CRE', 'CRES', 'CRESS', 'CRESSET', 'CRESSON', 'CRS', 'CHRY', 'CHYPRE', 'CESS'];

  beforeAll(() => {
    goodBM = new BoggleMatrix(dictionary, setupData.goodMatrix);
    solutionsAll = goodBM.getSolutions();
    solutionsSpecific = goodBM.getSolutions(2, 2);
  });
  test('there are 131 solutions, in total', () => {
    expect(solutionsAll.length).toBe(131);
  });
  test('"PRESS" is one of the 131 solutions', () => {
    expect(solutionsAll.includes('PRESS')).toBe(true);
  });
  test('"CESSNA" is NOT of the 131 solutions', () => {
    expect(solutionsAll.includes('CESSNA')).toBe(false);
  });
  test('there are 12 solutions from position [2, 2]', () => {
    expect(solutionsSpecific.length).toBe(12);
  });
  test('the correct 12 solutions are found from position [2, 2]', () => {
    expectedSolutions.forEach((word) => {
      expect(solutionsSpecific.includes(word)).toBe(true);
    });
  });
  // test('5x5 matrix does not blow up', () => {
  //   expect(() => {
  //     const bigBM = new BoggleMatrix(dictionary, setupData.bigMatrix);
  //     const bigSolutions = bigBM.getSolutions();
  //     console.log(bigSolution);
  //   }).not.toThrow();
  // });
});
