Overview [![Build Status](https://travis-ci.org/lydell/source-map-url.png?branch=master)](https://travis-ci.org/lydell/source-map-url)
========

[![browser support](https://ci.testling.com/lydell/source-map-url.png)](https://ci.testling.com/lydell/source-map-url)

Tools for working with sourceMappingURL comments.

```js
var sourceMappingURL = require("source-map-url")

var code = [
  "!function(){...}();",
  "/*# sourceMappingURL=foo.js.map */"
].join("\n")

sourceMappingURL.getFrom(code)
// foo.js.map

code = sourceMappingURL.insertBefore(code, "// License: MIT\n")
// !function(){...}();
// // License: MIT
// /*# sourceMappingURL=foo.js.map */

code = sourceMappingURL.removeFrom(code)
// !function(){...}();
// // License: MIT

sourceMappingURL.getFrom(code)
// null

code += "//# sourceMappingURL=/other/file.js.map"
// !function(){...}();
// // License: MIT
// //# sourceMappingURL=/other/file.js.map
```


Installation
============

- `npm install source-map-url`
- `bower install source-map-url`
- `component install lydell/source-map-url`

Works with CommonJS, AMD and browser globals, through UMD.


Usage
=====

### `sourceMappingURL.getFrom(code)` ###

Returns the url of the sourceMappingURL comment in `code`. Returns `null` if
there is no such comment. Note that the url can be the empty string and that
both the empty string and `null` are falsy. Consider using `if (url === null)
{}` rather than `if (url) {}` if you need to tell those two cases apart.

### `sourceMappingURL.removeFrom(code)` ###

Removes the sourceMappingURL comment in `code`. Does nothing if there is no
such comment. Returns the updated `code`.

### `sourceMappingURL.insertBefore(code, string)` ###

Inserts `string` before the sourceMappingURL comment in `code`. Appends
`string` to `code` if there is no such comment.

Lets you append something to a file without worrying about breaking the
sourceMappingURL comment (which needs to be at the end of the file).

### `sourceMappingURL.regex` ###

The regex that is used to match sourceMappingURL comments. It matches both `//`
and `/**/` comments, thus supporting both JavaScript and CSS.


Tests
=====

Start by running `npm test`, which lints the code and runs the test suite in Node.js.

To run the tests in a browser, run `testling` (`npm install -g testling`) or `testling -u`.


License
=======

[The X11 (“MIT”) License](LICENSE).
