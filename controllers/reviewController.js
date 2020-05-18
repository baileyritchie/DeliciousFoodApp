const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const User = mongoose.model('User');
const Review = mongoose.model('Review');

exports.addReview = async (req,res) => {
  req.body.author = req.user._id; // store from user logged in 
  req.body.store = req.params.id; // store from url
  const newReview = await (new Review(req.body).save());
  req.flash('success', "Review Saved.");
  res.redirect('back');
};