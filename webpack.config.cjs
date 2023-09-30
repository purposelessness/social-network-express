const path = require('path');
const nodeExternals = require('webpack-node-externals');
const PugPlugin = require('pug-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
  entry: {
    index: './src-front/views/index.pug',
  },
  output: {
    path: path.resolve(__dirname, process.env.DIRNAME),
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src-front/scripts'),
      styles: path.resolve(__dirname, 'src-front/stylesheets'),
    },
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
      },
      {
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'sass-loader'],
      },
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new PugPlugin({
      js: {
        filename: 'scripts/[name].[contenthash:8].js',
      },
      css: {
        filename: 'styles/[name].[contenthash:8].css',
      },
    }),
  ],
  // Exclude node_modules from the bundle
  externals: [nodeExternals()],
};