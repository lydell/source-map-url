// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

const innerRegex = /[#@] sourceMappingURL=([^\s'"]*)/

const regex = RegExp(
  '(?:' +
    '/\\*' +
    '(?:\\s*\r?\n(?://)?)?' +
    '(?:' + innerRegex.source + ')' +
    '\\s*' +
    '\\*/' +
    '|' +
    '//(?:' + innerRegex.source + ')' +
  ')' +
  '\\s*'
)

export default {
  regex,
  _innerRegex: innerRegex,

  /** @param {string} code */
  getFrom (code) {
    const match = code.match(regex)
    return (match ? match[1] || match[2] || '' : null)
  },

  /** @param {string} code */
  existsIn (code) {
    return regex.test(code)
  },

  /** @param {string} code */
  removeFrom (code) {
    return code.replace(regex, '')
  },

  /**
   * @param {string} code
   * @param {string} string
   */
  insertBefore (code, string) {
    const match = code.match(regex)
    if (match) {
      return code.slice(0, match.index) + string + code.slice(match.index)
    } else {
      return code + string
    }
  }
}
