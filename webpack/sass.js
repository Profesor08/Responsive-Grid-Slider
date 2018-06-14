// const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          include: paths,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    }
  };
};

// module.exports = function (paths) {
//   return {
//     module: {
//       rules: [
//         {
//           test: /\.scss$/,
//           loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true')
//         }
//       ]
//     }
//   };
// };