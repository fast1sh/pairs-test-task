let path = require('path'); //default NodeJs module

let conf = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './js'),
    filename: 'app.js',
    publicPath: 'js/'
  },
  devServer: {
    overlay: true //fullscreen errors
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // exclude: '/node_modules/'
      }
    ]
  }
};

module.exports = (env, options) => {
  conf.devtool = options.mode === "production" ?
    false :
    "cheap-module-eval-source-map"; //source map

  return conf;
};