const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  mode: process.env.NODE_ENV,
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
  entry: './src/server.ts',
  output: {
    filename: 'server.js', path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      src: path.resolve(__dirname, 'src'),
    }
  },
  module: {
    rules: [
      {test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/},
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }],
  },
  // Exclude node_modules from the bundle
  externals: [nodeExternals()],
};