// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

import expect from 'expect.js'
import sourceMappingURL from '../source-map-url.js'

const comments = {

  universal: [
    '/*# sourceMappingURL=foo.js.map */'
  ],

  js: [
    '//# sourceMappingURL=foo.js.map'
  ],

  block: [
    '/*',
    '# sourceMappingURL=foo.js.map',
    '*/'
  ],

  mix: [
    '/*',
    '//# sourceMappingURL=foo.js.map',
    '*/'
  ]

}

const nonTrailingComments = {

  jsLeading: {
    contents: [
      '//# sourceMappingURL=foo.js.map',
      '(function(){})'
    ],
    solution: [
      '(function(){})'
    ]
  },

  mixEmbedded: {
    contents: [
      '/*! Library Name v1.0.0',
      '//# sourceMappingURL=foo.js.map',
      '*/',
      '(function(){})'
    ],
    solution: [
      '/*! Library Name v1.0.0',
      '*/',
      '(function(){})'
    ]
  }

}

function forEachComment (fn) {
  forOf(comments, (name, comment) => {
    const description = `the '${name}' syntax with `
    fn(comment.join('\n'), `${description}regular newlines`)
    fn(comment.join('\r\n'), `${description}Windows newlines`)
  })
}

function forEachNonTrailingComment (fn) {
  forOf(nonTrailingComments, (name, comment) => {
    const description = `the '${name}' syntax with `

    fn({
      contents: comment.contents.join('\n'),
      solution: comment.solution.join('\n')
    }, `${description}regular newlines`)

    fn({
      contents: comment.contents.join('\r\n'),
      solution: comment.solution.join('\r\n')
    }, `${description}Windows newlines`)
  })
}

function forOf (obj, fn) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      fn(key, obj[key])
    }
  }
}

