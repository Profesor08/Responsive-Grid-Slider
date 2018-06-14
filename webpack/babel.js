const merge = require("webpack-merge");

module.exports = function () {
  return {
    module: {
      rules: [
        // the 'transform-runtime' plugin tells babel to require the runtime
        // instead of inlining it.
        {
          test: /\.js$/,
          // exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", {
                    "useBuiltIns": "entry"
                  }]
                ],
                "plugins": [
                  ["@babel/plugin-proposal-object-rest-spread", { "loose": true, "useBuiltIns": true }],
                ]
              }
            },
            // {
            //   loader: ["source-map-loader"],
            //   options: {
            //     enforce: "pre"
            //   }
            // }
          ]
        }
      ]
    }
  };
};