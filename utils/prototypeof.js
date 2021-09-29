


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
const undef = x => !def(x)
const isEmptyArray = x => (x).length <= 0
const propKeys = obj => def(obj) ? Object.keys(obj) : []
const isEmptyObject = x => Object.keys(x).length <= 0
const isObject = x => !Array.isArray(x) && typeof x === 'object' && x !== null
const isEmptyString = x => (x).length <= 0
const isIndeterminate = x => [NaN, undefined, null].includes(x)
const isNaN = (type, x) => type === 'number' ? Number.isNaN(x) ? 'NaN' : indeterminateToString(type) : indeterminateToString(type)
const indeterminateToString = x => isIndeterminate(x) ? indeterminates[x] : x

// ......................................
//// caseEmpty
// ......................................


const caseEmpty = {
  boolean: (x) => !def(x) ? 'string.empty' : false,
  string: (x) => (x).length <= 0 ? 'string.empty' : false,
  number: (x) => Number.isNaN(x) ? 'NaN' : false,
  array: (x) => (x).length <= 0 ? 'array.empty' : false,
  object: (x) => isEmptyObject(x) ? 'object.empty' : false,
}


// ......................................
//// typeEmpty (if there is a type it cannot be empty)
// ......................................


const typeEmpty = (type, x) => ['regex', 'date', 'symbol', 'function', 'number'].includes(type)
  ? false
  : caseEmpty[type](x)



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

const indeterminates = {
  NaN: 'NaN', undefined: 'undefined', null: 'null'
}



// ......................................
//// typeOf
// ......................................


export const typeOf = x => {
  const type = typesOf.reduce((acc, { key, type }) => typeOfConstructor(x, type) ? (key) : acc, indeterminateToString(x))
  return isNaN(type, x)
}



// ......................................
//// deeptypeArray
// ......................................


// isTypeValue
const isTypeValue = x => x.reduce((acc, ele) => [...acc, typeOf(ele)], [])




// ......................................
//// whiletypeArray (while it's array)
// ......................................


const whiletypeArray = ([head, ...tail], type, opt, acc = []) => {
  if (undef(head)) return acc
  const next = typeCaseArray(head, type, opt)
  return whiletypeArray(tail, next.type, opt, [...acc, next.typeValues])
}



// ......................................
//// typeValuesArrayObject
// ......................................


const typeValuesArrayObject = (x, type, opt) =>
  (x).reduce((acc, prop) => ([...acc, typeCaseObject(prop, 'object', opt).typeValues]), [])



// ......................................
//// casetypeValues
// ......................................


const casetypeValues = {
  'array.single': (x, type, opt) => isTypeValue(x),
  'array.object': (x, type, opt) => typeValuesArrayObject(x, type, opt),
  'array.array': (x, type, opt) => whiletypeArray(x, type, opt),
  'array.any': (x, type, opt) => isTypeValue(x),
}


// ......................................
//// typeValuesArray (type of its property values)
// ......................................

const typeValuesArray = (x, type, deeptype, opt) => casetypeValues[deeptype](x, type, opt)





// ......................................
//// deeptypeArray
// ......................................


const array = x => x.every(_x => typeOf(_x) === 'array')
const object = x => x.every(_x => typeOf(_x) === 'object')
const single = x => x.every(_x => ['NaN', 'undefined', 'null'].includes(indeterminateToString(_x)))
  ? true
  : x.every(_x => ['string', 'number', 'boolean'].includes((typeOf(indeterminateToString(_x)))))
    ? true
    : false



// ......................................
//// deeptypeArray
// ......................................


const deeptypeArray = (x) => ({
  deep: 'array.any',
  ...(single(x) && { deep: 'array.single' }),
  ...(object(x) && { deep: 'array.object' }),
  ...(array(x) && { deep: 'array.array' }),
})



// ......................................
//// typeCaseArray
// ......................................


const typeCaseArray = (x, type, opt) => {

  // because empty has no deeptype
  const empty = isEmptyArray(x)
  const deeptype = empty ? typeEmpty(type, x) : type
  const { deep } = empty ? { deep: deeptype } : deeptypeArray(x)


  return opt.report
    ? {
      type: type,
      typeEmpty: typeEmpty(type, x),
      deeptype: empty ? typeEmpty(type, x) : deep,
      typeValues: empty ? typeEmpty(type, x) : typeValuesArray(x, type, deep, opt),
      length: x.length,
      report: opt.report
    }
    : deep// deep
}





