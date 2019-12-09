const webpack = require('webpack');

let config = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|mp3)$/,
        use: [
          'file-loader'
        ]
      },
      { test: /\.css$/, use: [ 'css-loader' ] },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
}

let accounts = Object.assign({}, config, {
  name: 'accounts',
  entry: ['./react/accounts/accounts.js'],
  output: {
    path: __dirname + '/build/accounts',
    filename: 'accounts.js'
  }
});

let app = Object.assign({}, config, {
  name: 'app',
  entry: ['./react/app/app.js'],
  output: {
    path: __dirname + '/build/app',
    filename: 'app.js'
  }
});

module.exports = [
  accounts,
  app
];
