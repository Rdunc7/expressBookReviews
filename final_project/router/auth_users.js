const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password)

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(404).json({message: "Error logging in"})
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60})
        req.session.authorization = {
            accessToken, username
        }

        req.session.username = username;
        return res.status(200).json({message: "User successfully logged in"})

    } else {
  
  return res.status(404).json({message: "Invalid login. Check username or password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const username = req.session.username;
  const review = req.query.review;

  if (!username) {
    return res.status(401).json({message: "User not logged in"})
  }
  
  if (!books[ISBN]) {
    res.status(404).json({message: 'No book found'})
  }

  if (!books[ISBN].reviews) {
    books[ISBN].reviews = {}
  }

  books[ISBN].reviews[username] = review

  return res.status(200).json({message:{reviews: books[ISBN].reviews}});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const username = req.session.username;

    if(!username) {
        res.status(401).json({message: "User is not logged in"})
    }
    if (!books[ISBN]) {
        return res.status(404).json({message: "Book not found"})
    }
    if (!books[ISBN].reviews || !books[ISBN].reviews[username]) {
        res.status(404).json({message: "User does not have any reviews for this book"})
    }
    delete books[ISBN].reviews[username];
  
    return res.status(200).json({message: "Review deleted", reviews: books[ISBN].reviews});
    
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
