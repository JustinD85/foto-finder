const uploadLabel = get('#file-selector-label');
const fileInput = get('#img-upload');
const cardArea = get('#card-area');
const addToCardArea = get('#add');
const reader = new FileReader();
const favButton = get('.card-fav');
const viewFavButton = get('#fav-button');

const images = (() => {
  const imagesArray = [];
  let tempImg = 0;
  let snextId = 0;
  return () => {
    return {
      add: (inUrl) => {
        const lastElementIndex = imagesArray.length - 1;
        if (imagesArray.length !== 0) {
          nextId = imagesArray[lastElementIndex].id + 1;
        }
        const title = get('#title-input').value;
        const caption = get('#caption-input').value;
        const newImg = new Photo(nextId, title, caption, inUrl, false);
        tempImg = newImg;
      },
      remove: (inId) => {
        console.log(inId)
        const tempIndex = imagesArray.findIndex(obj => obj.id === inId);
        imagesArray.splice(tempIndex, 1);
        imagesArray[tempIndex].deleteFromStorage(imagesArray);
      },
      update: (inId) => {
        const tempIndex = imagesArray.findIndex(obj => obj.id === parseInt(inId));
        // imagesArray[tempIndex].
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
    console.log('# objs loaded', tempImgsArr);
  }
  favs = images().asArray().filter(e => e.favorite === true).length;
  viewFavButton.innerText = `View ${favs} Favorites`;
}

uploadLabel.addEventListener('click', e => {
  e.preventDefault();
  fileInput.click();
});

addToCardArea.addEventListener('click', e => {
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
    const cardTitle = get(`.card[data-id='${inId}'] .card-title`).innerText;
    const cardDesc = get(`.card[data-id='${inId}'] .card-desc`).innerText;
    const cardFile = get(`.card[data-id='${inId}'] .card-img`).src;
    const isFav = get(`.card[data-id='${inId}'] .card-fav`).attributes.src.value !== 'imgs/favorite-active.svg';
    let favs;
    e.target.src = e.target.attributes.src.value == 'imgs/favorite-active.svg' ?
      'imgs/favorite.svg' : 'imgs/favorite-active.svg';

    //this will be update self function
    images().asArray()[atThisIndex] = new Photo(inId, cardTitle, cardDesc, cardFile, isFav);
    favs = images().asArray().filter(e => e.favorite === true).length;
    viewFavButton.innerText = `View ${favs} Favorites`;
  }
  if (e.target.closest('.card-trash')) {
    e.target.src = e.target.attributes.src.value == 'imgs/delete-active.svg' ?
      'imgs/delete.svg' : 'imgs/delete-active.svg';
  }
})

//Delete Behaviour
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
});


function upload(files) {
  console.log('upload called');
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
  <p class="card-title">${img.title}</p>
  <img src="${img.file}" alt="images upload from users" class="card-img">
  <p class="card-desc">${img.caption}</p>
  <footer>
    <img class="card-trash" src="imgs/delete.svg" alt="Trash, to delete photo">
    <img class="card-fav" src="imgs/${tempFav}" alt="A button to like the photo">
  </footer>`;
  get('#card-area').prepend(newIdea);
}

function get(elem) {
  return document.querySelector(elem);
}