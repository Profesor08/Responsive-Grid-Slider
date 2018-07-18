const ExtractTextPlugin = require("extract-text-webpack-plugin");
const IconfontWebpackPlugin = require('iconfont-webpack-plugin');

module.exports = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          include: paths,
          use: ExtractTextPlugin.extract({
            publicPath: "../",
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {minimize: true}
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: (loader) => [
                    // Add the plugin
                    new IconfontWebpackPlugin(loader)
                  ]
                }
              },
              'sass-loader'
            ]
          })
        },
        {
          test: /\.css$/,
          include: paths,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {minimize: true}
              }
            ]
          })
        }
      ]
    },

    plugins: [
      new ExtractTextPlugin("./css/[name].css")
    ]
  }
};