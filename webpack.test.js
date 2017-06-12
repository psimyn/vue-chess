const nodeExternals = require('webpack-node-externals')

module.exports = {
  devtool: 'inline-cheap-module-source-map',
  target: 'node',
  externals: [nodeExternals()],
  module: {loaders: [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },
    {
      test: /\.json/,
      loader: 'json-loader'
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      query: {
        name: '[name].[ext]?[hash]'
      }
    }
  ]}
}
