const uploadButton = get('#file-selector-label');
const fileInput = get('#img-upload');
const cardArea = get('#card-area');
const addCardButton = get('#add');
const favButton = get('.card-fav');
const viewFavButton = get('#fav-button');
const searchEle = get('#search');
const showMoreLessBtn = get('.show-more')

const reader = new FileReader();
const reader2 = new FileReader();
const images = imagesClass();

// addClickEvent(uploadButton, clickFileInput);
// function addClickEvent(ele,action) {
//   ele.addEventListener('click', action)
// }

window.onload = init;
addCardButton.addEventListener('click', publishImage);
//If you press delete, but don't release, reset svg
cardArea.addEventListener('mouseout', mouseOut);
//The actual delete, if a legal press
cardArea.addEventListener('mouseup', (e) => mouseUpCanDelete(e));
cardArea.addEventListener('click', clickedCardArea);
cardArea.addEventListener('mousedown', mouseDown);
cardArea.addEventListener('focusout', editPhotoText);
cardArea.addEventListener('keypress', editPhotoText);
fileInput.addEventListener('change', uploadFile);
reader.addEventListener('load', () => images().add(reader.result));
reader2.addEventListener('load', () => changeCardImg(images().get, reader2.result));
searchEle.addEventListener('keyup', search)
viewFavButton.addEventListener('click', (filterFavs));
uploadButton.addEventListener('click', clickFileInput);
get('#img-change').addEventListener('change', imageSwap)
get('body').addEventListener('click', clickedBody); //will refactor
getAll('.input-criteria').forEach(e => {
  e.addEventListener('keyup', () => {
    checkCanSubmit();
  })
});

function arrFunctionality(imagesVariables, imagesArray) {
  return {
    add: (inUrl) => imagesVariables[0].tempImg = stage(inUrl),
    remove: (inId) => remove(inId),
    get: imagesVariables[1].changeImgId,
    set: (src) => imagesVariables[1].changeImgId = src,
    asArray: () => (imagesArray),
    publish: () => publish(imagesVariables, imagesArray)
  }
}

function checkNoCards() {
  if (get('#card-area').childElementCount < 1) {
    const newEle = document.createElement('h1');
    newEle.classList.add('text-c');
    newEle.innerText = 'Add Photos!';
    get('#card-area').appendChild(newEle);
  }
}

function clickedBody(e) {
  if (e.target.closest('.show-more-or-less')) {
    console.log('hey')
    showMoreOrLess(e);
  }
}

function clickedCardArea(e) {
  if (e.target.closest('.card-fav')) clickedFavButton(e);
  if (e.target.closest('.card-trash')) clickedDeleteButton(e);
  if (e.target.closest('.card-img')) clickedCardImg(e);
}

function clickedCardImg(e) {
  images().set(e.target.closest('.card').dataset.id);
  get('#img-change').click();
}

function clickedDeleteButton(e) {
  e.target.src = e.target.attributes.src.value == 'imgs/delete-active.svg' ?
    'imgs/delete.svg' : 'imgs/delete-active.svg';
}

function clickedFavButton(e) {
  const inId = e.target.closest('.card').dataset.id;
  const atThisIndex = images().asArray().findIndex(e => e.id == inId);
  const isFav = get(`.card[data-id='${inId}'] .card-fav`).attributes.src.value !== 'imgs/favorite-active.svg';
  e.target.src = e.target.attributes.src.value == 'imgs/favorite-active.svg' ?
    'imgs/favorite.svg' : 'imgs/favorite-active.svg';
  images().asArray()[atThisIndex].favorite = isFav;
  updateFavButton();
  images().asArray()[atThisIndex].saveToStorage(images().asArray());
}

function clickFileInput(e) {
  e.preventDefault();
  fileInput.click();
}

function imagesClass() {
  const imagesArray = [];
  const imagesVariables = [{
    tempImg: 0
  }, {
    changeImgId: 0
  }]
  return () => {
    return arrFunctionality(imagesVariables, imagesArray);
  }
}

function imageSwap() {
  upload(get('#img-change').files, true);
}

function init() {
  loadLocalStorage();
  showOnlyTen();
  checkNoCards();
  updateFavButton();
}

function filterFavs(e) {
  e.preventDefault();
  removeCardsFromDOM();
  if (viewFavButton.innerText.includes('View')) {
    showFavorite();
    viewFavButton.innerText = 'Show All';
  } else {
    updateFavButton();
    showAll();
  }
}

