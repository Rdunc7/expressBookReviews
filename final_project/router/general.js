const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let ISBN = req.params.isbn;
    const book = books[ISBN];

    if(book) {
        res.send(book)
    } else {
        res.status(404).json({ message: "No book found" })
    }
  
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let authorName = req.params.author;
  const matchingBook = [] 
  
  for(let key in books) {
    if (books[key].author === authorName) {
    matchingBook.push({isbn: key, ...books[key] });
    }
  }
  if (matchingBook.length > 0) {
    res.status(200).json({matchingBook});

  } else {
    res.status(404).json({message: "No book found by this author"})
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