// ......................................
//// typeValuesObject (type of its property values)
// ......................................


const typeValuesObject = (x) => propKeys(x).reduce((acc, prop) => ({ ...acc, [prop]: typeOf(x[[prop]]) }), {})



// ......................................
//// typeCaseObject
// ......................................

const typeCaseObject = (x, type, opt) => {
  const empty = isEmptyObject(x)
  const deeptype = empty ? typeEmpty(type, x) : type
  return opt.report
    ? {
      type: type,
      typeEmpty: typeEmpty(type, x),
      deeptype: deeptype,
      typeValues: empty ? typeEmpty(type, x) : typeValuesObject(x),
      length: propKeys(x).length,
      report: opt.report
    }
    : deeptype

}



// ......................................
//// primitive
// ......................................



const typeCasePrimitive = (x, type, opt) => {
  const empty = isEmptyString(x)
  const deeptype = empty ? typeEmpty(type, x) : type
  const props = type === 'string' ? { length: (x).length }
    : type === 'number' ? { interger: Number.isInteger(x), negative: x < 0, safeInteger: Number.isSafeInteger(x) } : ''
  return opt.report
    ? {
      type: type,
      typeEmpty: typeEmpty(type, x),
      deeptype: deeptype,
      typeValues: empty ? typeEmpty(type, x) : type,
      ...props,
      report: opt.report
    }
    : deeptype
}



// ......................................
//// _typeOf
// ......................................


const _typeOf = (x, type, opt) =>
  type === 'array'
    ? typeCaseArray(x, type, opt)
    : type === 'object'
      ? typeCaseObject(x, type, opt)
      : typeCasePrimitive(x, type, opt)




// ......................................
////  isAsyncPromise
// ......................................


const strType = x => x && x.toString() ? x.toString() : ''

const isAsyncPromise = (x) => {
  const str = strType(x)
  return (str.startsWith('async'))
    ? 'async'
    : (str === '[object Promise]')
      ? 'promise'
      : false
}




// ......................................
////  isDepthType
// ......................................


const isDepthType = (x, xType, opt) => opt.depth === true
  ? _typeOf(x, xType, opt)
  : xType


// ......................................
////  prototypeOf
// ......................................


const prototypeOf = (x, xType, opt) => {
  const asyncPromiseType = def(x) ? isAsyncPromise(x) : false
  const type = def(x)
    ? asyncPromiseType ? asyncPromiseType : isDepthType(x, xType, opt)  // _typeOf(x, xType, opt)
    : x === null ? 'null' : 'undefined'
  return type
}




// ......................................
//// getPrototypeOf
// ......................................

const safeOptions = (options) => {

  return def(options) && isObject(options) && !isEmptyObject(options)
    ? { ...optionsDefault, ...options }
    : optionsDefault

}

/**
 * * @name getPrototypeOf
 * * @api public
 * * @param {any} value - value for which its type is returned.
 * * @param {Object}  options? : { depth: false, report: false }
 * * @return {(String | Object)}
 *         string -> 'NaN','undefined','null','regex','date','symbol','function','string','number','boolean','object','array'
 *         (deeptype case array) 'array.single', 'array.object', 'array.array', 'array.any'
 *         object -> (case report) { type: string , typeEmpty: string | boolean, deeptype: string | boolean,
                       typeValues: any, length: number,  report: boolean }

 */

export const getPrototypeOf = (value, options) => {
  const opt = safeOptions(options)

  const xType = typeOf(value)

  return prototypeOf(value, xType, opt)

}

// ......................................
//// typeOfProp
// ......................................

const typeOfProp = (prototype, x) => {

  return typeof prototype !== 'function'
    ? _x => typeOfProp(prototype, _x)
    : (
      x != null && x.constructor === prototype ||
      x instanceof prototype
    )
}



// ......................................
//// getPrototypeOfProp
// ......................................


export const getPrototypeOfProp = (prototype, property, obj) => {

  const objProp = obj[property]
  return def(objProp)
    ? typeOfProp(prototype, objProp)
    : false
}
