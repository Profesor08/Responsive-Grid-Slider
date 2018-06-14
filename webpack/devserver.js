module.exports = function (host = "0.0.0.0", port = "3000") {
  return {
    devServer: {
      stats: "errors-only",
      host: host,
      port: port
    }
  }
};