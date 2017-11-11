const express          = require("express");
const tweetsController = express.Router();

tweetsController.get("/", (req, res, next) => {
  res.render(
    "tweets/index",
    { username: req.session.currentUser.username}
  );
});

tweetsController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

module.exports = tweetsController;
