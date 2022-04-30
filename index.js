const express = require("express");
const res = require("express/lib/response");
const http = require("http");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { URL } = require("url");

const app = express();

const PORT = 3223;
const HOST = "localhost";

app.get("/info", (req1, res, next) => {
  res.send("This is a proxy service to manage multi domatin in single domain");
});

// Following is the row logic of the proxy 
// app.use("/", (request, res1, next) => {
//   let url = "http://localhost:";

//   switch (request.hostname.split(".")[0]) {
//     case "react":
//       url += "3000";
//       break;

//     case "ember":
//       url += "4200";
//       break;

//     default:
//       return;
//   }

//   url += request.originalUrl;

// 	// res.locals.proxy_url = url;

// 	// Setting cookies

// 	// ########## How Do it manually  ###########
// 	let req = http.request(url, (res2) => {
// 		res1.cookie("proxy-cookia", "sk", { domain: "app.localhost" });

//     res2.pipe(res1);
//     // res2.on("error", res1.send);
//   });

//   req.on("error", res1.send);
//   req.end();
// 	// ##########################################
// }, function() {

// });

app.use(
  "/api/v2",
  (req, res, next) => {
    console.log("hitting api v2 request");
    next();
  },
  createProxyMiddleware({
    target: "localhost:4200/api/v2",
    changeOrigin: true,
    logLevel: "debug",
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      // Log outbound request to remote target
      console.log("PROXY req -->  ", proxyReq);
    },
    onProxyRes: (proxyRes, req, res) => {
      // log original request and proxied request info
      const exchange = `[${req.method}] [${proxyRes.statusCode}] ${req.path} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${proxyRes.req.path}`;
      console.log(exchange); // [GET] [200] / -> http://www.example.com
    },
    onError: function onError(err) {
      console.error(err);
    },
  })
);


app.use(
  "/ember",
  createProxyMiddleware({
    target: "http://localhost:4200",
		changeOrigin: true,
  })
);

app.use(
  "/react",
  createProxyMiddleware({
    target: "http://localhost:3000",
  })
);

app.listen(PORT, HOST, () => {
  console.log("Starting proxy server");
});
