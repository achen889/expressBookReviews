const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(400).json({
          message: "Username and password are required"
      });
  }

 if (isValid(username)) {
      return res.status(409).json({
          message: "User already exists"
      });
  }

  users.push({
      username: username,
      password: password
  });

  return res.status(200).json({
    message: "User successfully registered",
    username: username
  });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const books_list = JSON.stringify(books)
  return res.send(books_list);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.send(book);  
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  const results = {};

  for (const key of Object.keys(books)) {
      if (books[key].author === author) {
          results[key] = books[key];
      }
  }
  return res.json(results);

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  const results = {};

  for (const key of Object.keys(books)) {
      if (books[key].title === title) {
          results[key] = books[key];
      }
  }

  return res.json(results);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;
  const book = books[isbn];


  if (!book) {
      return res.status(404).send("Book not found");
  }

  return res.send(book.reviews); 
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
