var express = require('express');
var router = express.Router();

/* GET home page. */
//  redirect to books route and display all books from database
router.get('/', function(req, res, next) {
  res.redirect("/books")
});

module.exports = router;
