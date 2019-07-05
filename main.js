const dbURL = "https://superconductor42.github.io/BookDB/booksdb/Books1/"
var books = []
var cart = []

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
    this.priceGST = (price * 1.15).toFixed(2)
    this.gstOnly = (price * 0.15).toFixed(2)
    this.imageURI = dbURL + imageURI
  }
}


function loadBooksDB() { // Loads the info from books txt file
  books = []
  var rawText = importText(dbURL + "/Books.txt") //Import text file containing books
  console.log(rawText);
  var textLines = rawText.split("\n") //Split the text into individual lines
  for (var i = 0; i < textLines.length; i++) { //Iterate through the lines
    fields = textLines[i].split(",") // Split line into fields
    if (fields[1]) { // Check if line is valid
      var book = new Book(fields[0], fields[1], fields[2], fields[3], fields[4]) // Add each of the fields to a new book object
      books.push(book) //Add the book to the master books array
    }
  }
}

function addToCart(bookID) {
  book = books.find((book) => {if (book.id == bookID) {return(book)}}) // locate the book by id
  console.log(book);
  cart.push(book) // Add to array
  displayUpdate();
}

function removeCart(bookID) {
  book = books.find((book) => {if (book.id == bookID) {return(book)}}) // locate the book by id
  index = cart.indexOf(book) // Get the index of the book in the array
  if (index >= 0) { // If item in array,
    cart.splice(index, 1) // Remove it
  }
  displayUpdate();
}

function displayUpdate() { // Updates the website
  bookList = document.getElementById('bookList') // Get the list of books
  bookList.innerHTML = ""
  for (var i = 0; i < books.length; i++) {
    li = document.createElement("LI") //Create a list item
    //Construct a template for the book
    li.innerHTML = `
    <p>${books[i].title} by ${books[i].author}</p>
    <img src="${books[i].imageURI}"><br>
    <p>Price including GST $${books[i].priceGST}</p>
    <button onclick="addToCart('${books[i].id}')">Add To Cart</button>
    <hr>
    `
    bookList.appendChild(li); //Add the list item to the HTML doc
  }
  cartElement = document.getElementById('cart') // Get the element containing the cart
  cartElement.innerHTML = ""
  totalPrice = 0
  for (var i = 0; i < cart.length; i++) {
    totalPrice += Number(cart[i].price)
    li = document.createElement("LI")
    li.innerHTML = `
    <p>${cart[i].title} by ${cart[i].author}<br>
    Price: $${cart[i].price} GST: $${cart[i].gstOnly} Full Price: $${cart[i].priceGST}
    <button onclick="removeCart('${cart[i].id}')">Remove</button>
    </p>
    `
    cartElement.appendChild(li)
  }
  if (cart.length == 0) {
    cartElement.innerHTML = "<p>Empty</p>"
  }
  p = document.createElement("p")
  p.innerHTML = `Total price: $${(totalPrice).toFixed(2)} GST: $${(totalPrice * 0.15).toFixed(2)}<br>
  <strong>Grand Total: $${(totalPrice*1.15).toFixed(2)}</strong>`
  cartElement.appendChild(p)
}

loadBooksDB();
displayUpdate();
