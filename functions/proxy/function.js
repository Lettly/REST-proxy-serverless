const { request } = require('https');
exports.helloWorld = async (req, res) => {
    // PRINT THE BODY OF THE REQUEST
    console.log("req.body: ", JSON.stringify(req.body));
    // PRINT THE HEADERS OF THE REQUEST
    console.log("req.headers: ", JSON.stringify(req.headers));
    // PRINT THE QUERY PARAMETERS OF THE REQUEST
    console.log("req.query: ", JSON.stringify(req.query));
    // PRINT THE PATH PARAMETERS OF THE REQUEST
    console.log("req.params: ", JSON.stringify(req.params));
    // PRINT THE HTTP METHOD OF THE REQUEST
    console.log("req.method: ", JSON.stringify(req.method));
    // PRINT THE HTTP URL OF THE REQUEST
    console.log("req.url: ", JSON.stringify(req.url));
    // PRINT THE HTTP PATH OF THE REQUEST
    console.log("req.path: ", JSON.stringify(req.path));
    // PRINT THE HTTP HOST OF THE REQUEST
    console.log("req.host: ", JSON.stringify(req.host));
    // PRINT THE HTTP PROTOCOL OF THE REQUEST

    //Make a request to the url given in req.path and with the method given in req.method and with the headers given in req.headers and with the body given in req.body and return the response
    res.set('Access-Control-Allow-Origin', '*');

    const url = req.path.replace("/", "");
    const hostname = url.replace("https://", "").replace("http://", "").split("/")[0];
    const path = url.split("/").slice(1).join("/");
    const options = {
        hostname: hostname,
        port: 443,
        path: path,
        method: req.method,
        headers: req.headers
    };
    console.log("options: ", JSON.stringify(options));
    req.method != "GET" ? options.body = req.body : null;

    const proxy = request(options, (response) => {
        res.writeHead(response.statusCode, response.headers);
        response.pipe(res, { end: true });
    });

    req.pipe(proxy, { end: true });
};