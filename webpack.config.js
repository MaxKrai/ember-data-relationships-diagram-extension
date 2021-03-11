const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
		ui: './src/ui.ts',
		devtools: './src/devtools.ts'
  },
  output: {
    path: path.resolve(__dirname, 'chrome-extension/dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  }
};