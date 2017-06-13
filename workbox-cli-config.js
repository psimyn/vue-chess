module.exports = {
  'globDirectory': './',
  'globPatterns': [
    '**/*.{js,svg,png,html}'
  ],
  'swDest': 'sw.js',
  'globIgnores': [
    'workbox-cli-config.js',
    'node_modules/**/*',
    'src/**/*',
    'webpack.*'
  ]
}
