const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const FaviconsPlugin = require( 'favicons-webpack-plugin' )

module.exports = {
  entry: './src/index.ts',
  plugins: [
    new HtmlPlugin({
      title: 'Ripple Cam',
      template: 'src/index.html',
    }),
    new FaviconsPlugin({
      logo: 'assets/logo.svg',
      prefix: 'assets/',
      favicons: {
        appName: 'Ripple Cam',
        appShortName: 'RippleCam',
        appDescription: 'Make waves in camera video',
        start_url: '/',
        theme_color: '#B9D9EB',
        background: '#B9D9EB',
        icons: {
          favicons: true,
          android: true,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          windows: true,
          yandex: false,
        }
      },
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
