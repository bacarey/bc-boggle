
# BC Boggle

Solves a Boggle matrix for any words that occur in a given dictionary. Optionally creates a random Boggle matrix to solve.

See https://en.wikipedia.org/wiki/Boggle#Rules


## Authors

- Brent Carey

## Overview
This project is just a code submission, so lacks quite a bit. 
The backbone of the submission is in /server/modules/boggle-matrix/.
That's the only place I put any real effort.

BoggleMatrix.js does everything unique to this coding challenge, and all of the tests are all in that same directory.

Everything else is just a hastily thrown-together client/server to satisfy the web UI
requirement of the submission request.

The frontend is a really rough Vue SPA.  The backend is a pretty basic Express server that
just provides two REST endpoints:
* GET /api/boggle/matrix
* POST /api/boggle/solve (takes a valid matrix in the POST request)

To be honest, the whole client/server setup was a complete afterthought. I had overlooked the web UI
requirement.  So, I would have built BoggleMatrix.js a little bit differently.

Though, the way it is built, BoggleMatrix.js is very testable and functionally independent, 
and I provided a decent representation of what some of the more important tests might look like 
(written for Jest).  Possibly the only change I would make to better support the client/server architecture
is to make BoggleMatrix.getSolutions() asynchronous.  I have some thoughts on that below, with regards
to how I might optimize for performance.


The repo includes a big word list called words_alpha.txt obtained from https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt.  Additionally, I wrote some quick-and-dirty code in reduce_word_list.js that filters out words_alpha.txt for only words with a length >= 3 characters.

The word list is still pretty dirty with a bunch of illegal Boggle words, but it serves its purpose.

The resulting word list is stored in big_word_list.txt, but any array of words can be used as a dictionary.

## Installation

Install bc-boggle with npm

```bash
  npm install
```

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Acknowledgements

A few resources were used as reference to create this:

- [randomIntegerInRange](https://www.30secondsofcode.org/js/s/random-integer-in-range/) Used as a basis for the randomCapLetter() function, because I can never seem to remember how to generate random integers.
- [Wikipedia: Boggle Rules](https://en.wikipedia.org/wiki/Boggle#Rules) For rules reference and a couple of test cases.
- [ChatGPT](https://chat.openai.com) I asked the question, "Can you give the JSDoc type notation for a parameter that is an array of strings nested in another array?" because I don't think I've ever used that exact notation before.  The answer is:  {Array<Array<string>>}
- [Array.fill()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill) Because, I wanted to see if there was a slicker way to populate a two-dimensional array.
- [Vuetify](https://vuetifyjs.com) I used the Vuetify UI library just for something quick/easy.
- [Vue](https://vuejs.org) Double checked a couple of syntax points

## Usage/Examples
As mentioned, everything interesting is in BoggleMatrix.js.  So, you can do all of the good stuff, with just the class
defined in that file.

You first need to create or load a dictionary.  To load the default dictionary from the included file:

```javascript
const dictionaryArray = readWordsFromFile(path.join(__dirname, 'big_word_list.txt'));
const dictionary = new Set(dictionaryArray);
```

To provide your own dictionary, you can do something like:
```javascript
const dictionary = new Set(['dog', 'woof', 'cookie']);
```


You don't need to initalize a matrix.  If you don't, a random matrix will be generated.

To get a random matrix and solve:
```javascript
const BoggleMatrix = require('./BoggleMatrix');
const randomMatrix = new BoggleMatrix(dictionary);

const solutions = randomMatrix.getSolutions();
console.log(solutions);
```

To provide your own matrix and solve:
```javascript
const BoggleMatrix = require('./BoggleMatrix');

const myMatrixValues = [
  ['t', 'w', 'y', 'r'],
  ['e', 'n', 'p', 'h'],
  ['g', 's', 'c', 'r'],
  ['o', 'n', 's', 'e'],
];

const myMatrix = new BoggleMatrix(dictionary, myMatrixValues);

const solutions = randomMatrix.getSolutions();
console.log(solutions);
```

## Client/Server
Again, all of the good stuff is in BoggleMatrix.js and its associated tests.  However, you can fire 
up a simple REST backend and web frontend.  This isn't configured as it would be for production, but
I've made it pretty simple to launch everything in dev mode.

You can just:
```shell
npm install
npm run start-all-dev
```
... then open a browser to http://localhost:3000.

The backend actually lives at http://localhost:5000, but I use Vite's server proxy to simplify things.
This also helps with CORS-related issues while developing.

The web UI is pretty raw and not very responsive, but it gives a quick visual representation.  Functionally,
the only thing it really lacks is a UI for inputting your own custom matrix.
You can do that, as described above, but there is no web UI for it.

## Documentation
Documentation is generated by JSDoc.  To build the documentation:
```shell
npm run docs
```
Then, look in the generated /docs folder for the index.html of the documented version.  Open that in
a browser, and you'll get the technical documentation.

## TODO
There is virtually no error handling.  I like to introduce error handling concurrent with
test writing.  By the time I finished writing tests and building out the client/server, I was already
into this a few hours.  So, I figured I would let the go.  Honestly, at this stage, I would rather see uncaught errors as they happen anyway.

Also, there is an optimization issue that bugs me.  Currently, the logic starts at each cell
in the matrix and traces all possible chains of adjacent letters.  But, let's say the first 
two letters of that chain are "QZ".  There is no possibility that chain will ever result in a valid 
word.  But, the logic will still go on and try "QZA", then "QZAN", then "QZANR", etc.

Since, as soon as we see "QZ", and we KNOW there are no words in our dictionary that start with "QZ",
we can abandon that chain. Most of the processing time is actually spent investigating chains that will
never result in a valid word.

Similarly, there is no need to check for 2-character sequences, so I already leveraged this fact by
skipping the lookup for any sequence with fewer than 3 characters, realizing a noticeable performance bump.

I have some ideas for optimizing around the "QZ" issue, but they add to the complexity somewhat.

The first and probably the most impactful change would be to progressively pare the word list as 
we investigate a chain of letters.  So, when the first letter is "D", we only need to search
for words starting with "D".  When the next letter is "O", we can pare the list down to words starting
with "DO", etc.  Currently, the logic always searches the whole list.

To really get much gain in performance, it probably requires restructuring our dictionary to make it 
easy to pare down on the fly.  I would have a number of "nested" word lists so we can instantly get to 
only those words starting with "DO", without having to filter the whole list on the fly.

Another idea would be to take advantage of async behavior and start each chain (or branch of a chain)
as an asynchronous operation.  My hunch is that, at scale, this would pay off, since it would
allow V8 to probably do a better job of optimizing work than I would to try to do it manually.  I would
have to benchmark this, though, since it would become a bit more difficult to debug, so it might not be
worth it.

Something simple I may try is to prefilter the list.  If I take a single pass through the dictionary
and remove any words that are simply not possible because the requisite letters are absent from the matrix,
then the per-chain processing time would shrink dramatically.  The question is whether this
yields a net benefit.  My hunch is that it would.

Finally, if I really needed to scale this, I would consider some caching solution. But since, in an 
actual Boggle game, there are about 21 trillion possible combinations (and about 2 billion times that
in this electronic version), that may not be practical.


