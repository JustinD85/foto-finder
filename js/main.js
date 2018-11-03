const uploadLabel = get(".file-selector-label");
const fileElem = get("#img-upload");
const imgsOnDomElem = get(".card-area");

uploadLabel.addEventListener('click', function (e) {
  if (fileElem) {
    fileElem.click();
  };
  e.preventDefault();
});

function upload(files) {
  if (files.length) {
    var img = document.createElement("img");
    img.src = URL.createObjectURL(files[0]);
    addToDOM(img.src);
    img.onload = function () {
      window.URL.revokeObjectURL(this.src);
    }
  }
  fileElem.value = '';
}



function addToDOM(imgURL) {
  const newCard = document.createElement('section');
  const title = get('#title-input').value;
  const caption = get('#caption-input').value;

  get('#title-input').value = ''
  get("#caption-input").value = '';

  newCard.classList.add('card');
  newCard.innerHTML = `\
  <p class="card-title">${title}</p>
  <img src="${imgURL}" alt="" class="card-img">
  <p class="card-desc">${caption}</p>
  <footer>
    <span class="card-trash"><i class="fas fa-trash-alt"></i></span>
    <span class="card-fav"><i class="fas fa-heart"></i></span>
  </footer>`;
  get('.card-area').prepend(newCard);
}


function get(elem) {
  return document.querySelector(elem);
}