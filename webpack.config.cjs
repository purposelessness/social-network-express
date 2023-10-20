const path = require('path');

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

function resolveFilename(fileData) {
  switch (fileData.contentHashType) {
    case 'javascript':
      return `${fileData.runtime}.js`;
    default:
      return `${fileData.runtime}`;
  }
}

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
  entry: {
    '/scripts/index': './src-front/scripts/index.ts',
    '/scripts/user/index': './src-front/scripts/user/index.ts',
  },
  output: {
    path: path.resolve(__dirname, process.env.DIRNAME),
    filename: (fileData) => resolveFilename(fileData),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {extensions: ['.ts', '.tsx', '.js']},
};

// const PugPlugin = require('pug-plugin');
//
// module.exports = {
//   mode: process.env.NODE_ENV,
//   devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
//   entry: {
//     index: './src-front/views/index.pug', error: './src-front/views/error.pug',
//   },
//   output: {
//     path: path.resolve(__dirname, process.env.DIRNAME),
//   },
//   resolve: {
//     alias: {
//       scripts: path.resolve(__dirname, 'src-front/scripts'),
//       styles: path.resolve(__dirname, 'src-front/styles'),
//     },
//   },
//   module: {
//     rules: [
//       {
//         test: /\.pug$/, loader: PugPlugin.loader,
//       }, {
//         test: /\.(css|sass|scss)$/, use: ['css-loader', 'sass-loader'],
//       }, {
//         test: /\.tsx?$/,
//         use: ['babel-loader', 'ts-loader'],
//         exclude: /node_modules/,
//       }],
//   },
//   plugins: [
//     new PugPlugin({
//       js: {
//         filename: (pathData) => createFilename(pathData, '.js'),
//       },
//       css: {
//         filename: (pathData) => createFilename(pathData, '.css'),
//       },
//     })],
// };
//
// function createFilename(pathData, ext) {
//   const pathArray = path.relative(path.join(__dirname, 'src-front'),
//       pathData.filename).split('.');
//   pathArray.pop();
//   console.log(pathArray.join('.'));
//   return pathArray.join('.') + ext;
// }