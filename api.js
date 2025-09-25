const express = require("express");
const ExpressError = require("./ExpressError.js");
const app = express();

app.use("/api", (req, res, next) => {
    console.log("I'm the middleware for the api Route");
    next();
});

app.get("/api", (req, res) => {
    res.send("Data");
});

app.get("/admin", (req, res) => {
    throw new ExpressError(403, "Access to admin is Forbidden");
});

app.use((err, req, res, next) => {
    let {status, message} = err;
    res.status(status).send(message);
});

app.listen("8080", () => {
    console.log("Server listening to the port 8080");
});