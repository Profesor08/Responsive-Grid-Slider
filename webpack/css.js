const IconfontWebpackPlugin = require('iconfont-webpack-plugin');

module.exports = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include: paths,
          // use: [
          //   'style-loader',
          //   'css-loader'
          // ]

          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  // Add the plugin
                  new IconfontWebpackPlugin(loader)
                ]
              }
            }
          ]


        }
      ]
    }
  };
};