const EventEmitter = require("events");
const http = require("http");
const fs = require("fs");

const users = require("./users.json");
let data = require("./data.json");
function saveData() {
    fs.writeFileSync("./data.json", JSON.stringify(data));
}

const config = require("./config.json");
const host = config.host;
const port = config.port;

const requestEmitter = new EventEmitter();
requestEmitter.on("GET/", (req, res, url) => {
    res.end("Live Wire Server");
});
requestEmitter.on("GET/register", (req, res, url) => {
    if (users[url.searchParams.get("username")] == url.searchParams.get("password")) {
        data[url.searchParams.get("username")] = {
            password: url.searchParams.get("password"),
            ip: url.searchParams.get("ip")
        };
        saveData();
        console.log("User " + url.searchParams.get("username") + " was registred");

        res.writeHead(200);
    }
    else {
        res.writeHead(404);
    }
    res.end();
});
requestEmitter.on("GET/check", (req, res, url) => {
    if (data[url.searchParams.get("username")] == undefined) {
        res.writeHead(404);
        res.end();
    }
    else {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
            ip: data[url.searchParams.get("username")].ip
        }));
    }
});
requestEmitter.on("GET/users", (req, res, url) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(Object.keys(data)));
});

const requestListener = function (req, res) {
    const url = new URL("http://" + req.headers.host + req.url);
    requestEmitter.emit(req.method + url.pathname, req, res, url);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log("Server started");
});