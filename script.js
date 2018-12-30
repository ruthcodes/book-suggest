let apiKeyGoogle = //yourkey;
let apiKeyNYTimes = //yourkey;

const bookCover = document.querySelector('#bookCover');
//const bookText = document.querySelector('#bookText');
const bookTitle = document.querySelector('#bookTitle');
const bookDescription = document.querySelector('#bookDescription');
const bookAuthor = document.querySelector('#bookAuthor');
const bookReview = document.querySelector('#bookReview');
const myButton = document.querySelector('i');

let optionChosen = document.querySelector('select');

myButton.addEventListener('click', (e) => handleClick(e.target));

const getRandomBestseller = async () => {
  try {
    let response = await fetch(`https://api.nytimes.com/svc/books/v3/lists.json?api-key=${apiKeyNYTimes}&list=${optionChosen.value}`);
    let data = await response.json();
    let randomNumber = Math.floor(Math.random() * (10 - 0));
    let obj = {
      title: data.results[randomNumber].book_details[0].title,
      author: data.results[randomNumber].book_details[0].author,
      description: data.results[randomNumber].book_details[0].description,
    }
    if (data.results[randomNumber].isbns[0].isbn13){
      obj.isbn = data.results[randomNumber].isbns[0].isbn13;
      console.log('using the isbn array')
      console.log(obj.isbn);
    } else {
      obj.isbn = data.results[randomNumber].book_details[0].primary_isbn13;
    }


    if (obj.description === ""){
      obj.description = "Uh oh, looks like we don't have a description for this book... Just judge it by its cover, I hear that's what you're supposed to do with books anyway"
    }
    return obj;
  } catch (err) {
    console.log(err);
  }
}

const findGoogleBookCover = async (isbn) => {
  //try open library, if no thumbnail, try google books
  let pic = `http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  let img = new Image();
  img.src = pic;
  if (img.height !== 0) return pic;

  try {
    let res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn=${isbn}&key=${apiKeyGoogle}`);
    let data = await res.json();
    return data.items[0].volumeInfo.imageLinks.thumbnail;
  } catch (err) {
    console.log(err);
  }
}

const getBookReviewLink = async (isbn) => {
  try {
    let response = await fetch(`https://api.nytimes.com/svc/books/v3/reviews.json?api-key=${apiKeyNYTimes}&isbn=${isbn}`);
    let data = await response.json();
    return data.results[0].url;
  } catch (err){
    console.log(err);
  }
}

const handleClick = async (e) => {

  //remove any previously shown cover and text
  bookTitle.classList.add('hide');
  bookTitle.classList.remove('show');
  bookCover.classList.remove('bookAnimate');

  //make api calls, parse
  let randBook = await getRandomBestseller();
  let cover = await findGoogleBookCover(randBook.isbn);
  let review = await getBookReviewLink(randBook.isbn);

  // assign vars
  let title = randBook.title;
  let author = randBook.author;
  let subtitle = randBook.description;

  //if there is no review, do a feeling lucky google search for one
  if (!review){
    review = `https://www.google.com/search?q=${title.replace(/ /g, '%20')}%20${author.replace(/ /g, '%20')}%20review`;
  }

  //update book text;
  bookAuthor.innerHTML = `by ${author}`;
  bookTitle.innerHTML = `${title}`;
  bookDescription.innerHTML = `${subtitle}`;
  //animate book cover
  bookCover.classList.add('bookAnimate');
  bookAuthor.classList.add('bookAnimate');
  bookDescription.classList.add('bookText');

  bookTitle.classList.add('show');
  bookTitle.classList.remove('hide');

  bookCover.style.backgroundImage = `url(${cover})`;
  bookAuthor.classList.add('bookText');
  bookDescription.classList.add('bookText');
  bookTitle.classList.add('bookText');
  bookReview.classList.add('bookText');

  bookReview.innerHTML = `<a href= ${review} target='_blank'>Click here to read a review of this book</a>`;

  //set background colours
  bookAuthor.style.background = "#ccccff";
  bookDescription.style.background = "#ffccff";
  bookTitle.style.background = "#ccffff";
  //bookText.innerHTML = `${bookTitle}, ${bookAuthor}. ${bookSubtitle}`;

}

//custom select dropdown

let outerSelectDiv = document.querySelector('.custom-select');
let select = document.querySelector('select');

let customSelected = document.createElement("div");
customSelected.classList.add('custom-selected-option');
customSelected.innerHTML = select.options[select.selectedIndex].innerHTML;
outerSelectDiv.appendChild(customSelected);

//custom container for other options (not selected one)
let customOptionsContainer = document.createElement("div");
customOptionsContainer.classList.add("select-items");
customOptionsContainer.classList.add('hidden-options');

//loop through all the real options
let customOption;
for (let j = 0; j < select.length; j++) {
  //create a new option for each of the original ones
  customOption = document.createElement("div");
  customOption.innerHTML = select.options[j].innerHTML;
  customOption.value = select.options[j].value;
  if (customOption.innerHTML === "Science") customOption.classList.add("highlight-selection");

  //update original when custom clicked
  customOption.addEventListener("click", function(e) {
      //change the top custom 'selected' to this
      customSelected.innerHTML = this.innerHTML;
      //loop through all custom options and remove selection highlight
      for (let i=0;i<customOptionsContainer.children.length;i++){
        if (select[i].innerHTML === this.innerHTML){
          select.value = this.value;
        }
        customOptionsContainer.children[i].classList.remove('highlight-selection')
      }
      this.classList.add('highlight-selection');
      customSelected.click();
  });
  customOptionsContainer.appendChild(customOption);
}

outerSelectDiv.appendChild(customOptionsContainer);
customSelected.addEventListener("click", function(e) {
    //toggle custom options open/closed when custom selected is clicked
    // prevent parent handler from firing
    e.stopPropagation();

    //hide/show custom options, flip arrow
    customOptionsContainer.classList.toggle("hidden-options");
    this.classList.toggle("menu-open");
});


/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", ()=> customOptionsContainer.classList.add("hidden-options"));
