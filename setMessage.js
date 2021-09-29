
import { isEmptyString, isEmptyObject, isString, isObject, merge } from './util/helpers.js';
import { _errorsMessage } from './getMessage.js'


// customProperty
const removeFirstUnderscore = x => x.slice(1);
const hasFirstUnderscore = x => (x[0]) === '_' ? removeFirstUnderscore(x) : x
const customProperty = x => x && isString(x) && !isEmptyString(x) ? hasFirstUnderscore(x) : '_defaults'

const set = (custonMessage, nameCustom) => {
  return nameCustom in _errorsMessage || '_defaults' in _errorsMessage
    ? _errorsMessage
    : merge(_errorsMessage, { [customProperty(nameCustom)]: custonMessage })
}

// setMessage   (does a deep extend on the existing messages.)
export const _setMessage = (custonMessage, nameCustom) => {
  const custom = custonMessage && isObject(custonMessage) && !isEmptyObject(custonMessage)
  return custom
    ? set(custonMessage, nameCustom)
    : _errorsMessage
};