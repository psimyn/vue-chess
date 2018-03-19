module.exports = {
  'globDirectory': './dist/static',
  'globPatterns': [
    '**/*.{js,svg,png,html}'
  ],
  'swDest': 'dist/sw.js',
  'globIgnores': [
    'workbox-cli-config.js',
    'node_modules/**/*',
    'src/**/*',
    'webpack.*'
  ]
}