describe('sourceMappingURL', () => {
  describe('.getFrom', () => {
    forEachComment((comment, description) => {
      it(`gets the url from ${description}`, () => {
        expect(sourceMappingURL.getFrom(`code\n${comment}`))
          .to.equal('foo.js.map')

        expect(sourceMappingURL.getFrom(`code${comment}`))
          .to.equal('foo.js.map')

        expect(sourceMappingURL.getFrom(comment))
          .to.equal('foo.js.map')
      })
    })

    forEachNonTrailingComment((comment, description) => {
      it(`gets the url from ${description}`, () => {
        expect(sourceMappingURL.getFrom(`code\n${comment.contents}`))
          .to.equal('foo.js.map')

        expect(sourceMappingURL.getFrom(`code${comment.contents}`))
          .to.equal('foo.js.map')

        expect(sourceMappingURL.getFrom(comment.contents))
          .to.equal('foo.js.map')
      })
    })

    it('returns null if no comment', () => {
      expect(sourceMappingURL.getFrom('code'))
        .to.equal(null)
    })

    it('can return an empty string as url', () => {
      expect(sourceMappingURL.getFrom('/*# sourceMappingURL= */'))
        .to.equal('')
    })

    it('is detachable', () => {
      const get = sourceMappingURL.getFrom
      expect(get('/*# sourceMappingURL=foo */'))
        .to.equal('foo')
    })
  })

  describe('.existsIn', () => {
    forEachComment((comment, description) => {
      it(`returns true for ${description}`, () => {
        expect(sourceMappingURL.existsIn(`code\n${comment}`))
          .to.equal(true)

        expect(sourceMappingURL.existsIn(`code${comment}`))
          .to.equal(true)

        expect(sourceMappingURL.existsIn(comment))
          .to.equal(true)
      })
    })

    forEachNonTrailingComment((comment, description) => {
      it(`returns true for ${description}`, () => {
        expect(sourceMappingURL.existsIn(`code\n${comment.contents}`))
          .to.equal(true)

        expect(sourceMappingURL.existsIn(`code${comment.contents}`))
          .to.equal(true)

        expect(sourceMappingURL.existsIn(comment.contents))
          .to.equal(true)
      })
    })

    it('returns false if no comment', () => {
      expect(sourceMappingURL.existsIn('code'))
        .to.equal(false)
    })

    it('is detachable', () => {
      const has = sourceMappingURL.existsIn
      expect(has('/*# sourceMappingURL=foo */'))
        .to.equal(true)
    })
  })

  describe('.removeFrom', () => {
    forEachComment((comment, description) => {
      it(`removes the comment for ${description}`, () => {
        expect(sourceMappingURL.removeFrom(`code\n${comment}`))
          .to.equal('code\n')

        expect(sourceMappingURL.removeFrom(`code${comment}`))
          .to.equal('code')

        expect(sourceMappingURL.removeFrom(comment))
          .to.equal('')
      })
    })

    forEachNonTrailingComment((comment, description) => {
      it(`removes the comment for ${description}`, () => {
        expect(sourceMappingURL.removeFrom(`code\n${comment.contents}`))
          .to.equal(`code\n${comment.solution}`)

        expect(sourceMappingURL.removeFrom(`code${comment.contents}`))
          .to.equal(`code${comment.solution}`)

        expect(sourceMappingURL.removeFrom(comment.contents))
          .to.equal(comment.solution)
      })
    })

    it('does nothing if no comment', () => {
      expect(sourceMappingURL.removeFrom('code\n'))
        .to.equal('code\n')
    })

    it('is detachable', () => {
      const remove = sourceMappingURL.removeFrom
      expect(remove('/*# sourceMappingURL=foo */'))
        .to.equal('')
    })
  })

  describe('.insertBefore', () => {
    forEachComment((comment, description) => {
      it(`inserts a string before the comment for ${description}`, () => {
        expect(sourceMappingURL.insertBefore(`code\n${comment}`, 'more code\n'))
          .to.equal(`code\nmore code\n${comment}`)

        expect(sourceMappingURL.insertBefore(`code${comment}`, '\nmore code'))
          .to.equal(`code\nmore code${comment}`)

        expect(sourceMappingURL.insertBefore(comment, 'some code'))
          .to.equal(`some code${comment}`)
      })
    })

    it('inserts a string before an embedded comment', () => {
      expect(sourceMappingURL.insertBefore('/*! Library Name v1.0.0\n' +
        '//# sourceMappingURL=foo.js.map\n*/\n(function(){})', 'code\n'))
        .to.equal('/*! Library Name v1.0.0\ncode\n' +
          '//# sourceMappingURL=foo.js.map\n*/\n(function(){})')
    })

    it('inserts a string before a leading comment', () => {
      expect(sourceMappingURL.insertBefore('//# sourceMappingURL=foo.js.map\n' +
        '(function(){})', 'code\n'))
        .to.equal('code\n//# sourceMappingURL=foo.js.map\n' +
          '(function(){})')
    })

    it('appends if no comment', () => {
      expect(sourceMappingURL.insertBefore('code', '\nmore code'))
        .to.equal('code\nmore code')
    })

    it('is detachable', () => {
      const insertBefore = sourceMappingURL.insertBefore
      expect(insertBefore('/*# sourceMappingURL=foo */', 'bar'))
        .to.equal('bar/*# sourceMappingURL=foo */')
    })
  })

  describe('.regex', () => {
    it('includes ._innerRegex', () => {
      expect(sourceMappingURL.regex.source)
        .to.contain(sourceMappingURL._innerRegex.source)
    })

    const match = code => {
      expect(code)
        .to.match(sourceMappingURL.regex)
    }

    const noMatch = code => {
      expect(code)
        .not.to.match(sourceMappingURL.regex)
    }

    forEachComment((comment, description) => {
      it(`matches ${description}`, () => {
        match(`code\n${comment}`)
        match(`code${comment}`)
        match(comment)
      })

      it(`matches ${description}, with trailing whitespace`, () => {
        match(`${comment}  `)
        match(`${comment}\n`)
        match(`${comment}\n\n\t\n    \t  `)
      })
    })

    it('does not match some cases that are easy to mess up', () => {
      noMatch(
        '/* # sourceMappingURL=foo */'
      )

      noMatch(
        '// # sourceMappingURL=foo'
      )
    })

    it('is liberal regarding inner whitespace', () => {
      match(
        '/*# sourceMappingURL=foo*/'
      )

      match(
        '/*# sourceMappingURL=foo    */'
      )

      match(
        '/*# sourceMappingURL=foo   \t\n' +
        '*/'
      )

      match(
        '/*    \n' +
        '# sourceMappingURL=foo\n' +
        '*/'
      )

      match(
        '/*\n' +
        '# sourceMappingURL=foo\n' +
        '     */'
      )

      match(
        '/*\n' +
        '# sourceMappingURL=foo\n' +
        '\n' +
        '\t\n' +
        '*/'
      )
    })
  })

  describe('._innerRegex', () => {
    it('matches the contents of sourceMappingURL comments', () => {
      expect('# sourceMappingURL=http://www.example.com/foo/bar.js.map')
        .to.match(sourceMappingURL._innerRegex)
    })

    it('captures the url in the first capture group', () => {
      expect(sourceMappingURL._innerRegex.exec('# sourceMappingURL=foo')[1])
        .to.equal('foo')
    })

    it('supports the legacy syntax', () => {
      expect('@ sourceMappingURL=http://www.example.com/foo/bar.js.map')
        .to.match(sourceMappingURL._innerRegex)
    })
  })
})
