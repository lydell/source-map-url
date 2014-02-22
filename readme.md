[![Build Status](https://travis-ci.org/lydell/source-mapping-url.png?branch=master)](https://travis-ci.org/lydell/source-mapping-url)
[![browser support](https://ci.testling.com/lydell/source-mapping-url.png)](https://ci.testling.com/lydell/source-mapping-url)

Overview
========

Tools for working with sourceMappingURL comments.

```js
var sourceMappingURL = require("source-mapping-url")

var code = [
  "!function(){...}();",
  "/*# sourceMappingURL=foo.js.map */"
].join("\n")

sourceMappingURL.get(code)
// foo.js.map

code = sourceMappingURL.set(code, "/other/file.js.map")
// !function(){...}();
// /*# sourceMappingURL=/other/file.js.map */

code = sourceMappingURL.insertBefore(code, "\n// License: MIT")
// !function(){...}();
// // License: MIT
// /*# sourceMappingURL=/other/file.js.map */

code = sourceMappingURL.remove(code)
// !function(){...}();
// // License: MIT

sourceMappingURL.get(code)
// null
```


Installation
============

- `npm install source-mapping-url`
- `bower install source-mapping-url`
- `component install lydell/source-mapping-url`

Works with CommonJS, AMD and browser globals, through UMD.


Usage
=====

### `sourceMappingURL.get(code)` ###

Returns the url of the sourceMappingURL comment in `code`. Returns `null` if
there is no such comment. Note that the url can be the empty string and that
both the empty string and `null` are falsy. Consider using `if (url === null)
{}` rather than `if (url) {}` if you need to tell those two cases apart.

### `sourceMappingURL.set(code, url [, commentSyntax])` ###

Updates the sourceMappingURL comment in `code` to use `url`. Creates such a
comment if there is none. Returns the updated `code`.

The `commentSyntax` argument is optional. It is an array. The first element of
it defines how a comment starts, while the second element defines how it ends.
The default value is `["/*", "*/"]`. `/**/` comments were chosen as default in
favor of `//` comments, because ideally they work with both JavaScript and CSS.
This way, you don’t have to think about what type of code you’re working with.
However, Chrome sadly does not support `/**/` comments in JavaScript. So
currently, you need to use `.set(code, url, ["//"])` for JavaScript that needs
source map support in Chrome. A [bug] has been filed about this.

[bug]: http://code.google.com/p/chromium/issues/detail?id=341807

### `sourceMappingURL.remove(code)` ###

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

### `sourceMappingURL.SourceMappingURL(commentSyntax)` ###

Lets you create a new SourceMappingURL instance, using `commentSyntax` as
default comment syntax for the `set` method.

For example, if you mainly work with JavaScript code that needs to have source
map support in Chrome, you could use it like this:

```js
var SourceMappingURL = require("source-mapping-url").SourceMappingURL
var sourceMappingURL = new SourceMappingURL(["//"])
```


License
=======

[The X11 (“MIT”) License](LICENSE).
