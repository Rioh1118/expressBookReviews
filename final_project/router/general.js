const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username or password is missing" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "The username already exists" });
  }

  users.push({ username, password });

  console.log(users);

  return res.status(201).json({ message: "User registration successful" });
});

// Get the book list available in the shop
// public_users.get("/", function (req, res) {
//   const bookList = Object.values(books);
//   return res.status(200).json(bookList);
// });
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://example.com/shop/books");
    const books = response.data;
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available books" });
  }
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   const isbn = req.params?.isbn;

//   if (!isbn) {
//     return res.status(400).json({ message: "ISBN not provided" });
//   }

//   const book = books[isbn];

//   if (book) {
//     return res.status(200).json(book);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params?.isbn;

  try {
    const resp = await axios.get(`https://openlibrary.org/isbn/${isbn}.json`);
    const book = { data: resp.data };
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: "Book details not found" });
  }
});

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   const author = req.params?.author;

//   if (!author) {
//     return res.status(400).json({ message: "Author not provided" });
//   }

//   const matchingBooks = [];

//   // Loop through all books
//   Object.keys(books).forEach((isbn) => {
//     const book = books[isbn];

//     // Check if the author matches
//     if (book.author === author) {
//       matchingBooks.push({ isbn, ...book });
//     }
//   });
//   if (matchingBooks.length > 0) {
//     return res.status(200).json(matchingBooks);
//   } else {
//     return res.status(404).json({ message: "Books by the author not found" });
//   }
// });

public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;

  try {
    const response = await axios.get(
      `https://example.com/shop/books/author/${author}`
    );
    const booksByAuthor = response.data;
    res.json(booksByAuthor);
  } catch (error) {
    res.status(404).json({ message: "Books by author not found" });
  }
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   const title = req.params?.title;

//   if (!title) {
//     return res.status(400).json({ message: "Title not provided" });
//   }

//   const matchingBooks = [];

//   // Loop through all books
//   Object.keys(books).forEach((isbn) => {
//     const book = books[isbn];

//     // Check if the title matches
//     if (book.title === title) {
//       matchingBooks.push({ isbn, ...book });
//     }
//   });

//   if (matchingBooks.length > 0) {
//     return res.status(200).json(matchingBooks);
//   } else {
//     return res.status(404).json({ message: "Books with the title not found" });
//   }
// });

public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const response = await axios.get(
      `https://example.com/shop/books/title/${title}`
    );
    const booksByTitle = response.data;
    res.json(booksByTitle);
  } catch (error) {
    res.status(404).json({ message: "Books by title not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params?.isbn;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN not provided" });
  }

  const book = books[isbn];

  if (book) {
    const reviews = book.reviews;
    return res.status(200).json({ isbn, reviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
