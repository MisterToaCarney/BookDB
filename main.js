// Uncomment one of the two lines below to switch text files
const dbURL = "https://superconductor42.github.io/BookDB/booksdb/Books1/"
//const dbURL = "https://superconductor42.github.io/BookDB/booksdb/Books2/"

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

function sendEmail(to, subject, body) { // Opens users' mail client
  to = encodeURIComponent(to)
  subject = encodeURIComponent(subject)
  body = encodeURIComponent(body)
  window.open(`mailto:${to}?subject=${subject}&body=${body}`);
}

class Book {
  constructor(title, author, id, price, imageURI) {
    this.title = title
    this.author = author
    this.id = id
    this.price = price
    this.priceGST = this.price * 1.15
    this.gstOnly = this.price * 0.15
    this.imageURI = dbURL + imageURI
  }
  getPriceGST(humanReadable=false) { // Function that returns either a human readable or machine readble price.
    this.priceGST = this.price * 1.15
    if (humanReadable == false) {
      return(this.priceGST)
    }
    else {
      return("$" + this.priceGST.toFixed(2))
    }
  }
  getGstOnly(humanReadable=false) {
    this.gstOnly = this.price * 0.15
    if (humanReadable == false) {
      return(this.gstOnly)
    }
    else {
      return("$" + this.gstOnly.toFixed(2))
    }
  }
}

function loadBooksDB() { // Loads the info from books txt file
  books = []
  var rawText = importText(dbURL + "/Books.txt") //Import text file containing books
  console.log(rawText);
  var textLines = rawText.split("\n") //Split the text into individual lines
  for (var i = 0; i < textLines.length; i++) { //Iterate through the lines
    var fields = textLines[i].split(",") // Split line into fields
    if (fields.length == 5) { // Check if line is valid
      var book = new Book(fields[0], fields[1], fields[2], fields[3], fields[4]) // Add each of the fields to a new book object
      books.push(book) //Add the book to the master books array
    }
  }
}

function addToCart(bookID) { //Adds items by bookid to cart
  var book = books.find((book) => {if (book.id == bookID) {return(book)}}) // locate the book by id
  console.log(book);
  cart.push(book) // Add to array
  cartUpdate();
}

function removeCart(bookID) { //Removes items by bookid from cart
  var book = books.find((book) => {if (book.id == bookID) {return(book)}}) // locate the book by id
  var index = cart.indexOf(book) // Get the index of the book in the array
  if (index >= 0) { // If item in array,
    cart.splice(index, 1) // Remove it
  }
  cartUpdate();
}

function libraryUpdate() { // Updates the library
  var bookList = document.getElementById('bookList') // Get the list of books
  bookList.innerHTML = ""
  for (var i = 0; i < books.length; i++) {
    var li = document.createElement("LI") //Create a list item
    //Construct a template for the book
    li.innerHTML = `
    <p>${books[i].title} by ${books[i].author}</p>
    <img src="${books[i].imageURI}"><br>
    <p>Price including GST ${books[i].getPriceGST(true)}</p>
    <button onclick="addToCart('${books[i].id}')">Add To Cart</button>
    <hr>
    `
    bookList.appendChild(li); //Add the list item to the HTML doc
  }
}

function cartUpdate() {
  var cartElement = document.getElementById('cart') // Get the element containing the cart
  cartElement.innerHTML = ""
  totalPrice = 0 // Declare as global
  for (var i = 0; i < cart.length; i++) {
    totalPrice += Number(cart[i].price)
    var li = document.createElement("LI")
    li.innerHTML = `
    <p>${cart[i].title} by ${cart[i].author}<br>
    Price: $${cart[i].price} GST: ${cart[i].getGstOnly(true)} Full Price: ${cart[i].getPriceGST(true)}
    <button onclick="removeCart('${cart[i].id}')">Remove</button>
    </p>
    `
    cartElement.appendChild(li)
  }
  if (cart.length == 0) {
    cartElement.innerHTML = "<p>Empty</p>"
  }
  var p = document.createElement("p")
  p.innerHTML = `Total price: $${(totalPrice).toFixed(2)} GST: $${(totalPrice * 0.15).toFixed(2)}<br>
  <strong>Grand Total: $${(totalPrice*1.15).toFixed(2)}</strong>`
  cartElement.appendChild(p)
}

