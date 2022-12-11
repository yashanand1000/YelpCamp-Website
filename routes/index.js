var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var passport = require("passport");

// root
router.get("/",function(req,res){
	res.render("landing");
});

// register
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
		   req.flash("success", "Welcome to YelpCamp "+newUser.username);
           res.redirect("/campgrounds"); 
        });
    });
});

// Login form
router.get("/login", function(req, res){
   res.render("login"); 
});

// Login logic

router.post("/login", passport.authenticate("local" , {
	successRedirect : "/campgrounds",
	failureRedirect : "/login"
}), function(req,res){
});

// logout
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged You Out !");
	res.redirect("/campgrounds");
});

module.exports = router;