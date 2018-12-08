let apiKey = "your key here";

const bookCover = document.querySelector('#bookCover');
const bookText = document.querySelector('#bookText');
const myButton = document.querySelector('button');
let optionChosen = document.querySelector('select')

myButton.addEventListener('click', (e) => handleClick(e.target));

const getBestsellers = async () => {
  try {
    let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${optionChosen.value}&key=${apiKey}`);
    let data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

const handleClick = async (e) => {
  console.log(e)
  console.log(optionChosen.value)
  bookCover.classList.add('bookAnimate');
  bookText.innerHTML = `this is some text about a ${optionChosen.value} book`
  setTimeout(()=> {
    bookText.classList.add('show');
    bookText.classList.remove('hide');
  },3000)

  let d = await getBestsellers();
  console.log(d)

}
