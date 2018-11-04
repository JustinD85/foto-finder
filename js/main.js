const uploadButton = get('#file-selector-label');
const fileInput = get('#img-upload');
const cardArea = get('#card-area');
const addCardButton = get('#add');
const reader = new FileReader();
const favButton = get('.card-fav');
const viewFavButton = get('#fav-button');

const images = (() => {
  const imagesArray = [];
  let tempImg = 0;
  let nextId = 0;
  return () => {
    return {
      add: (inUrl) => {
        const lastElementIndex = imagesArray.length - 1;
        if (imagesArray.length > 0) {
          nextId = parseInt(imagesArray[lastElementIndex].id) + 1;
        }
        const title = get('#title-input').value;
        const caption = get('#caption-input').value;
        const newImg = new Photo(nextId, title, caption, inUrl, false);
        tempImg = newImg;
      },
      remove: (inId) => {
        const tempIndex = imagesArray.findIndex(obj => obj.id == inId);
        imagesArray[tempIndex].deleteFromStorage(imagesArray, tempIndex);
      },
      update: (inId) => {
        const tempIndex = imagesArray.findIndex(obj => obj.id === parseInt(inId));
      },
      asArray: () => (imagesArray),
      publish: () => {
        console.log('Publishing!');
        get('#card-area').innerHTML = '';
        if (tempImg) {
          imagesArray.push(tempImg);
        }
        tempImg.saveToStorage(imagesArray);
        imagesArray.forEach(e => {
          addToDOM(e)
          checkCanSubmit();
        })
      }
    }
  }
})();

window.onload = () => {
  let favs;
  if (localStorage.getItem('imgs') !== null) {
    let tempImgsArr = JSON.parse(localStorage.getItem('imgs'));
    tempImgsArr.forEach(ele => {
      let tempCard = new Photo(ele.id, ele.title, ele.caption, ele.file, ele.favorite);
      addToDOM(tempCard);
      images().asArray().push(tempCard);
    });
    console.log(`${tempImgsArr.length} objs loaded`, tempImgsArr);
  }
  updateFavButton();
}

uploadButton.addEventListener('click', e => {
  e.preventDefault();
  fileInput.click();
});
getAll('.input-criteria').forEach(e => {
  e.addEventListener('keyup', () => {
    checkCanSubmit();
  })
})

fileInput.addEventListener('change', () => {
  checkCanSubmit();
})

addCardButton.addEventListener('click', e => {
  e.preventDefault();
  images().publish();
});

fileInput.addEventListener('change', () => {
  upload(fileInput.files);
});

reader.addEventListener('load', () => images().add(reader.result));

cardArea.addEventListener('click', (e) => {
  //Favorite behaviour
  if (e.target.closest('.card-fav')) {
    const inId = e.target.closest('.card').dataset.id;
    const atThisIndex = images().asArray().findIndex(e => e.id == inId);
    // const cardTitle = get(`.card[data-id='${inId}'] .card-title`).innerText;
    // const cardDesc = get(`.card[data-id='${inId}'] .card-desc`).innerText;
    // const cardFile = get(`.card[data-id='${inId}'] .card-img`).src;
    const isFav = get(`.card[data-id='${inId}'] .card-fav`).attributes.src.value !== 'imgs/favorite-active.svg';
    // let favs;
    e.target.src = e.target.attributes.src.value == 'imgs/favorite-active.svg' ?
      'imgs/favorite.svg' : 'imgs/favorite-active.svg';

    //this will be update self function
    images().asArray()[atThisIndex].favorite = isFav;
    updateFavButton();
    images().asArray()[atThisIndex].updatePhoto(images().asArray());
  }
  if (e.target.closest('.card-trash')) {
    e.target.src = e.target.attributes.src.value == 'imgs/delete-active.svg' ?
      'imgs/delete.svg' : 'imgs/delete-active.svg';
  }
});

function updateFavButton() {
  const favs = images().asArray().filter(e => e.favorite === true).length;
  viewFavButton.innerText = `View ${favs} Favorites`;
}

//Delete icon Behaviour
cardArea.addEventListener('mousedown', (e) => {
  if (e.target.closest('.card-trash')) {
    e.target.src = e.target.attributes.src.value == 'imgs/delete-active.svg' ?
      'imgs/delete.svg' : 'imgs/delete-active.svg';
  }
});

//If you press delete, but don't release, reset svg
cardArea.addEventListener('mouseout', (clicked) => {
  if (clicked.target.closest('.card-trash')) {
    clicked.target.src = 'imgs/delete.svg';
  }
});

//The actual delete, if a legal press
cardArea.addEventListener('mouseup', (e) => {
  if (e.target.closest('.card-trash') &&
    e.target.attributes.src.value === 'imgs/delete-active.svg') {
    images().remove(e.target.closest('.card').dataset.id);
    e.target.closest('.card').remove();
  }
  updateFavButton();
});

cardArea.addEventListener('focusout', editPhotoText);
cardArea.addEventListener('keypress', editPhotoText);

function editPhotoText(event) {
  if (event.keyCode === 13) {
    var cardId = event.target.closest('.card').dataset.id;
    var currentCardTitle = get(`.card[data-id='${cardId}'] .card-title`).innerText;
    var currentCardCaption = get(`.card[data-id='${cardId}'] .card-desc`).innerText;

    images().asArray().forEach((oldCard) => {
      if (oldCard.id == cardId) {
        oldCard.title = currentCardTitle;
        oldCard.caption = currentCardCaption;
        oldCard.updatePhoto(images().asArray());
      }
    });
    event.target.blur();
  }
  if (event.target.classList.contains('card-title') ||
    event.target.classList.contains('card-desc')) {
    var cardId = event.target.closest('.card').dataset.id;
    var currentCardTitle = get(`.card[data-id='${cardId}'] .card-title`).innerText;
    var currentCardCaption = get(`.card[data-id='${cardId}'] .card-desc`).innerText;

    images().asArray().forEach((oldCard) => {
      if (oldCard.id == cardId) {
        oldCard.title = currentCardTitle;
        oldCard.caption = currentCardCaption;
        oldCard.updatePhoto(images().asArray());
      }
    });
  }
}

function upload(files) {
  reader.readAsDataURL(get('#img-upload').files[0]);
}

function addToDOM(img) {
  const newIdea = document.createElement('section');
  const tempFav = img.favorite ? 'favorite-active.svg' : 'favorite.svg';
  get('#title-input').value = '';
  get("#caption-input").value = '';
  newIdea.classList.add('card');
  newIdea.dataset.id = img.id;
  newIdea.src = newIdea.file;
  newIdea.innerHTML = `\
  <p class="card-title"  contenteditable="true">${img.title}</p>
  <img src="${img.file}"  alt="images upload from users" class="card-img">
  <p class="card-desc "  contenteditable="true">${img.caption}</p>
  <footer>
    <img class="card-trash" src="imgs/delete.svg" alt="Trash, to delete photo">
    <img class="card-fav" src="imgs/${tempFav}" alt="A button to like the photo">
  </footer>`;
  get('#card-area').prepend(newIdea);
}

function get(elem) {
  return document.querySelector(elem);
}

function getAll(elem) {
  return document.querySelectorAll(elem);
}

function checkCanSubmit() {
  const titleLength = get('#title-input').value.length;
  const captionLength = get('#caption-input').value.length;
  const inputLength = get('#img-upload').files.length;
  get('#add').disabled = titleLength < 1 || captionLength < 1 || inputLength === 0;
  console.log(get('#add').disabled);
}