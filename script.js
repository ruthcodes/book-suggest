let apiKeyGoogle = //yourkey;
let apiKeyNYTimes = //yourkey;

const bookCover = document.querySelector('#bookCover');
const bookText = document.querySelector('#bookText');
const myButton = document.querySelector('button');
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
