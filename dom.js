const STORAGE_KEY = "BOOK_LIST_KEY";

function IsExistStorage() {
    return typeof Storage !== "undefined";
}
window.addEventListener("load", function () {
    if (IsExistStorage) {
        if (localStorage.getItem(STORAGE_KEY) !== null) {
            const bookData = GetBookList();
            RenderBookList(bookData);
        }
    } else {
        alert("Browser yang Anda gunakan tidak mendukung Web Storage");
    }
});

function PutBookList(data) {
    if (IsExistStorage()) {
        const bookData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const newBookData = bookData.concat(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookData));
    }
}
  