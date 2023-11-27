const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; //ユーザーオブジェクト: {username,password}

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  exist_user = users.filter((user) => user.username === username);

  if (exist_user) return false;
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter(
    (user) => user.username === username && user.password === password
  );
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Username or password is missing" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).json({ message: "successfuly logged in" });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const user_review = req.query.review;

  if (!books[isbn]) {
    return res.status(404).json({ message: "The book was not found" });
  }
  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = user_review;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    books[isbn].reviews[username] = user_review;
    return res.status(200).json({ message: "Reveiw added successfully" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "delete succesfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
