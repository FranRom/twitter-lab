const express          = require("express");
const tweetsController = express.Router();
const User  = require("../models/user");
const Tweet = require("../models/tweet");
const moment = require("moment");


tweetsController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

tweetsController.get("/new", (req, res, next) => {
  res.render("tweets/new",
    { username: req.session.currentUser.username });
});

tweetsController.post("/", (req, res, next) => {
  const user  = req.session.currentUser;

  User.findOne({ username: user.username }).exec((err, user) => {
    if (err) { return; }

    const newTweet = new Tweet({
      user_id:   user._id,
      user_name: user.username,
      tweet:     req.body.tweetText
    });

    newTweet.save((err) => {
      if (err) {
        res.render("tweets/new",
          {
            username: user.username,
            errorMessage: err.errors.tweet.message
          });
      } else {
        res.redirect("/tweets");
      }
    });
  });
});


tweetsController.get("/", (req, res, next) => {
  User
    .findOne({ username: req.session.currentUser.username }, "_id username")
    .exec((err, user) => {
      if (!user) { return; }

      Tweet.find({ "user_name": user.username }, "tweet created_at")
        .sort({ created_at: -1 })
        .exec((err, tweets) => {
          res.render("tweets/index",
            {
              username: user.username,
              tweets,
              moment });
        });
  });
});


module.exports = tweetsController;
