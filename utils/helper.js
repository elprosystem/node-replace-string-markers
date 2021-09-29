import { getPrototypeOf } from "./prototypeof.js"

// defined
export const def = x => typeof x !== 'undefined' && x !== null
export const undef = x => !def(x)

// types
export const prototypeOf = x => getPrototypeOf(x)
export const deepPrototypeOf = x => getPrototypeOf(x, { depth: true, report: false })
export const reportPrototypeOf = x => getPrototypeOf(x, { depth: true, report: true })


// string
//export const isString = x => getPrototypeOf(x) === 'string'
export const isString = x => typeof x === 'string'
export const isEmptyString = (str) => def(str) ? (str.trim().length <= 0) ? true : false : true
export const removeSpaces = str => str.replace('  ', ' ')
export const trimQuoteMarks = x => x.replace('" {', '"{').replace('} "', '}"')
// array
export const toArray = (...x) => x
export const removeDuplicates = (array) => ensureArray(array).filter((a, b) => array.indexOf(a) === b)
//export const isArray = x => getPrototypeOf(x) === 'array'
export const isArray = x => Array.isArray(x)

//  (?<=\{{).+?(?=\}})
export const takeBetweenBraces = (x, charStart, charEnd) => x.match(new RegExp(`(?<=\\${charStart}).+?(?=\\${charEnd})`, 'g'))
export const ensureArray = x => isArray(x) ? x : []




export const containsCharacteres = str => /[&\/\\#+[\]()$~%':*?<>{}\-]/g.test(str)
export const replaceByCharacter = (s, c) => s.replace(/[&\/\\#+[\]()$~%':*?<>{}/-]/g, c)


const replace = (x, a, b) => x.split(a).join(b)
/* string, this , to this */
export const replaceAll = (x, a, b) => !(x.indexOf(a) > -1) ? x : replaceAll(replace(x, a, b), a, b)
// takeBetweenChar
export const takeBetweenChar = (str, open, close) => str.split(open)
  .filter((v) => v.indexOf(close) > -1).map((value) => value.split(close)[0])






// object
export const propKeys = obj => def(obj) ? Object.keys(obj) : []
export const propKey = obj => propKeys(obj)[0]
// export const isObject = x => getPrototypeOf(x) === 'object'
export const isObject = x => typeof x === 'object' && x !== null && !isArray(x)
export const isEmptyObject = x => propKeys(x).length <= 0
export const reverseArrayOfProperties = x => x.reduce((acc, ele) => ({ ...acc, ...ele }), {})
export const arrayOfProperties = x => isArray(x) ? x : propKeys(x).map(m => ({ [m]: x[m] }))

// merge two object
const _merge = (destination, ...sources) => {

  sources.forEach((source) => {
    propKeys(source).forEach((prop) => {
      if (
        source[prop]
        && source[prop].constructor
        && source[prop].constructor === Object
      ) {
        if (!destination[prop] || !destination[prop].constructor || destination[prop].constructor !== Object) {
          destination[prop] = {};
        }
        _merge(destination[prop], source[prop]);
      } else {
        destination[prop] = source[prop];
      }
    });
  });
  return destination;
}

// merge two object
export const merge = (destination, sources) => {
  return _merge(destination, sources)
}