function loadLocalStorage() {
  if (localStorage.getItem('imgs') !== null) {
    const tempImgsArr = JSON.parse(localStorage.getItem('imgs'));
    tempImgsArr.forEach(ele => {
      const tempCard = new Photo(ele.id, ele.title, ele.caption, ele.file, ele.favorite);
      images().asArray().push(tempCard);
    });
  }
}

function mouseDown(e) {
  if (e.target.closest('.card-trash')) {
    e.target.src = e.target.attributes.src.value == 'imgs/delete-active.svg' ?
      'imgs/delete.svg' : 'imgs/delete-active.svg';
  }
}

function mouseOut(e) {
  if (clicked.target.closest('.card-trash')) {
    clicked.target.src = 'imgs/delete.svg';
  }
}

function mouseUpCanDelete(e) {
  if (e.target.closest('.card-trash') &&
    e.target.attributes.src.value === 'imgs/delete-active.svg') {
    images().remove(e.target.closest('.card').dataset.id);
    e.target.closest('.card').remove();
    checkNoCards();
  }
  updateFavButton();
}

function publishImage(e) {
  e.preventDefault();
  images().publish();
}

function search() {
  removeCardsFromDOM();
  const isNotFavView = viewFavButton.innerText.includes('View');
  if (isNotFavView) {
    showAll();
  } else {
    showFavorite();
  }
  showFiltered();
}

function showOnlyTen() {
  removeCardsFromDOM();
  images().asArray().filter((idea, index) => {
    return index >= images().asArray().length - 10;
  }).forEach(idea => addToDOM(idea));
}

function showAll() {
  images().asArray().forEach(e => addToDOM(e));
}

function showFiltered() {
  getAll('.card').forEach(elem => {
    !elem.innerText.includes(event.target.value) &&
      elem.closest('.card').remove();
  });
}

function showFavorite() {
  const favCards = images().asArray().filter(e => {
    return e.favorite;
  })
  favCards.forEach(e => addToDOM(e));
}

function uploadFile(e) {
  checkCanSubmit();
  upload(fileInput.files);
}

function updateFavButton() {
  const favs = images().asArray().filter(e => e.favorite === true).length;
  viewFavButton.innerText = `View ${favs} Favorites`;
}

function publish(imagesVariables, imagesArray) {
  get('#card-area').innerHTML = '';
  if (imagesVariables[0].tempImg) {
    imagesArray.push(imagesVariables[0].tempImg);
  }
  imagesVariables[0].tempImg.saveToStorage(imagesArray);
  imagesArray.forEach(e => {
    addToDOM(e)
    checkCanSubmit();
  });
  clearUpload();
}

function clearUpload() {
  fileInput.value = '';
}

function remove(inId) {
  const imgArr = images().asArray();
  const tempIndex = findIndex(inId);
  imgArr[tempIndex].deleteFromStorage(imgArr, tempIndex);
}

function stage(url) {
  const lastElementIndex = images().asArray().length - 1;
  let nextId = 0;
  if (images().asArray().length > 0) {
    nextId = parseInt(images().asArray()[lastElementIndex].id) + 1;
  }
  const title = get('#title-input').value;
  const caption = get('#caption-input').value;
  const newImg = new Photo(nextId, title, caption, url, false);
  return newImg;
}

function showMore(e) {
  removeCardsFromDOM();
  images().asArray().forEach(img => addToDOM(img));
  get('.show-more-button').classList.value = 'show-less-button';
  get('.show-less-button').innerText = 'Show Less';
  updateFavButton();
}

function showLess(e) {
  showOnlyTen();
  get('.show-less-button').classList.value = 'show-more-button';
  get('.show-more-button').innerText = 'Show More';
  updateFavButton();
}

function showMoreOrLess(e) {
  if (e.target.classList.contains('show-more-button')) {
    showMore(e)
  } else if (e.target.classList.contains('show-less-button')) {
    showLess(e)
  }
  return true;
}

function removeCardsFromDOM() {
  get('#card-area').innerHTML = '';
}

function changeCardImg(id, src) {
  get(`.card[data-id='${id}'] img`).src = src;
  images().asArray()[findIndex(id)].updatePhoto(src, images().asArray());

}

function findIndex(inId) {
  return images().asArray().findIndex(obj => obj.id == inId);
}

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
  <p class="card-title searchable" maxlength="20" contenteditable="true">${img.title}</p>
  <img src="${img.file}"  alt="images upload from users" class="card-img">
  <p class="card-desc searchable" maxlength="100" contenteditable="true">${img.caption}</p>
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