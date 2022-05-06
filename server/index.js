const EventEmitter = require("events");
const http = require("http");
const fs = require("fs");

const users = require("./users.json");
let data = require("./data.json");
function saveData() {
    fs.writeFileSync("./data.json", JSON.stringify(data));
}

const host = "localhost";
const port = 8080;

const requestEmitter = new EventEmitter();
requestEmitter.on("GET/register", (req, res, url) => {
    if (users[url.searchParams.get("username")] == url.searchParams.get("password")) {
        data[url.searchParams.get("username")] = {
            password: url.searchParams.get("password"),
            ip: url.searchParams.get("ip")
        };
        saveData();

        res.writeHead(200);
    }
    else {
        res.writeHead(404);
    }
    res.end();
});

const requestListener = function (req, res) {
    const url = new URL("http://" + req.headers.host + req.url);
    requestEmitter.emit(req.method + url.pathname, req, res, url);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log("Server started");
});