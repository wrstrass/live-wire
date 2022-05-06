const http = require("http");
var express = require('express');
var router = express.Router();

let config = require("../config.json");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/data", function (req, res, next) {
    res.json(require("./data.json"));
});

router.get("/users", function (req, res, next) {
    httpGETRequest("http://" + config.server + "/users").then((data) => {
        res.json(data);
    });
});

router.post("/sendMessage", function (req, res, next) {
    httpGETRequest("http://" + config.server + "/check?username=" + req.body.receiver).then((data) => {
        httpPOSTJSONRequest("http://" + JSON.parse(data).ip + "/receiveMessage", {
            message: req.body.msg
        });
    });
});

router.post("/receiveMessage", function (req, res, next) {
    console.log(req.body);
});

module.exports = router;


function httpGETRequest (url) {
    return new Promise((resolve, reject) => {
        http.get(url, (response) => {
            httpResponseCombineData(response).then((data) => {
                resolve(data);
            });
        })
    });
}

function httpPOSTJSONRequest (url, data) {
    url = new URL(url);
    data = JSON.stringify(data);

    let options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length
        }
    };

    return httpRequest(options, data);
}

function httpRequest (options, data) {
    return new Promise((resolve, reject) => {
        let req = http.request(options, (response) => {
            httpResponseCombineData(response).then((data) => {
                resolve(data);
            });
        });

        req.on("error", (error) => {
            console.log(error);
        });
        req.write(data);
        req.end();
    });
}

function httpResponseCombineData (response) {
    return new Promise((resolve, reject) => {
        let str = "";

        response.on("data", (chunk) => {
            str += chunk;
        });

        response.on("end", () => {
            resolve(str);
        });
    });
}