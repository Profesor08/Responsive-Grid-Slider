module.exports = function() {
  return {
    module: {
      rules: [
        {
          test: /\.(mp3)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath(path) {
                  let pathTree = path.split("/");
                  pathTree.shift();
                  return pathTree.join("/");
                },
                name() {
                  return '[path][name].[ext]';
                }
              }
            },
          ],
        },
      ],
    },
  };
};