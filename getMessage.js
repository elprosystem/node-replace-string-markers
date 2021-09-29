
import { getDotNotation } from "./utils/dot.string.notation.js";
import { def, isString, isEmptyString, } from "./utils/helper.js";




// libery messages
export const _errorsMessage = {
  internalErrorsMessage: {
    errorSetMessage: 'Error[errorMessage] messages must be an object and cannot be empty.',
    errorGetMessage: 'Error [errorMessage] message not found or unknown.',
    errorSetValue: 'Error [errorMessage] no parameters provided or invalid type.',
    messageNotProvided: 'Error [errorMessage] no message provided.',
    valueNotProvided: 'Error [errorMessage] no value provided or malformed.',
    anyError: 'Error without any description or information.',

    errorMarkers: 'Error [errorMessage] no message provided.',
    valueStaticNotProvided: 'Error [errorMessage] no static value provided or malformed.',
    messageObjectEmpty: 'Error [errorMessage] message  must be an object and cannot be empty.',
    stringStaticStringEmpty: 'Error [errorMessage] message static must be an string and cannot be empty.',
    stringMessageStringEmpty: 'Error [errorMessage] stringMessage must be an string and cannot be empty.',
    messageStringEmpty: 'Error [errorMessage] message must be an string and cannot be empty.',
    stringMessageNotProvided: 'Error [errorMessage] no stringMessage provided.',
  },
}


// displayInternalError
export const displayInternalError = errorcode => ({
  error: true,
  message: defaultMessage(`internalErrorsMessage.${errorcode}`),
})

// defaultMessage
export const defaultMessage = (path) => _getMessage(path)

// hasErrorMessage
export const hasErrorMessage = x => def(x) ? x.indexOf("errorMessage") > -1 : true;

// safePath
const safePath = path => def(path) && isString(path) && !isEmptyString(path)




// ......................................
//// getMessage
// ......................................


export const _getMessage = (path) => {

  const message = safePath(path) ? getDotNotation(_errorsMessage, path) : false;
  return def(message) ? message : defaultMessage("internalErrorsMessage.errorGetMessage")
}





// ......................................
//// messageString ( check if exist stringStatic )
// ......................................


const messageString = message => message &&
  typeof message === 'string' && message.length >= 1
  ? message
  : ''



// ......................................
//// parseMessages
// ......................................


export const parseMessages = (message) => {

  // check if exist stringStatic
  const _stringStatic = message ? messageString(message.stringStatic) : ''
  const _stringMessage = message ? messageString(message.stringMessage) : ''

  const stringStatic = _stringStatic === ''
    ? '_&.string.empty'
    : _stringStatic

  const stringMessage = _stringMessage === ''
    ? defaultMessage(`internalErrorsMessage.messageNotProvided`)
    : _stringMessage

  return { stringStatic, stringMessage }

}



