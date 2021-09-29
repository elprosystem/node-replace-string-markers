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


// object
export const propKeys = obj => def(obj) ? Object.keys(obj) : []
export const propKey = obj => propKeys(obj)[0]
// export const isObject = x => getPrototypeOf(x) === 'object'
export const isObject = x => typeof x === 'object' && x !== null && !isArray(x)
export const isEmptyObject = x => propKeys(x).length <= 0
export const reverseArrayOfProperties = x => x.reduce((acc, ele) => ({ ...acc, ...ele }), {})
export const arrayOfProperties = x => isArray(x) ? x : propKeys(x).map(m => ({ [m]: x[m] }))
