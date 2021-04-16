module.exports = {
  defaultNamespace: 'parserDefaultNs',
  defaultValue: '',
  indentation: 2,
  lexers: {
    js: ['JsxLexer'],
    ts: ['JavascriptLexer'],
    tsx: ['JsxLexer'],
    default: ['JavascriptLexer'],
  },

  locales: ['en', 'de'],
  namespaceSeparator: ':',

  output: 'locales/$LOCALE/$NAMESPACE.json',
  sort: false,
  skipDefaultValues: false,
  useKeysAsDefaultValue: false,
  verbose: false,
  failOnWarnings: false,
  customValueTemplate: null,
  keySeparator: '.',
};
