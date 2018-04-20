/**
 * Created by dd on 01/04/17.
 */
const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin(
  {
    template: './src/index.html',
    chunks: ['default', 'shared'],
    filename: 'index.html',
    inject: 'body',
  },
);

const HtmlWebpackPluginConfigAccount = new HtmlWebpackPlugin(
  {
    template: './src/index.html',
    chunks: ['account', 'shared'],
    filename: 'account.html',
    inject: 'body',
  },
);

const NODE_ENV = process.env.NODE_ENV || JSON.stringify('development');
const VERSION = JSON.stringify('0.0.1');

module.exports = {
  devtool: 'eval-source-map',
  devServer: {
    proxy: { // proxy URLs to backend development server
      // '/api': 'http://localhost:9000'
      '/api': {
        target: 'http://localhost:9000',
        pathRewrite: {'^/api': ''},
      },
    },
    compress: false,
    noInfo: true,
    hot: false,
    inline: false,
    port: 3003,
    host: 'localhost' ,
    contentBase: path.join(__dirname, 'public'),
    // for hot reload
    watchOptions: {
      watch: false,
      // aggregateTimeout: 30000, // def 300
      // poll: 30000 // Check for changes every second
    },
    historyApiFallback: {
      disableDotRule: true // important for path containing 'dots'
    },
  },
  entry: {
    default: ['whatwg-fetch', './src/index'],
    account: './src/indexAccount',
  },
  output: {
    // filename: 'bundle.js',
    filename: 'bundle.[name].[hash].js',
    // The output directory as an absolute path.
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  // default
  target: 'web',
  module: {
    rules: [
      // {
      //   test: /\.html$/,
      //   loader: "html-loader"
      // },
      {test: /\.json$/, loader: 'json-loader'},
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(graphql|gql\.js)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.(css|scss})$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      /**
       * ne copie pas les fichiers mais cree un path
       */
      // {
      //   test: /\.(png|jpg|gif|ico)$/,
      //   exclude: ['/node_modules/'],
      //   loader: "file-loader",
      //   include: path.join(__dirname, 'src/assets')
      // },
      // "file" loader for svg
      {
        test: /\.(png|jpg|gif|ico|svg)$/,
        exclude: ['/node_modules/'],
        include: path.join(__dirname, 'src/assets'),
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[hash:4].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'shared',
      chunks: ['default', 'account'],
    }),
    HtmlWebpackPluginConfig,
    HtmlWebpackPluginConfigAccount,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': NODE_ENV,
      VERSION: VERSION,
    }),
    // load dynamiqcally
    new webpack.ProvidePlugin({
      'React': 'react',
    }),
    new Dotenv({
      path: NODE_ENV !== 'production' ? './node_dev.env' : './node_prod.env',
      safe: false, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: false // hide any errors
    }),
  ],
};
