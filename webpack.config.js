const path = require('path');

const slsw = require('serverless-webpack');

// This helper function is not strictly necessary.
function srcPath(subdir) {
  return path.join(__dirname, subdir);
}

module.exports = {
  // devtool: "cheap-module-eval-source-map",
  entry: slsw.lib.entries,
  externals: ['ws', 'mongoose', 'encoding'],
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx', '.graphql', '.gql'],
    alias: {
      'node-fetch$': 'node-fetch/lib/index.js',
      '@common': srcPath('src/common'),
      '@config': srcPath('config'),
    },
    enforceExtension: false,
  },
  output: {
    libraryTarget: 'commonjs',
    path: srcPath('.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      { test: /\.ts(x?)$/, loader: 'ts-loader' },
      { test: /\.graphql|gql?$/, loader: 'webpack-graphql-loader' },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: { root: srcPath('src/constants/email-templates') },
      },
      {
        type: 'javascript/auto', // required for the apollo-graphql
        test: /\.mjs$/,
        use: [],
      },
    ],
  },
};
