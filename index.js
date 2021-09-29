import { _getMessage, _errorsMessage } from './getMessage.js';
import { _setMessage } from './setMessage.js';
import { _format } from './format.js';
import { getTextmarkers, _getMarkers } from './markers.js';




// ......................................
////  getMessage
// ......................................

export const getMessage = (path) => _getMessage(path)



// ......................................
////  setMessage
// ......................................

export const setMessage = (custonMessage, nameCustom) => _setMessage(custonMessage, nameCustom)



// ......................................
////  getMarkers
// ......................................

export const getMarkers = (str, charStart, charEnd) => _getMarkers(str, charStart, charEnd)



// ......................................
////  format
// ......................................


/**
 * replace-string-markers-js
 *  format
 * @param formatData  Array | Object
 * @comments
  message: String | Object  -> message(s) to be replaced\
  value: Object -> values to replace\
  options: Object -> define  substitution behaviors
 * @returns String | [ String ]
 */

export const format = (formatData) => _format(formatData)




