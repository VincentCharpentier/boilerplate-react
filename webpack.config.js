const config = require('./config');
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');

const extractCSS = new ExtractTextPlugin({
  /*
  allChunks:
   - true: will generate one css bundle with all customers css code
   - false: will generate only css for the main bundle. Customer CSS will be bundled with JS
   */
  /* TODO: find how to generate and lazy-load one file per chunk
        => Webpack 4 should allow this kind of behavior natively
   */
  allChunks: true,
  ignoreOrder: true,
  filename: config.css.fileName,
});

const definePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
});

const reactLoadable = new ReactLoadablePlugin({
  filename: './dist/react-loadable.json',
});

const compressionPlugin = new CompressionPlugin({
  asset: '[path].gz[query]',
  algorithm: 'gzip',
  test: /\.js$|\.css$|\.html$/,
  threshold: 10240,
  minRatio: 0.8,
});

module.exports = {
  entry: {
    main: './client/client.js',
  },
  output: {
    path: config.buildDirectory,
    filename: '[name].bundle.js',
    publicPath: '/',
    chunkFilename: '[id].chunk.js',
  },
  devtool: process.env.NODE_ENV === 'local' ? 'source-map' : false,
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.json'],
    alias: {
      '~': path.resolve(__dirname, 'shared'),
    },
  },
  module: {
    rules: [
      // SCRIPTS
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: true,
          },
        },
      },
      // STYLES
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: extractCSS.extract({
          fallback: 'style-loader', // creates style nodes from JS strings,
          use: [
            {
              loader: 'css-loader', // translates CSS into CommonJS
              options: {
                sourceMap: true,
                minimize: true,
                modules: true, // enable CSS Modules
                import: true, // @import handing
                url: false, // url() handling
                localIdentName: config.css.classNameFormat,
                // importLoaders allows to configure how many loaders before css-loader should be applied to @imported resources.
                // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader', // Run various tasks on CSS (depends on plugins)
              options: {
                ident: 'postcss', // required
                sourceMap: true,
                plugins: (loader) => [
                  require('postcss-cssnext')(), // latest CSS syntax available
                ],
              },
            },
          ],
        }),
      },
    ],
  },
  plugins: [definePlugin, reactLoadable, compressionPlugin, extractCSS],
};
