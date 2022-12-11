var express = require("express");
var router  = express.Router();
var Campground = require("../models/Campground");
var middleware = require("../middleware");

// index route
router.get("/",function(req,res){
	Campground.find({},function(err,allCampgrouns){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index",{campgrounds : allCampgrouns});
		}
	});
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id : req.user._id,
		username : req.user.username
	}
	var newCampGround = {name: name, price:price, image:image, description: desc, author: author};
	Campground.create(newCampGround, function(err,campground){
		if(err){
			console,log(err);
		}
		else{
		res.redirect("/campgrounds");			
		}
	});
});

// NEW
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

// SHOW
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found!");
			res.redirect("/campgrounds");
		}
		else{
		res.render("campgrounds/show",{campground: foundCampground});			
		}
	});
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		res.render("campgrounds/edit", {campground:foundCampground});
	})
});


// UPDATE
router.put("/:id/", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,campground){
		if(err){
			res.redirect("/campgrounds");
		}
		res.redirect("/campgrounds/"+ req.params.id);
	})
});

// DELETE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
		Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		res.redirect("/campgrounds");
	})
});


module.exports = router;