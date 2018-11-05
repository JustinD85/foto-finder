const uploadButton = get('#file-selector-label');
const fileInput = get('#img-upload');
const cardArea = get('#card-area');
const addCardButton = get('#add');
const reader = new FileReader();
const reader2 = new FileReader();
const favButton = get('.card-fav');
const viewFavButton = get('#fav-button');

const images = (() => {
  const imagesArray = [];
  let tempImg = 0;
  let nextId = 0;
  let changeImgId = 0;
  return () => {
    return {
      add: (url) => {
        const lastElementIndex = imagesArray.length - 1;
        if (imagesArray.length > 0) {
          nextId = parseInt(imagesArray[lastElementIndex].id) + 1;
        }
        const title = get('#title-input').value;
        const caption = get('#caption-input').value;
        const newImg = new Photo(nextId, title, caption, url, false);
        tempImg = newImg;
      },
      remove: (inId) => {
        const tempIndex = imagesArray.findIndex(obj => obj.id == inId);
        imagesArray[tempIndex].deleteFromStorage(imagesArray, tempIndex);
      },
      src: {
        get: changeImgId,
        set: (inId) => changeImgId = inId
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

addCardButton.addEventListener('click', e => {
  e.preventDefault();
  images().publish();
});

fileInput.addEventListener('change', () => {
  checkCanSubmit();
  upload(fileInput.files);
});

get('#img-change').addEventListener('change', () => {
  console.log(get('#img-change').files)
  upload(get('#img-change').files, true);
})
reader.addEventListener('load', () => images().add(reader.result));
reader2.addEventListener('load', () => {
  changeCardImg(images().src.get, reader2.result);
});

function changeCardImg(id, src) {
  get(`.card[data-id='${id}'] img`).src = src;

  images().asArray()[findIndex(id)].updatePhoto(src, images().asArray());
  // images().asArray[findIndex(id)]
}

function findIndex(inId) {
  return images().asArray().findIndex(obj => obj.id == inId);
}
cardArea.addEventListener('click', (e) => {
  //Favorite behaviour
  if (e.target.closest('.card-fav')) {
    const inId = e.target.closest('.card').dataset.id;
    const atThisIndex = images().asArray().findIndex(e => e.id == inId);
    const isFav = get(`.card[data-id='${inId}'] .card-fav`).attributes.src.value !== 'imgs/favorite-active.svg';

    e.target.src = e.target.attributes.src.value == 'imgs/favorite-active.svg' ?
      'imgs/favorite.svg' : 'imgs/favorite-active.svg';
    /*
        function(inId){
          const atThisIndex = images().asArray().findIndex(e => e.id == inId);
          const cardId = get(`.card[data-id='${cardId}']).dataset.id;
          const title = get(`.card[data-id='${cardId}'] .card-title`).innerText;
          const caption = get(`.card[data-id='${cardId}'] .card-desc`).innerText;
          const isFav = get(`.card[data-id='${inId}'] .card-fav`).attributes.src.value !== 'imgs/favorite-active.svg'; 
          
        }
    */
    //this will be update self function
    images().asArray()[atThisIndex].favorite = isFav;
    updateFavButton();
    images().asArray()[atThisIndex].saveToStorage(images().asArray());
  }
  if (e.target.closest('.card-trash')) {
    e.target.src = e.target.attributes.src.value == 'imgs/delete-active.svg' ?
      'imgs/delete.svg' : 'imgs/delete-active.svg';
  }

  if (e.target.closest('.card-img')) {
    images().src.set(e.target.closest('.card').dataset.id);
    get('#img-change').click();
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
        oldCard.saveToStorage(images().asArray());
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
        oldCard.saveToStorage(images().asArray());
      }
    });
  }
}

function upload(files, changingImg) {
  console.log(files[0])
  if (!changingImg) {
    reader.readAsDataURL(files[0]);
  } else {
    reader2.readAsDataURL(get('#img-change').files[0]);
  }
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
  return !get('#add').disabled;
}