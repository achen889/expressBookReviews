const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    for (const user of users) {
        if (user.username === username) {
            return true;
        }
    }

    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  for (const user of users) {
      if (user.username === username && user.password === password) {
          return true;
      }
  }

  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(400).json({
          message: "Username and password are required"
      });
  }

  if (!authenticatedUser(username, password)) {
      return res.status(401).json({
          message: "Invalid username or password"
      });
  }

  const token = jwt.sign(
      { username: username },
      "access"
  );

  req.session.authorization = {
      accessToken: token,
      username: username
  };

  return res.status(200).json({
      message: "User successfully logged in",
      username: username
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated",
        isbn: isbn,
        username: username,
        review: review
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted",
        isbn: isbn,
        username: username
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
