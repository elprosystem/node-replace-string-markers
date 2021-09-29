import { performance } from 'perf_hooks'
import { log } from '../eLog/index.js';
import { safeOptions } from './options.js';
import { _getMessage, defaultMessage, _errorsMessage, parseMessages } from './getMessage.js';
import { _setMessage } from './setMessage.js';
import { getTextmarkers } from './markers.js';
import { formatString } from "./formatString.js";
import { isArray, isEmptyObject, isObject, removeSpaces, toArray } from './utils/helper.js';



// ......................................
////  end message
// ......................................


// finalCharacter
const finalCharacter = opts => opts && "finalCharacter" in opts ? opts.finalCharacter : ".";


// last character
const lastCharacter = (x, opts) => {
  const lastChar = x.substring(x.length - 1);
  const finalChar = finalCharacter(opts); // <- options.finalCharacter
  return lastChar.indexOf(".") > -1 ? x : `${x}${finalChar}`;
}


// beautifyMessage   trimQuoteMarks()
const beautifyMessage = (message, opts) => {

  const msg = message.indexOf('_&.string.empty') > -1
    ? message.substring(15, message.length)
    : message

  return removeSpaces(lastCharacter(msg, opts))
}


// ......................................
//// finishedMessage
// ......................................


const finishedMessage = (stringStatic, stringMessage, opts) => {

  const concatMessage = concatMessages(stringStatic, stringMessage, opts)

  return beautifyMessage(concatMessage, opts)

}



// ......................................
////  staticMarkInterpolate
// ......................................


const staticMarkInterpolate = (stringStatic, stringMessage, opts) => {

  const { charStart, charEnd } = opts.interpolate
  const interpolate = `${charStart}$${charEnd}`

  return opts.staticMark === 'mark' && stringMessage.includes(interpolate)
    ? stringMessage.replace(interpolate, stringStatic)
    : stringStatic + stringMessage // default 'start'
}



// ......................................
//// concatMessages
// ......................................


const concatMessages = (stringStatic, stringMessage, opts) =>
  opts.staticMark === 'start'
    ? stringStatic + stringMessage // default 'start'
    : opts.staticMark === 'end'
      ? stringMessage + stringStatic
      : staticMarkInterpolate(stringStatic, stringMessage, opts)




// ......................................
//// replacedWithTextmarkers
// ......................................


const replacedWithTextmarkers = (stringStatic, textmarkersStatic, textmarkersMessage, stringMessage, value, opts) => {

  const { replacedStringStatic, replacedStringMessage } =
    formatString(stringStatic, textmarkersStatic, textmarkersMessage, stringMessage, value, opts)

  return finishedMessage(replacedStringStatic, replacedStringMessage, opts)
}



// ......................................
//// replacedWithoutTextmarkers
// ......................................


const replacedWithoutTextmarkers = (stringStatic, stringMessage, opts) => finishedMessage(stringStatic, stringMessage, opts)



// ......................................
//// textMarkers
// ......................................

const textMarkers = (stringStatic, stringMessage, opts) => {

  const textmarkersStatic = getTextmarkers(stringStatic, opts)
  const textmarkersMessage = getTextmarkers(stringMessage, opts)

  return {
    textmarkersStatic, textmarkersMessage,
    markers: textmarkersStatic.concat(textmarkersMessage).length >= 1
  }
}



// ......................................
//// replacedMessages
// ......................................


const replacedMessages = (message, value, options) => {


  // safe options
  const opts = safeOptions(options)


  // messages
  const { stringStatic, stringMessage } = parseMessages(message)


  // textmarkers
  const { textmarkersStatic, textmarkersMessage, markers } = textMarkers(stringStatic, stringMessage, opts)


  // replace only if exists textmarkers in stringStatic || stringMessage
  const replaced = markers
    ? replacedWithTextmarkers(stringStatic, textmarkersStatic, textmarkersMessage, stringMessage, value, opts)
    : replacedWithoutTextmarkers(stringStatic, stringMessage, opts)

  // end message
  return replaced

}



// ......................................
////  safeValues
// ......................................


const safeValues = (message, value) =>
  message.error
    ? message.error
    : value && typeof value === 'object' && value !== null && !isEmptyObject(value)
      ? true
      : { error: defaultMessage(`internalErrorsMessage.valueNotProvided`) }




// ......................................
////  safeMessages
// ......................................


const safeMessages = (message) =>
  message && typeof message === 'object' && message !== null && !isEmptyObject(message)
    ? true
    : { error: defaultMessage(`internalErrorsMessage.messageNotProvided`) }



// ......................................
////  safeMessagesValues
// ......................................


const safeMessagesValues = (message, value) => safeValues(safeMessages(message), value)




// ......................................
////  formatMessageArray
// ......................................


const formatMessages = x =>

  x.reduce((acc, { message, value, options }) => {

    const { error } = safeMessagesValues(message, value)

    // end message
    return acc = error
      ? error
      : replacedMessages(message, value, options)
  }, '')




// ......................................
////  formatMessageArray
// ......................................


const formatMessagesArray = formatData => {
  return formatData.reduce((acc, curr) => {
    return [...acc, formatMessages(toArray(curr))]
  }, [])
}



// ......................................
////  format
// ......................................


export const _format = (formatData) => {

  // Performance Marks
  performance.mark("eStringMessage-start")

  const message = isArray(formatData)
    ? formatMessagesArray(formatData)
    : isObject(formatData)
      ? formatMessages(toArray(formatData))
      : defaultMessage(`internalErrorsMessage.messageNotProvided`, _errorsMessage)


  // performance Marks
  performance.mark("eStringMessage-end")
  performance.measure("eStringMessage", "eStringMessage-start", "eStringMessage-end")

  return message
}
