module.exports = function() {
  return {
    module: {
      rules: [
        {
          test: /\.(jpg|png|gif|svg)$/,
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
            },
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true
              },
            },
          ],
        },
      ],
    },
  };
};