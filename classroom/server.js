const express = require("express");
const { populate } = require("../models/listings");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

// app.use(cookieParser());

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
}

app.use(session(sessionOptions));
app.use(flash());

app.use("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    res.send(name);
});

app.listen(3000, () => {
    console.log("server is litening to 3000");
});