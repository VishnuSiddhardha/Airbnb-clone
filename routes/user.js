const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const user = require("../models/user.js");
const { reviewSchema } = require("../schema.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// SignUp Route
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// SignUp Route
router.post("/signup", wrapAsync(async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User(({email, username}));
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        })
    }
    catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

// Get Login Route
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

router.post("/login", saveRedirectUrl,  passport.authenticate('local', 
    { failureRedirect: '/login', failureFlash: true }),
    async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
});

// logout
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
});


module.exports = router;