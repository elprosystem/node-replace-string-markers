import { newReplaceKeyValue } from './refmarkers.js';
import { displayValue } from './displayValue.js';
import { defaultMessage, _errorsMessage } from "./getMessage.js";
import { arrayOfProperties, isEmptyObject, propKeys, replaceAll } from "./utils/helpers.js";





// ......................................
//// replaceMessage ( replaceMessage stringStatic and stringMessage per filterValues )
// ......................................


const replaceMessage = (replaceValues, str, textmarker, opts) => {

  return replaceValues.reduce((acc, curr) => {

    const key = propKeys(curr)[0]
    const value = curr[key]

    // hasRefemarkers
    const { newKey, newValue } = newReplaceKeyValue(textmarker, key, replaceValues, value, opts)

    return textmarker.includes(newKey)
      // string, this , to this
      ? acc = replaceAll(acc, newKey, displayValue(newValue, opts))//replace
      : acc
  }, str)
}

// ......................................
//// filterValuesStatic
// ......................................


const filterValuesStatic = (acc, key, value) => {
  const nKey = key.replace('$', '')
  return key.indexOf('$') > -1
    ? [...acc, { [nKey]: value }]
    : acc
}



// ......................................
//// filterValuesMessage
// ......................................


const filterValuesMessage = (acc, key, value) => {
  return key.indexOf('$') > -1
    ? acc
    : [...acc, { [key]: value }]
}


// ......................................
//// filterStaticValues
// ......................................


const filterValues = (fn, values) => arrayOfProperties(values).reduce((acc, curr) => {
  const key = propKeys(curr)[0]
  const value = curr[key]
  return fn(acc, key, value)
}, [])



const isRefmarkers = (values) => {


  return values
}

// ......................................
//// formatString
// ......................................


export const formatString = (stringStatic, textmarkersStatic, textmarkersMessage, stringMessage, value, opts) => {

  // staticValues
  const staticValues = filterValues(filterValuesStatic, value)
  // messageValues
  const messageValues = filterValues(filterValuesMessage, value)


  // replace stringStatic per filterStaticValues
  const replacedStringStatic = replaceMessage(staticValues, stringStatic, textmarkersStatic, opts)
  const replacedStringMessage = replaceMessage(messageValues, stringMessage, textmarkersMessage, opts)

  return { replacedStringStatic, replacedStringMessage }

}

