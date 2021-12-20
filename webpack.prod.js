const { merge } = require( 'webpack-merge' );
const common = require( './webpack.common.js' );
const WorkboxPlugin = require( 'workbox-webpack-plugin' );

module.exports = merge( common, {
  mode: 'production',
  // mode: 'development',
  devtool: 'source-map',
  plugins: [
    new WorkboxPlugin.GenerateSW( {
      clientsClaim: true,
      skipWaiting: true,
      exclude: [ /\.mp4$/ ],
    } ),
  ],
});
