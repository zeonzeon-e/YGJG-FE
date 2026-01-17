// const { createProxyMiddleware } = require("http-proxy-middleware");

// module.exports = function (app) {
//   const apiProxy = createProxyMiddleware({
//     target: "http://54.180.123.45:8080",
//     changeOrigin: true,
//     cookieDomainRewrite: "localhost",
//     pathFilter: ["/api/**", "/auth/**"],
//   });

//   app.use(apiProxy);
// };
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware(["/api", "/auth"], {
      target: "http://13.125.250.163:8080",
      changeOrigin: true,
      secure: false, // development self-signed certs
    }),
  );
};
