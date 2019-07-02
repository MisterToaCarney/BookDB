const dbURL = "https://superconductor42.github.io/BookDB/booksdb/Books1/"
var books = []

function importText(textFile) { // Imports files from remote source
    "use strict";
    var rawFile = new XMLHttpRequest();
    var allText = "";
    rawFile.open("Get", textFile, false);
    rawFile.onreadystatechange = function()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}

class Book {
  constructor(title, author, id, price, imageURI) {
    this.title = title
    this.author = author
    this.id = id
    this.price = price
    this.imageURI = dbURL + imageURI.replace(";", "")
  }
}


function loadBooksDB() {
  books = []
  var rawText = importText(dbURL + "/Books.txt") //Import text file containing books
  var textLines = rawText.split("\n") //Split the text into individual lines
  for (var i = 0; i < textLines.length; i++) { //Iterate through the lines
    fields = textLines[i].split(",") // Split line into fields
    var book = new Book(fields[0], fields[1], fields[2], fields[3], fields[4]) // Add each of the fields to a new book object
    books.push(book) //Add the book to the master books array
  }
}

function displayUpdate() {
  bookList = document.getElementById('bookList');
  for (var i = 0; i < books.length; i++) {
    li = document.createElement("LI");
    img = document.createElement("IMG")
    img.setAttribute("src", books[i].imageURI)
    content = document.createTextNode(books[i].title + " by " + books[i].author)
    li.appendChild(content)
    li.appendChild(img)
    bookList.appendChild(li);
  }
}

loadBooksDB();
displayUpdate();
