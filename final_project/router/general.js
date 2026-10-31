const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require("axios");

const API_BASE_URL = process.env.API_BASE_URL ||
    `http://127.0.0.1:${process.env.PORT || 5000}`;


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
public_users.get('/synch',function (req, res) {
  //Write your code here
  const books_list = JSON.stringify(books)
  return res.send(books_list);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn_synch/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.send(book);  
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author_synch/:author',function (req, res) {
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
public_users.get('/title_synch/:title',function (req, res) {
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

// ================================================

public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(`${API_BASE_URL}/synch`);
        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve books"
        });
    }
    //return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/isbn/:isbn', async function (req, res) {
  try {
      const isbn = req.params.isbn;
      const response = await axios.get(`${API_BASE_URL}/isbn_synch/${encodeURIComponent(isbn)}`);

      return res.json(response.data);
  } catch (error) {
      return res.status(500).json({
          message: "Failed to retrieve book"
      });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/author/:author', async function (req, res) {
  try {
      const author = req.params.author;
      const response = await axios.get(`${API_BASE_URL}/author_synch/${encodeURIComponent(author)}`);

      return res.json(response.data);
  } catch (error) {
      return res.status(500).json({
          message: "Failed to retrieve book"
      });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/title/:title', async function (req, res) {
  try {
      const title = req.params.title;
      const response = await axios.get(`${API_BASE_URL}/title_synch/${encodeURIComponent(title)}`);

      return res.json(response.data);
  } catch (error) {
      return res.status(500).json({
          message: "Failed to retrieve book"
      });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// ================================================

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
