const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // clean the dist directory at every build
    assetModuleFilename: '[name][ext]', // Preserve the assets' original file name
  },
  mode: 'development',
  devtool: 'inline-source-map', // map the bundled js code to the original js file
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    hot: true,
    port: 3000,
  },
  // Only for multiple entry points
  //   optimization: {
  //     runtimeChunk: "single",
  //   },
  module: {
    rules: [
      {
        // CSS files import
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Images files import
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
      },
      {
        // BPMN files import
        test: /\.bpmn$/,
        type: 'asset/source',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
  ],
};