function validateName(inputName) { // Checks if names are valid, retuns true of valid, false if otherwise
  if (inputName.length > 128 || inputName.length == 0) { // If longer than 128 charachters or 0 characters
    return(false) // input is invalid
  }
  return(true) // Input is valid
}

function validateAddress(inputAddress) {
  if (inputAddress.length == 0) {
    return(false) // Input is invalid
  }
  return(true) // Input is valid
}

function validateEmail(inputEmail) { // Validate entered email address
  if (inputEmail.includes("@") && inputEmail.includes(".")) { //Check if email address includes a dot and an @ symbol
    return(true) //Input is valid
  }
  return(false) //Input is invalid
}

function validatePhone(inputPhone) { //Validate entered phone number
  if (isNaN(inputPhone) || inputPhone.length == 0 || inputPhone.length > 15) { // If is not a number or is empty
    return(false) //Input is invalid
  }
  return(true) //Input is valid
}

function submitOrder() { // Runs when user clicks submit order
  var firstNameElement = document.getElementById('firstName') // Get the array elements
  var lastNameElement = document.getElementById('lastName')
  var addressElement = document.getElementById('address')
  var emailElement = document.getElementById('email')
  var phoneElement = document.getElementById('phone')

  var firstNameValid = validateName(firstNameElement.value) //Run the validators on the inputs
  var lastNameValid = validateName(lastNameElement.value)
  var addressValid = validateAddress(addressElement.value)
  var emailValid = validateEmail(emailElement.value)
  var phoneValid = validatePhone(phoneElement.value)

  var errors = document.getElementById('errors') // Get the element used to display any errors.
  firstNameElement.style.borderColor = null // Set the textareas to default color
  lastNameElement.style.borderColor = null
  addressElement.style.borderColor = null
  emailElement.style.borderColor = null
  phoneElement.style.borderColor = null
  errors.innerHTML = "" // Clear the errors
  var masterValid = true
  if (!firstNameValid) { // If invalid
    errors.innerHTML += "Please enter a valid first name.<br>" // Append this error text to the errors element.
    firstNameElement.style.borderColor = "red" // Make the respective text area red
    masterValid = false
  }
  if (!lastNameValid) {
    errors.innerHTML += "Please enter a valid last name.<br>" // Append this error text to the errors element.
    lastNameElement.style.borderColor = "red"  // Make the respective text area red
    masterValid = false
  }
  if (!addressValid) {
    errors.innerHTML += "Please enter a valid address.<br>" // Append this error text to the errors element.
    addressElement.style.borderColor = "red" // Make the respective text area red
    masterValid = false
  }
  if (!emailValid) {
    errors.innerHTML += "Please enter a valid email.<br>" // Append this error text to the errors element.
    emailElement.style.borderColor = "red" // Make the respective text area red
    masterValid = false
  }
  if (!phoneValid) {
    errors.innerHTML += "Please enter a valid phone number.<br>" // Append this error text to the errors element.
    phoneElement.style.borderColor = "red" // Make the respective text area red
    masterValid = false
  }
  if (cart.length == 0) { // If cart empty
    errors.innerHTML += "Please add at least one item to the cart.<br>" // Append this error text to the errors element.
    masterValid = false
  }
  if (masterValid) {
    var cartStr = ""
    for (var i = 0; i < cart.length; i++) { // Iterate through the items in the cart
      cartStr += `- ${cart[i].id} ${cart[i].getPriceGST(true)}\n` // Append this templated string to cartStr
    }
    // Compose a template for the email
    var body = `
Book Order
Name: ${firstNameElement.value} ${lastNameElement.value}
Address: ${addressElement.value}
Email: ${emailElement.value} Phone: ${phoneElement.value}

Order Items:
${cartStr}

Expected Payment:
$${(totalPrice*1.15).toFixed(2)}
`
    sendEmail("test@example.com", "New Book Order", body)
  }
}


// Initial operations:
loadBooksDB(); // Load text file contining the books
libraryUpdate(); // Update the html DOM with the newly loaded db
cartUpdate(); // Show the empty cart
