class Photo {
  constructor(inId, inTitle, inCaption, inURL, inFav) {
    this.id = inId;
    this.title = inTitle;
    this.caption = inCaption;
    this.file = inURL;
    this.favorite = inFav || false;
  }

  saveToStorage(imgArr, isNew) {
    localStorage.setItem('imgs', JSON.stringify(imgArr));
  }
  deleteFromStorage(imgArr, index) {
    imgArr.splice(index, 1);
    this.saveToStorage(imgArr);
  }
  updatePhoto(title, imgUrl, caption, isFav) {
    this.title = title;
    this.file = imgUrl;
    this.caption = caption;
    this.favorite = isFav || false;
  }
}