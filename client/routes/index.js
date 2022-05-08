const fs = require("fs");
const http = require("http");
const WebSocket = require("ws");
var express = require('express');
var router = express.Router();

let config = require("../config.json");

let data = require("../data.json");
function saveData () {
    fs.writeFileSync("./data.json", JSON.stringify(data));
}


let wsServer = new WebSocket.Server({port: config.webSocketPort});
let mainWebSocketCliet;
wsServer.on("connection", (wsClient) => {
    mainWebSocketCliet = wsClient;
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get("/data", function (req, res, next) {
    res.json(data);
});

router.get("/webSocketPort", function (req, res, next) {
    res.json({ port: config.webSocketPort });
});

router.get("/username", function (req, res, next) {
    res.json({ username: config.username });
});

router.get("/users", function (req, res, next) {
    httpGETRequest("http://" + config.server + "/users").then((data) => {
        res.json(data);
    });
});


router.post("/sendMessage", function (req, res, next) {
    httpGETRequest("http://" + config.server + "/check?username=" + req.body.receiver).then((data) => {
        return httpPOSTJSONRequest("http://" + JSON.parse(data).ip + "/receiveMessage", {
            sender: config.username,
            message: req.body.msg
        });
    });
});

router.post("/receiveMessage", function (req, res, next) {
    if (req.body.sender == config.username) return;

    let i = 0;
    for (i = 0; i < data.length; i++)
        if (data[i].username == req.body.sender)
            break;
    if (i == data.length) {
        data.push({
            username: req.body.sender,
            messages: []
        });
    }

    data[i].messages.push({
        sent: false,
        text: req.body.message
    });
    data.unshift(data.splice(i, 1)[0]);
    saveData();

    mainWebSocketCliet.send(JSON.stringify({
        type: "NewIncomingMessage",
        message: req.body
    }));
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