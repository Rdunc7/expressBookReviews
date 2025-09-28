const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if(userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
};



public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password) {
    if(!doesExist(username)) {
        users.push({"username": username, "password": password});
        res.status(200).json({message: "User has been successfuly registered. You can now login"})
    } 
  } else {
   res.status(404).json({message: "User already exists!"});
  }
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
    let bookTitle = req.params.title;
    const matchingTitle = [];
    for(let key in books) {
        if (books[key].title === bookTitle) {
            matchingTitle.push({isbn: key,...books[key]})
        }
    }
    if (matchingTitle.length > 0) {
    res.status(200).json({message: matchingTitle})
    } else {
        res.status(404).json({message: "Book title not found"})
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let ISBN = req.params.isbn;
    let revArr = []

    for (let key in books) 
    if (ISBN) {
        revArr.push({reviews: books[key].reviews})
        res.send(revArr)         
    } else {
  return res.status(404).json({message: "ISBN not found"});
    }
});

module.exports.general = public_users;
