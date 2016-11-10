var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    './example.js'
  ],
  output: {
    path: 'dist',
    filename: 'bundle.js',
    publicPath: 'dist'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.(js)$/,
        loader: 'babel' ,
        // query: {
        //   presets: ["es2015"]
        // },
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  vue: {
    loaders: {
      js: 'babel'
    }
  },
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime']
  },
  postcss: function () {
    return [];
  }

};