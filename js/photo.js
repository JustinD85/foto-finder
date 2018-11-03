class Photo {
  constructor(inId, inTitle, inCaption, inURL, inFav) {
    this.id = inId;
    this.title = inTitle;
    this.caption = inCaption;
    this.file = inURL;
    this.favorite = inFav || false;
  }

  saveToStorage() {

  }
  deleteFromStorage() {

  }
  updatePhoto() {

  }
}