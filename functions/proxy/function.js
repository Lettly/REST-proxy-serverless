var net = require('net');
var http = require('http');
var url = require('url');

exports.proxy = async (clientReq, clientRes) => {
    var reqUrl = retriveUrl(clientReq.path);

    var options = {
        hostname: reqUrl.hostname,
        port: reqUrl.port,
        path: reqUrl.path,
        method: clientReq.method,
        // headers: clientReq.headers
    };
    console.log("options: ", JSON.stringify(options));

    // create socket connection on behalf of client, then pipe the response to client response (pass it on)
    var serverConnection = http.request(options, function (res) {
        clientRes.writeHead(res.statusCode, res.headers)
        res.pipe(clientRes);
    });

    clientReq.pipe(serverConnection);

    clientReq.on('error', (e) => {
        console.log('client socket error: ' + e);
    });

    serverConnection.on('error', (e) => {
        console.log('server connection error: ' + e);
    });
}

// This code splits the proxyParams string into two parts. The first part is the proxy hostname, and the second part is the proxy path.
// For example, if proxyParams is "proxy.example.com/foo/bar", then this code returns "proxy.example.com" as the proxy hostname, and "foo/bar" as the proxy path.
function retriveUrl(proxyParamsPath) {
    let proxyParams = proxyParamsPath.replace("/", "");
    console.log("proxyParams: ", proxyParams);

    let port = proxyParams.split("/")[0].includes(":") ? proxyParams.split("/")[0].split(":")[1] : 443;
    if (proxyParams.startsWith("http://")) {
        proxyParams = proxyParams.replace("http://", "");
        port = 80;
    }
    if (proxyParams.startsWith("https://")) {
        proxyParams = proxyParams.replace("https://", "");
        port = 443;
    }

    return { hostname: proxyParams.split("/")[0], path: proxyParams.split("/").slice(1).join("/"), port: port }
}


// exports.helloWorld = async (req, res) => {
//     // PRINT THE BODY OF THE REQUEST
//     // console.log("req.body: ", JSON.stringify(req.body));
//     // PRINT THE HEADERS OF THE REQUEST
//     // console.log("req.headers: ", JSON.stringify(req.headers));
//     // PRINT THE QUERY PARAMETERS OF THE REQUEST
//     console.log("req.query: ", JSON.stringify(req.query));
//     // PRINT THE PATH PARAMETERS OF THE REQUEST
//     console.log("req.params: ", JSON.stringify(req.params));
//     // PRINT THE HTTP METHOD OF THE REQUEST
//     console.log("req.method: ", JSON.stringify(req.method));
//     // PRINT THE HTTP URL OF THE REQUEST
//     console.log("req.url: ", JSON.stringify(req.url));
//     // PRINT THE HTTP PATH OF THE REQUEST
//     console.log("req.path: ", JSON.stringify(req.path));
//     // PRINT THE HTTP HOST OF THE REQUEST
//     console.log("req.host: ", JSON.stringify(req.host));
//     // PRINT THE HTTP PROTOCOL OF THE REQUEST

//     //Make a request to the url given in req.path and with the method given in req.method and with the headers given in req.headers and with the body given in req.body and return the response
//     res.set('Access-Control-Allow-Origin', '*');

//     const url = req.path.replace("/", "");
//     const hostname = url.replace("https://", "").replace("http://", "").split("/")[0];
//     const path = url.split("/").slice(1).join("/");
//     const options = {
//         hostname: hostname,
//         port: 443,
//         path: path,
//         // method: req.method,
//         // headers: req.headers
//     };
//     console.log("options: ", JSON.stringify(options));
//     req.method != "GET" ? options.body = req.body : null;

//     const proxy = request(options, (response) => {
//         res.writeHead(response.statusCode, response.headers);
//         response.pipe(res, { end: true });
//     });

//     req.pipe(proxy, { end: true });
// };