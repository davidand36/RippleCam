const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
// const FaviconsWebpackPlugin = require( 'favicons-webpack-plugin' )

module.exports = {
  entry: './src/index.ts',
  plugins: [
    new HtmlPlugin({
      title: 'Ripple Cam',
      template: 'src/index.html',
    }),
    // new FaviconsWebpackPlugin('assets/favicon/logo.svg'),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      exclude: [ /\.mp4$/ ],
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif|opus|ogg|mp3|ogv|mp4|webm|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
