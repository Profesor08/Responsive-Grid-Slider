module.exports = function() {
  return {
    module: {
      rules: [
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          //loader: 'file-loader', // ?name=fonts/[name].[ext]
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
          ],
        },
      ],
    },
  };
};