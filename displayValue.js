

import { log } from "../eLog/index.js";
import { getPrototypeOf, typeOf } from "./util/prototypeof.js";
import { optsDefault, safeOptions } from "./options.js";
import { deepPrototypeOf, propKey } from "./utils/helper.js";



// types

const types = ['string', 'number', 'boolean', 'object', 'array', 'regex', 'date']

// ......................................
//// replaceCasesType
// ......................................

const replaceCasesType = {
  'string': (x) => x,
  'string.empty': (x) => x,
  'number': (x) => x,
  'boolean': (x) => x,
  'object': (x, opts, depth = opts.depth) => ` ${replaceObject(x, opts, depth)} `,
  'array': (x, opts) => caseMore(x, opts),
  'array.single': (x, opts) => caseMore(x, opts),
  'array.object': (x, opts) => `${replaceCasesType["object"](x[0], opts)}`,
  'array.any': (x, opts) => caseMoreObject(x, opts),
  'undefined': (x) => '_$.any.undefined',
};


// ......................................
//// moreArray
// ......................................


const moreArray = (type, x) => {

  const firstElement = x[propKey(x)][0];

  return type === "array.single"
    ? `[ ${firstElement} , more... ]`
    : type === "array.object"
      ? `[ { ${propKey(firstElement)}: more... } ]`
      : `[ [ more... ] ]`;
};



// ......................................
//// caseMoreObject
// ......................................


const caseMoreObject = (x, opts, depth) => {

  const valueKey = x[propKey(x)]

  const { type, value } = tostring(deepPrototypeOf(valueKey), valueKey)

  const _value = depth <= 0 ? ' more...' : value

  return type === "object"
    ? replaceCasesType[type](_value, opts, depth - 1)// moreObject(x)
    : type.indexOf("array") > -1
      ? moreArray(type, x)
      : replaceCasesType[type](_value, opts, depth - 1)//"more..."
};



// ......................................
//// replaceCases ('object')
// ......................................


const replaceObject = (x, opts, depth) => {
  const obj = depth <= 0 ? ' more...' : caseMoreObject(x, opts, depth)
  return `{ ${propKey(x)}: ${obj} }`
}



// ......................................
//// case more
// ......................................


const caseMore = (x, opts) => {

  const depth = opts.depth ?? 3
  const length = x.length
  const isTypes = x.some(s => types.includes(s))

  const more = isTypes ? x : length <= depth ? x : [...x.slice(0, depth), 'more...']
  return `${more.join(", ")}`
}




// ......................................
//// replacePer
// ......................................


const replacePer = ({ typeValue, valueOfReplaceValue }, opts) => {

  return replaceCasesType[typeValue](valueOfReplaceValue, opts)
}



// ......................................
//// stringify
// ......................................


// caseUndef
const caseUndef = (key, value) => {
  return typeof value === 'undefined'
    ? 'undefined'
    : typeof value === 'function'
      ? value.toString()
      : value
}

// stringify
const stringify = x => JSON.stringify(x, caseUndef)

const typesToString = ['NaN', NaN, 'undefined', undefined, 'null', null, 'regex', 'date', 'symbol', 'function']

const tostring = (type, value) => typesToString.includes(type)
  ? { type: 'string', value: value ? value.toString() : value }
  : { type: type, value: value }



// ......................................
//// parseValueOfReplaceValue
// ......................................


const parseValueOfReplaceValue = valueOfReplaceValue => {

  const typeValue = deepPrototypeOf(valueOfReplaceValue)

  const { type, value } = tostring(typeValue, valueOfReplaceValue)

  return getPrototypeOf(value) === 'string'
    ? { typeValue: type, valueOfReplaceValue: value }
    : { typeValue, valueOfReplaceValue }
}


// ......................................
//// displayValue
// ......................................


export const displayValue = (valueOfReplaceValue, opts) => opts.objectJason === true
  ? stringify(valueOfReplaceValue)
  : replacePer(parseValueOfReplaceValue(valueOfReplaceValue), opts)
