const uploadLabel = get('#file-selector-label');
const fileInput = get('#img-upload');
const imgsOnDomElem = get('#card-area');
const addToCardArea = get('#add');
const reader = new FileReader();

const images = (() => {
  const imagesArray = [];
  let tempImg = 1;
  let nextId = 0;
  return () => {
    return {
      add: (inUrl) => {
        const lastElementIndex = imagesArray.length - 1;
        if (imagesArray.length === 0) {
          nextId = 0;
        } else {
          nextId = imagesArray[lastElementIndex].id + 1;
        }
        const title = get('#title-input').value;
        const caption = get('#caption-input').value;
        // console.log(inUrl);
        const newImg = new Photo(nextId, title, caption, inUrl, false);
        //add to temp
        tempImg = newImg;
      },
      remove: 'remove from local storage and datamodel',
      update: 'update local storage and datamodel',
      get: () => (imagesArray),
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
  let tempImgsArr = JSON.parse(localStorage.getItem('imgs'));
  console.log('loaded', tempImgsArr);
}
uploadLabel.addEventListener('click', e => {
  e.preventDefault();
  fileInput.click();
})
addToCardArea.addEventListener('click', e => {
  images().publish();
  e.preventDefault();
})

fileInput.addEventListener('change', () => {
  upload(fileInput.files);
})

reader.addEventListener('load', () => images().add(reader.result))

function upload(files) {
  console.log('upload called');
  reader.readAsDataURL(get('#img-upload').files[0]);
}



function addToDOM(img) {
  const newIdea = document.createElement('section');

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
    <span class="card-trash"><i class="fas fa-trash-alt"></i></span>
    <span class="card-fav"><i class="fas fa-heart"></i></span>
  </footer>`;
  get('#card-area').prepend(newIdea);
}

function get(elem) {
  return document.querySelector(elem);
}