import { removeDuplicates, takeBetweenBraces } from "./utils/helper.js"




// ......................................
////  getTextmarkers
// ......................................

const textmarkers = (str, charStart, charEnd) => {

  const markers = takeBetweenBraces(str, charStart, charEnd)
  return markers !== null
    ? markers.map(m => `${charStart}${m}${charEnd}`)
    : []
}


// ......................................
////  getTextmarkers
// ......................................


export const getTextmarkers = (str, { interpolate }) => {
  const { charStart, charEnd } = interpolate
  const markers = textmarkers(str, charStart, charEnd)
  return markers.length >= 1
    ? removeDuplicates(markers)
    : markers
}


export const _getMarkers = (str, charStart, charEnd) => textmarkers(str, charStart, charEnd)
