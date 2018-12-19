let apiKeyGoogle = //yourkey;
let apiKeyNYTimes = //yourkey;

const bookCover = document.querySelector('#bookCover');
const bookText = document.querySelector('#bookText');
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
    if (data.results[randomNumber].book_details[0].primary_isbn13){
      obj.isbn = data.results[randomNumber].book_details[0].primary_isbn13;
    } else if (data.results[randomNumber].isbns[0].isbn13){
      obj.isbn = data.results[randomNumber].book_details[0].primary_isbn13;
    } else {
      obj.isbn = "none";
    }
    return obj;
  } catch (err) {
    console.log(err);
  }
}

const findGoogleBookCover = async (isbn) => {
  try {
    let res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn=${isbn}&key=${apiKeyGoogle}`);
    let data = await res.json();
    return data.items[0].volumeInfo.imageLinks.thumbnail;
  } catch (err) {
    console.log(err);
  }
}

const handleClick = async (e) => {
  //remove any previously shown cover and text
  bookText.classList.add('hide');
  bookText.classList.remove('show');
  bookCover.classList.remove('bookAnimate');

  //make api calls, parse
  let randBook = await getRandomBestseller();
  let cover = await findGoogleBookCover(randBook.isbn);

  // assign vars
  let bookTitle = randBook.title;
  let bookAuthor = randBook.author;
  let bookSubtitle = randBook.description;

  //animate book cover
  bookCover.classList.add('bookAnimate');
  setTimeout(()=> {
    bookText.classList.add('show');
    bookText.classList.remove('hide');

  },3000);
  bookCover.style.backgroundImage = `url(${cover})`;
  //update book text;
  bookText.innerHTML = `${bookTitle}, ${bookAuthor}. ${bookSubtitle}`;

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
