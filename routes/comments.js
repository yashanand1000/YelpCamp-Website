var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/Campground");
var Comment = require("../models/Comment");
var middleware = require("../middleware/index");

// new
router.get("/new", middleware.isLoggedIn , function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{campground:foundCampground});
		}
	});
});

// create
router.post("/", middleware.isLoggedIn, function(req,res){
	var newComment = req.body.comment;
	Campground.findById(req.params.id , function(err,campground){
		if(err){
			req.flash("error", "Campground not found!");
			console.log(err);
		}
		else{
			Comment.create(newComment,function(err,commentCreated){
				if(err){
					req.flash("error", "Something went wrong!");
					console.log(err);
				}
				else{
					commentCreated.author.id = req.user._id;
					commentCreated.author.username = req.user.username;
					commentCreated.save();

					campground.comments.push(commentCreated);
					campground.save();
					req.flash("success", "Successfully added comment!");
					res.redirect("/campgrounds/"+req.params.id);
				}
			});
		}
	});
});

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground Not Found!");
			res.redirect("/campgrounds");
		}
		else{
			Comment.findById(req.params.comment_id, function(err,foundComment){
			if(err){
				res.redirect("back");
			}
			res.render("comments/edit", {comment:foundComment, campground_id:req.params.id});
			});
		}
	});
});


// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err){
				if(err){
					res.redirect("back");
				}else{
					req.flash("Success","Comment updated!")
					res.redirect("/campgrounds/"+ req.params.id);
				}
			} )
});

// DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
			if(err){
				res.redirect("back");
			}else{
				req.flash("success", "Comment deleted!");
				res.redirect("/campgrounds/"+req.params.id);						
			}
		})
});

module.exports = router;
