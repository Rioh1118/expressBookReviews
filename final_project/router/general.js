const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const book_list = Object.keys(books).map((key) => ({
  ...books[key],
  isbn: key,
}));
public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!(username && password))
    return res.status(300).json({ message: "undefined password or username" });
  if (isValid(username))
    return res.status(300).json({ message: "The username already exists" });

  users.push({ username, password });

  console.log(users);

  return res.status(230).json({ message: "success" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json(book_list);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //books: 1: {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": {} }, jsObject
  const isbn = req.params?.isbn;
  if (!isbn) return res.status(404).send("Not Found");

  let filtered_book = book_list.filter((book) => book.isbn === isbn);
  if (filtered_book.length > 0) {
    return res.status(200).json(filtered_book);
  }
  return res.status(300).json({ message: "The data not found" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params?.author;
  if (author !== "Unknown") {
    return res.status(300).json({ message: "Unknown data" });
  }
  let filtered_book = book_list.filter((book) => book.author === author);
  if (filtered_book.length > 0) {
    return res.status(200).json(filtered_book);
  }
  return res.status(300).json({ message: "not found" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params?.title;
  let filtered_book = book_list.filter((book) => book.title === title);
  if (filtered_book.length > 0) {
    return res.status(200).json(filtered_book);
  }
  return res.status(300).json({ message: "not found" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params?.isbn;
  if (!isbn) return res.status(404).send("Not Found");

  let filtered_book = book_list.filter((book) => book.isbn === isbn);
  if (filtered_book.length > 0) {
    return res.status(200).json(filtered_book.reviews);
  }
  return res.status(300).json({ message: "Not Found" });
});

module.exports.general = public_users;
