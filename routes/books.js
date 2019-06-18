var express = require('express');
var router = express.Router();
var Book = require("../models").Book;

/* GET books listing by the title A-Z. */
// /: Home route should redirect to the /books route
// /books:  shows the full list of books in A-Z, a-z order
router.get('/', (req, res, next) => {
  Book.findAll({
    order: [
      ["Title"]
    ]
  }).then((numBooks) => {
    res.render('books/index', { //render index.pug with 2 arguments
      books: numBooks,
      title: 'Library Books'
    });
  }).catch((err) => {
    res.send(500, err); //Internal Server Error
  });
});

/* Create a new book form. */
// /new-book: Shows a create new book form
router.get('/new-book', (req, res, next) => {
  res.render("books/new-book", {//render new-book.pug with 1 arguments
    title: "Make A New Book"
  });
});

/* POST is used to add a new resource to a collection. /books
// a new book to the books listing or list of URLs. */
//Add a new book to a collection
router.post('/', (req, res, next) => {
  Book.create(req.body).then(() => {
    // if all info is entered, render the homepage with an added book
    res.redirect("/books/");
  }).catch((err) => { // if title or author is not entered, error happens, then
    if (err.name === "SequelizeValidationError") {
      res.render("books/new-book", { //re-render a created newbook with error messages
        book: Book.build(req.body),
        errors: err.errors, //error message
        title: "Error! Make New Book"
      }) // show a new title of the page
    } else {
      throw err;
    }
  }).catch((err) => {
    res.send(500, err); //Internal Server Error
  });;
});

/* GET individual book by clicking on one of books. */
// update the book
router.get("/:id", (req, res, next) => {
  Book.findByPk(req.params.id).then((getBook) => {
    // if there is any book match from database
    if (getBook) {
      res.render("books/update-book", { //render update-book.pug with 3 arguments
        notice: "Update Book",
        book: getBook,
        title: getBook.title
      });
    } else { // if there is no any match from database
      res.render("books/page-not-found", { //render page-not-found.pug
        message: "Sorry! We couldn't find the page you were looking for.",
        title: "Page Not Found"
      });
    }
  }).catch((err) => {
    res.send(500, err); //Internal Server Error
  });
});

/* PUT Method to update book record. /books/1 */
// Don't use PUT for a collection or a list of URL (don't use in /books)
// Updates a book in the database.
router.put('/:id', (req, res, next) => {
  Book.findByPk(req.params.id).then((updateBook) => {
    if (updateBook) {
      return updateBook.update(req.body);
    } else {
      res.send(404); //Page not Found
    }
  }).then((updateBook) => {
    res.redirect("/books/");
  }).catch((err) => { // if title or author is missed, error happens, then
    if (err.name === "SequelizeValidationError") {
      var updateBook = Book.build(req.body);
      updateBook.id = req.params.id; //make correct book get updated
      res.render("books/update-book", { //re-render the update book with error messages
        book: updateBook,
        errors: err.errors,
        title: "Error! Update Book",
        notice: "Error! Update Book"
      })
    } else {
      throw err;
    }
  }).catch((err) => {
    res.send(500, err); //Internal Server Error
  });
});

/* DELETE an individual book. */
// Sending a DELETE request to a detail record, a URL for
// a single record, should delete just that record.
// Sending delete to an entire collection would delete the whole collection.
router.delete('/:id', (req, res, next) => {
  Book.findByPk(req.params.id).then((delBook) => {
    if (delBook) {
      return delBook.destroy();
    } else {
      res.render('page-not-found', {
        title: "Page Not Found"
      });
    }
  }).then(() => { // after deleting redirect to homepage
    res.redirect("/books");
  }).catch((err) => {
    res.send(500, err); //Internal Server Error
  });
});


module.exports = router;
