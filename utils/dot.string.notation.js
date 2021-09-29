

// https://github.com/rhalff/dot-object/blob/master/src/dot-object.js



// ......................................
////  pickOff  helpers
// ......................................


const blacklist = ['__proto__', 'prototype', 'constructor']
const blacklistFilter = (part) => blacklist.indexOf(part) === -1


export const parseKey = (key, val) => {
  // detect negative index notation
  if (key[0] === '-' && Array.isArray(val) && /^-\d+$/.test(key)) {
    return val.length + parseInt(key, 10)
  }
  return key
}



// ......................................
////  parsePath
// ......................................

export const parsePath = (path, sep) => {

  if (path.indexOf('[') >= 0) {
    path = path.replace(/\[/g, sep).replace(/]/g, '')
  }
  var parts = path.split(sep)

  var check = parts.filter(blacklistFilter)

  if (check.length !== parts.length) {
    throw Error('Refusing to update blacklisted property ' + path)
  }
  return parts
}



// ......................................
////  pickOff
// ......................................


export const pickOff = (obj, path, remove, reindexArray) => {
  let i
  let keys
  let val
  let key
  let cp
  let cleanup = []

  keys = parsePath(path, '.')

  for (i = 0; i < keys.length; i++) {

    key = parseKey(keys[i], obj)

    if (obj && typeof obj === 'object' && key in obj) {
      if (i === keys.length - 1) {
        if (remove) {
          val = obj[key]
          if (reindexArray && Array.isArray(obj)) {
            obj.splice(key, 1)
          } else {
            delete obj[key]
          }
          if (Array.isArray(obj)) {
            cp = keys.slice(0, -1).join('.')
            if (cleanup.indexOf(cp) === -1) {
              cleanup.push(cp)
            }
          }
          return val
        } else {
          return obj[key]
        }
      } else {
        obj = obj[key]
      }
    } else {
      return undefined
    }
  }
  if (remove && Array.isArray(obj)) {
    obj = obj.filter(function (n) {
      return n !== undefined
    })
  }
  return obj
}



// ......................................
////  dotString  helpers
// ......................................

const isIndex = (k) => {
  return /^\d+$/.test(k)
}
const isEmptyObject = (val) => {
  return Object.keys(val).length === 0
}
const isEmptyArray = (val) => {
  return (val).length <= 0
}
const isObject = (val) => {
  return Object.prototype.toString.call(val) === '[object Object]'
}
const isArrayOrObject = (val) => {
  return Object(val) === val
}


// ......................................
////  dotString  ()
// ......................................


const dotString = (obj, tgt, path, keepArray = false) => {
  const separator = '.'
  const override = false
  const useArray = true
  const useBrackets = true
  const keepArr = keepArray

  tgt = tgt || {}
  path = path || []
  var isArray = Array.isArray(obj)

  Object.keys(obj).forEach(
    function (key) {
      var index = isArray && useBrackets ? '[' + key + ']' : key
      if (
        isArrayOrObject(obj[key]) &&
        ((isObject(obj[key]) && !isEmptyObject(obj[key])) ||
          (Array.isArray(obj[key]) && !keepArr && obj[key].length !== 0))
      ) {
        if (isArray && useBrackets) {
          var previousKey = path[path.length - 1] || ''
          return dotString(
            obj[key],
            tgt,
            path.slice(0, -1).concat(previousKey + index),
            keepArr
          )
        } else {
          return dotString(obj[key], tgt, path.concat(index), keepArr)
        }
      } else {
        if (isArray && useBrackets) {
          tgt[path.join(separator).concat('[' + key + ']')] = obj[key]
        } else {
          tgt[path.concat(index).join(separator)] = obj[key]
        }
      }
    }//.bind(this)
  )
  return tgt
}


// ......................................
////  _process  ()
// ......................................


const _process = (v, mod) => {
  var i
  var r

  if (typeof mod === 'function') {
    r = mod(v)
    if (r !== undefined) {
      v = r
    }
  } else if (Array.isArray(mod)) {
    for (i = 0; i < mod.length; i++) {
      r = mod[i](v)
      if (r !== undefined) {
        v = r
      }
    }
  }
  return v
}


// ......................................
////  _fill  ()
// ......................................


const _fill = (a, obj, v, mod) => {
  const useArray = true
  const override = false
  var k = a.shift()

  if (a.length > 0) {
    obj[k] = obj[k] || (useArray && isIndex(a[0]) ? [] : {})

    if (!isArrayOrObject(obj[k])) {
      if (override) {
        obj[k] = {}
      } else {
        if (!(isArrayOrObject(v) && isEmptyObject(v))) {
          throw new Error(
            'Trying to redefine `' + k + '` which is a ' + typeof obj[k]
          )
        }

        return
      }
    }

    _fill(a, obj[k], v, mod)
  } else {
    if (!override && isArrayOrObject(obj[k]) && !isEmptyObject(obj[k])) {
      if (!(isArrayOrObject(v) && isEmptyObject(v))) {
        throw new Error("Trying to redefine non-empty obj['" + k + "']")
      }

      return
    }

    obj[k] = _process(v, mod)
  }
}



// ......................................
////  str  (convert manually per string )
// ......................................

/**
 * @param {String} path dotted path
 * @param {String} v value to be set
 * @param {Object} obj object to be modified
 * @param {Function|Array} mod optional modifier
 */
export const dotNotationObject = (path, v, obj, mod) => {
  obj = obj ? obj : {}
  const separator = '.'
  var ok = parsePath(path, separator).join(separator)

  if (path.indexOf(separator) !== -1) {
    _fill(ok.split(separator), obj, v, mod)
  } else {
    obj[path] = _process(v, mod)
  }

  return obj
}


// ......................................
////  dotNotation  ()
// ......................................

export const dotNotation = (obj, keepArray, target, path) => {
  return dotString(obj, target, path, keepArray)
}


// ......................................
////  getDotNotation  ()
// ......................................

export const getDotNotation = (object, path, separator) => {
  return pickOff(object, path, false, false)
}

