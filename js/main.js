const uploadLabel = get('#file-selector-label');
const fileInput = get('#img-upload');
const imgsOnDomElem = get('#card-area');
const addToCardArea = get('#add')

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
        const newImg = new Photo(nextId, title, caption, inUrl, false);
        //add to temp
        tempImg = newImg;
      },
      remove: 'remove from local storage and datamodel',
      update: 'update local storage and datamodel',
      get: () => (imagesArray),
      publish: () => {
        console.log('clearing!');
        get('#card-area').innerHTML = '';
        if (tempImg) {
          imagesArray.push(tempImg);
        }
        tempImg.saveToStorage(imagesArray);
        imagesArray.forEach(e => {

          addToDOM(e)
        })
        // fetchimage();
      }
    }
  }
})();

uploadLabel.addEventListener('click', e => {
  e.preventDefault();
  fileInput.click();
})
addToCardArea.addEventListener('click', e => {
  e.preventDefault();
  images().publish();
})



fileInput.addEventListener('change', () => {
  upload(fileInput.files);
})
// get('body').addEventListener('click', (e) => {
//   console.log(e.target.htmlFor);
//   if (e.target.classList.contains('add')) {
//     
//   }

//   e.preventDefault();
// })
// uploadLabel.addEventListener('click', function (e) {

//   if (e.target.htmlFor === 'img-upload') {
//     fileInput.click();
//   };

// });




function upload(files) {
  console.log('upload called')
  // img.file = get('#img-upload').files[0];
  // img.classList.add('obj');
  // get('#card-area').prepend(img);
  // var reader = new FileReader();
  // reader.onload = (function (aImg) {
  //   return function (e) {
  //     console.log('hey')
  //     aImg.src = e.target.result;
  //     img.src = e.target.result;
  //   };
  // });
  // reader.readAsDataURL(get('#img-upload').files[0]);
  //Pass in blob instead
  var img = document.createElement("img");
  // console.log(files[0])
  img.src = URL.createObjectURL(get('#img-upload').files[0]);
  // reader = new FileReader();
  // blob = new Blob([img], {
  //   type: 'img/jpg'
  // });
  // reader.readAsArrayBuffer(blob);
  // consreader.value
  // console.log(img)
  console.log('base called', getBase64Image(img))
  images().add(img.src);
  // img.onload = function () {
  //   window.URL.revokeObjectURL(this.src);
  // }

  // fileInput.value = '';
}



function addToDOM(img) {
  const newIdea = document.createElement('section');
  // const title = get('#title-input').value;
  // const caption = get('#caption-input').value;

  get('#title-input').value = '';
  get("#caption-input").value = '';
  console.log(img.file)
  newIdea.classList.add('card');
  newIdea.dataset.id
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

function getBase64Image(img) {
  // imgCanvas = document.createElement('canvas');
  // imgContext = imgCanvas.getContext('2d');
  // imgCanvas.width = 180;
  // imgCanvas.height = 240;

  // imgContext.drawImage(img, 0, 0, img.width, img.height);
  // const imgAsDURL = imgCanvas.toDataURL('image/png');
  // localStorage.setItem('ii', imgAsDURL);

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  context.drawImage(img, 0, 0); // i assume that img.src is your blob url
  var dataurl = canvas.toDataURL("img/png");
  return dataurl;
}