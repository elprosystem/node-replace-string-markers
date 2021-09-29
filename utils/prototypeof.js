/**
  ECMAScript 5, Section 8.6.2 Object Internal Properties and Methods:
    Section 15.10 RegExp(RegularExpression)
    Objects:
      "Arguments", "Array", "Boolean", "Date", "Error",
      "Function", "JSON", "Math", "Number", "Object", "RegExp", "String"
 */


// ......................................
//// helpers
// ......................................


const optionsDefault = { depth: false, report: false }
const def = x => typeof x !== 'undefined' && x !== null
const isEmptyArray = x => (x).length <= 0
const propKeys = obj => def(obj) ? Object.keys(obj) : []
const isEmptyObject = x => Object.keys(x).length <= 0
const isObject = x => !Array.isArray(x) && typeof x === 'object' && x !== null
const arrayOfProperties = x => Array.isArray(x) ? x : propKeys(x).map(m => ({ [m]: x[m] }))
const isIndeterminate = x => ['NaN', 'undefined', 'null'].includes(x) ? tostring[x] : x
const isNaN = (type, x) => type === 'number' ? Number.isNaN(x) ? 'NaN' : isIndeterminate(type) : isIndeterminate(type)

// ......................................
//// caseEmpty
// ......................................


const caseEmpty = {
  string: (x) => (x).length <= 0 ? 'string.empty' : false,
  number: (x) => Number.isNaN(x) ? 'NaN' : false,
  array: (x) => (x).length <= 0 ? 'array.empty' : false,
  object: (x) => isEmptyObject(x) ? 'object.empty' : false,
}

// typeEmpty
const typeEmpty = (type, x) => caseEmpty[type](x)


// ......................................
//// typeOfConstructor
// ......................................

const typeOfConstructor = (value, Cls) => value != null && Object.getPrototypeOf(value).constructor === Cls

// ......................................
//// typesOf
// ......................................

const typesOf = [
  { key: 'string', type: String },
  { key: 'number', type: Number },
  { key: 'boolean', type: Boolean },
  { key: 'object', type: Object },
  { key: 'array', type: Array },
  { key: 'regex', type: RegExp },
  { key: 'date', type: Date },
  { key: 'symbol', type: Symbol },
  { key: 'function', type: Function }
]

const tostring = {
  NaN: 'NaN', undefined: 'undefined', null: 'null'
}

// ......................................
//// typeOf
// ......................................


const typeOf = x => {
  const type = typesOf.reduce((acc, { key, type }) => typeOfConstructor(x, type) ? (key) : acc, isIndeterminate(x))
  return isNaN(type, x)
}



// ......................................
//// deeptypeArray
// ......................................


// isTypeValue
const isTypeValue = x => x.reduce((acc, ele) => [...acc, typeOf(ele)], [])


const includesArray = (x) => x.indexOf('array') > -1 ? x : typeof x


const o = x => x.every(_x => _x === 'object')
const s = x => x.every(_x =>
  ['NaN', 'undefined', 'null'].includes(_x) || ['string', 'number', 'boolean'].includes(includesArray(_x)))


// deeptypeArray
const deeptypeArray = arr => {

  return o(isTypeValue(arr))
    ? 'array' + '.' + 'object'
    : s(isTypeValue(arr))
      ? 'array' + '.' + 'single'
      : 'array' + '.' + 'any'

}



// ......................................
//// array
// ......................................


const typeCaseArray = (x, type, opt) => {
  const deeptype = isEmptyArray(x) ? type : deeptypeArray(x)


  return opt.report
    ? {
      type: type,
      typeEmpty: typeEmpty(type, x),
      deeptype: isEmptyArray(x) ? typeEmpty(type, x) : deeptype,
      typeValues: deeptype === 'array.any'
        ? x.reduce((acc, ele) => [...acc, ...isTypeValue(ele)], [])
        : x.reduce((acc, ele) => [...acc, typeOf(ele)], []),
      length: x.length,
      report: opt.report
    }
    : deeptype
}




// ......................................
//// object
// ......................................


const typeCaseObject = (x, type, opt) => {

  return opt.report
    ? {
      type: type,
      typeEmpty: typeEmpty(type, x),
      deeptype: arrayOfProperties(x).reduce((acc, ele) => [...acc, { [propKeys(ele)]: typeOf(ele) }], []),
      typeValues: [type],
      length: propKeys(x).length,
      report: opt.report
    }
    : type
}



// ......................................
//// primitive
// ......................................



const typeCasePrimitive = (x, type, opt) => {

  const props = type === 'string' ? { length: (x).length }
    : type === 'number' ? { interger: Number.isInteger(x), negative: x < 0, safeInteger: Number.isSafeInteger(x) } : ''
  return opt.report
    ? {
      type: type,
      typeEmpty: typeEmpty(type, x),
      deeptype: type,
      typeValues: [type],
      ...props,
      report: opt.report
    }
    : type
}



// ......................................
////  isAsyncPromise
// ......................................


const strType = x => x && x.toString ? x.toString() : ''

const isAsyncPromise = (x) => {

  const str = strType(x)
  return (str.startsWith('async'))
    ? 'async'
    : (str === '[object Promise]')
      ? 'promise'
      : false
}


// ......................................
//// _typeOf
// ......................................


const _typeOf = (x, type, opt) => {

  return type === 'array'
    ? typeCaseArray(x, type, opt)
    : type === 'object'
      ? typeCaseObject(x, type, opt)
      : ['string', 'number', 'boolean'].includes(type)
        ? typeCasePrimitive(x, type, opt)
        : type

}



// ......................................
////  depthTrue
// ......................................


const depthTrue = (x, xType, opt) => {
  const asyncPromiseType = def(x) ? isAsyncPromise(x) : false
  const type = def(x)
    ? asyncPromiseType ? asyncPromiseType : _typeOf(x, xType, opt)
    : x === null ? 'null' : 'undefined'
  return type
}



// ......................................
////  depthFalse
// ......................................


const depthFalse = (x, xType) => {

  const asyncPromiseType = def(x) ? isAsyncPromise(x) : false
  const type = def(x)
    ? asyncPromiseType ? asyncPromiseType : xType
    : x === null ? 'null' : 'undefined'
  return type
}



// ......................................
//// getPrototypeOf
// ......................................

/**
 * getPrototypeOf
 * @return String: -> 'NaN','undefined','null','string','number','boolean','object','array'
 * deeptype: -> 'array.single', 'array.object', 'array.any'
 */
export const getPrototypeOf = (x, options) => {

  const opt = def(options) && isObject(options) && !isEmptyObject(options)
    ? options
    : optionsDefault

  const xType = typeOf(x)



  return opt.depth === true ? depthTrue(x, xType, opt) : depthFalse(x, xType)
}






const typeOfProp = (prototype, x) => {

  return typeof prototype !== 'function'
    ? _x => typeOfProp(prototype, _x)
    : (
      x != null && x.constructor === prototype ||
      x instanceof prototype
    )
}

export const getPrototypeOfProp = (prototype, property, obj) => {

  const objProp = obj[property]
  return def(objProp)
    ? typeOfProp(prototype, objProp)
    : false
}
