import { isEmptyObject, isObject, log, propKeys } from "../eValidate/util/helpYou/helpers.js"


// ......................................
////  optsDefault
// ......................................

/*
  finalCharacter:  the last character of the string ( default '.' )
  objectJason:  if true, the value will be converted to Json ( default false )
  interpolate: characters that mark where to replace in the string ( default '{{}}' )
  staticMark:  'start' | 'end' | 'mark' //  case 'mark' stringStatic ex: '...{{$}}...  ( defaul 'start' )
  depth:  depth of displayed properties , lowest accepted value 2 ( default 3 )
  refmarkers:  options that change the behavior of values (default false )
      props: (default false ),
      char: String  characters that indicate change in substitutions behavior
      is: function ( function that returns the value for replacement ) ||
          string  ( if the character is equal to char I take the value of then if I don't take the value of otherwise )
      then: any case value is equal to true,
      otherwise: any  value case is equal to false

*/

export const optsDefault = {
  finalCharacter: '.',
  objectJason: false,
  interpolate: '{{}}',
  staticMark: 'start',
  depth: 3,
  refmarkers: false,
}

// ......................................
////  helpers
// ......................................


const conditionalProps = ['props', 'char', 'is', 'then', 'otherwise']
const hasPropsConditional = x => conditionalProps.every(e => Object.keys(x.refmarkers).includes(e))

const interpolatesDefault = ({ charStart: '{{', charEnd: '}}' })
const isEvenInterpolates = x => x >= 2 && x % 2 == 0



const depth = options => options.depth < 2
  ? 2
  : options.depth ? options.depth : optsDefault.depth


// .......................... ............
//// charAt
// ......................................


const charAt = (length, x) => {
  const half = length / 2
  const charStart = x.substring(0, half)
  const charEnd = x.substring(half, length)
  return { charStart, charEnd }
}


// .......................... ............
//// parseInterpolate ( replaces custom interpolates by default)
// ......................................


export const parseInterpolate = (options) => {

  const { interpolate } = options

  const length = typeof interpolate === 'string' ? interpolate.length : 1

  const { charStart, charEnd } = isEvenInterpolates(length)
    ? charAt(length, interpolate.trim())
    : interpolatesDefault

  return { charStart, charEnd }


}



// ......................................
////  safeRefmarkers ( ensures integrity of options.refmarkers )
// ......................................


export const safeRefmarkers = (options) => {

  return 'refmarkers' in options &&
    isObject(options.refmarkers) &&
    !isEmptyObject(options.refmarkers) &&
    hasPropsConditional(options)
    ? options.refmarkers
    : optsDefault.refmarkers
}


// ......................................
////  safeOptions
// ......................................


export const safeOptions = (options) => options && isObject(options) && !isEmptyObject(options)
  ? {
    ...optsDefault, ...options,
    interpolate: parseInterpolate(options),
    depth: depth(options),
    refmarkers: safeRefmarkers(options)
  }
  : optsDefault


