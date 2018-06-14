module.exports = function () {
  return {
    module: {
      rules: [
        {
          test: /\.(glsl)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath(path) {
                  let pathTree = path.split("/");
                  pathTree.shift();
                  return pathTree.join("/");
                },
                name(file) {
                  return '[path][name].[ext]';
                }
              }
            }
          ]
        }
      ]
    }
  }
};