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
    http.get("http://" + config.server + "/users", (response) => {
        let httpPromise = makeHttpRequestPromise(response);
        httpPromise.then((data) => {
            res.json(data);
        });
    });
});

module.exports = router;

function makeHttpRequestPromise (response) {
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