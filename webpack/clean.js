const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = function (pathToClean, options) {
  return {
    plugins: [
      new CleanWebpackPlugin(pathToClean, options)
    ]
  };
};