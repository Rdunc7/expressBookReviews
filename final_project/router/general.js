const express = require('express');
const axios = require('axios')
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
public_users.get('/',async function (req, res) {

    try {
        const response = await axios.get('https://robld2002-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/')
        let books = response.data
        res.json(books)
    } catch (error) {
        console.error("Problem fetching data", error);
        res.status(404).json({message: "Error fetching data",error: error.message})


    }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  let ISBN = req.params.isbn;

  try {
    const response = await axios.get("https://robld2002-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
    const books = response.data
    if (books[ISBN]) {
    res.json(books[ISBN])
    } else {
        res.status(404).json({message: "Book not found for ISBN:" + ISBN})
    }
  } catch (error) {
    console.error("Error fetching content",error)
    res.status(500).json({message: "There was a problem fetching content", error: error.message})

  }
  
 });

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  let authorName = req.params.author;
  const matchingBook = [] 
  
  try {
    const response = await axios.get('https://robld2002-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/')
    const books = response.data
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
}
catch (error) {
    res.status(500).json({message: "Internal Server Error"})
}

});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {

    let bookTitle = req.params.title;
    const matchingTitle = [];

    try {
        const response = await axios.get('https://robld2002-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/')
    const books = response.data
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
} catch (error) {
    res.status(500).json({message: "Server Error"})

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
