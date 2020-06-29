const { many } = require('./combinators');
const createParser = require('./createParser');

function str(s, op) {
  function logic(state) {
    const { index } = state;
    let parsed = ''; // keep track of what parsed

    // match characters of input from index to string s
    for (let i = 0; i < s.length; i++) {
      const inputChar = global.input[index + i];
      parsed += inputChar;

      // fail ❌
      if (i + index > global.input.length - 1) {
        return {
          ...state,
          error: {
            type: 'unexpected end of input',
            parser: 'str',
          },
        };
      }

      // fail ❌
      if (inputChar !== s[i]) {
        return {
          ...state,
          error: {
            type: 'unexpected character',
            expected: s[i],
            got: inputChar,
            index: index + i,
            parser: 'str',
          },
        };
      }
    }

    // pass ✔️
    return {
      ...state,
      parsed,
      index: index + parsed.length,
    };
  }

  return createParser(logic, op, { type: 'basic', parses: `"${s}"` });
}

function regex(rExp, op, parses) {
  const logic = (state) => {
    const { index } = state;
    const result = global.input.slice(index).match(rExp);
    // pass ✔️
    if (result) return { ...state, parsed: result[0], index: index + result[0].length };
    // fail ❌
    return {
      ...state,
      error: {
        type: 'regex',
        parser: 'regex',
        expected: rExp,
        got: `${global.input.slice(index, index + 10)}...`,
        index: 0,
      },
    };
  };

  return createParser(logic, op, { type: 'regex()', parses });
}

const letters = (op) => regex(/^[a-zA-Z]+/, op, 'letters');
const letter = (op) => regex(/^[a-zA-Z]/, op, 'letter');
const number = (op) => regex(/^[0-9]/, op, 'number');
const numbers = (op) => regex(/^[0-9]+/, op, 'numbers');
const alphaNumeric = (op) => regex(/^[a-zA-Z0-9]/, op, 'alpha numeric');
const alphaNumerics = (op) => regex(/^[a-zA-Z0-9]+/, op, 'alpha numerics');
const singleWhitespace = (op) => regex(/^[\s]/, op, 'one whitespace');

// default 1 or more
// use op.min to set to x or more
const whitespace = (op) => many(singleWhitespace(), op);

module.exports = {
  str,
  regex,
  letter,
  letters,
  number,
  numbers,
  alphaNumeric,
  alphaNumerics,
  singleWhitespace,
  whitespace,
};