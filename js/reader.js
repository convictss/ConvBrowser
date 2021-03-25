const fs = require("fs");
const BrowserWindow = require("electron").remote.BrowserWindow;

window.onload = function () {
    $("#btn").on("click", function () {
        fs.readFile("values.txt", (err, data) => {
            $("#txt").text(data);
        });
    });
    $("#openNew").on("click", function () {
        let newWin = new BrowserWindow({
            width: 500,
            height: 500
        });
        newWin.loadFile("yellow.html");
        newWin.on("closed", function () {
            newWin = null;
        })
    });
};