import { reverseArrayOfProperties } from "./utils/helper.js"



// ......................................
//// is
// ......................................

const specialchar = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi
const replaceSpecialchar = str => str.replace(specialchar, '')


const is = (keyTarget, refmarkers, objectValues) => {

  const newObjectValues = refmarkers.is(objectValues)

  // value of current key of values changed by 'refmarkers.is' function
  const newReplaceValue = newObjectValues[keyTarget]

  // if function return is undefined
  return newReplaceValue
    ? newReplaceValue
    : objectValues[keyTarget]

}


// ......................................
//// newValueRefmarkers
// ......................................

const newValueRefmarkers = (newKey, values, { refmarkers }) => {

  const objectValues = reverseArrayOfProperties(values)

  // current key of values that contains 'refmarkers'
  const keyTarget = replaceSpecialchar(newKey)

  const newReplaceValue = typeof refmarkers.is === 'function'
    ? is(keyTarget, refmarkers, objectValues)
    : refmarkers.is === refmarkers.char
      ? refmarkers.then
      : refmarkers.otherwise

  return newReplaceValue
}



// ......................................
////  parseRefmarkers
// ......................................


// hasRefemarkers
const hasRefemarkers = (textmarkers, keyWithRefemarkers) => textmarkers.includes(keyWithRefemarkers)


// keyMarkers  (keyWithoutRefemarkers)
const keyMarkers = ({ interpolate }, key) => {
  const { charStart, charEnd } = interpolate
  return `${charStart}${key}${charEnd}`
}


// keyRefemarkers  (keyWithRefemarkers)
const keyRefemarkers = ({ refmarkers, interpolate }, key) => {
  const { charStart, charEnd } = interpolate
  return `${charStart}${refmarkers.char}${key}${charEnd}`
}


// parseRefmarkers
const parseRefmarkers = (textmarkers, key, opts) => {

  const keyWithRefemarkers = keyRefemarkers(opts, key)
  const keyWithoutRefemarkers = keyMarkers(opts, key)

  return hasRefemarkers(textmarkers, keyWithRefemarkers)
    ? [true, keyWithRefemarkers]
    : [false, keyWithoutRefemarkers]
}




// ......................................
////  newReplaceValues
// ......................................


const _newReplaceKeyValue = (textmarker, key, replaceValues, value, opts) => {

  const parse = parseRefmarkers(textmarker, key, opts)
  const newKey = parse[1]

  const newValue = parse[0] ? newValueRefmarkers(newKey, replaceValues, opts) : value

  return { newKey, newValue }
}



// ......................................
////  newReplaceValues
// ......................................


export const newReplaceKeyValue = (textmarker, key, replaceValues, value, opts) => {

  return opts && opts.refmarkers
    ? _newReplaceKeyValue(textmarker, key, replaceValues, value, opts)
    : { newKey: keyMarkers(opts, key), newValue: value }

}

