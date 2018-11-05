class Photo {
  constructor(inId, inTitle, inCaption, inURL, inFav) {
    this.id = inId;
    this.title = inTitle;
    this.caption = inCaption;
    this.file = inURL || 'nothing';
    this.favorite = inFav || false;
  }

  saveToStorage(imgArr, isNew) {
    localStorage.setItem('imgs', JSON.stringify(imgArr));
  }

  deleteFromStorage(imgArr, index) {
    imgArr.splice(index, 1);
    this.saveToStorage(imgArr);
  }

  updatePhoto(inFile, imgArr) {
    this.file = inFile;
    this.saveToStorage(imgArr);
  }
}