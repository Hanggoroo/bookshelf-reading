const informBook = document.getElementById("inputBook");

informBook.addEventListener("submit", function (event) {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const completed = document.getElementById("inputBookIsComplete").checked;

    const id = Date.now();
    const newBook = {
        id: id,
        title: title,
        author: author,
        year: year,
        completed: completed,
    };

    const bookData = GetBookList();
    const bookIndex = document.getElementById("inputBookTitle").name;
    if (bookIndex !== '') {
        for (let index = 0; index < bookData.length; index++) {
            if (bookData[index].id == bookIndex) {
                bookData[index].title = title;
                bookData[index].author = author;
                bookData[index].year = year;
                bookData[index].completed = completed;
            }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
        RefreshForm();
        RenderBookList(bookData);
        return;
    }
    PutBookList(newBook);

});

function RenderBookList(bookData) {
    const boxIncomplete = document.getElementById("incompleteBookshelfList");
    const boxComplete = document.getElementById("completeBookshelfList");

    boxIncomplete.innerHTML = "";
    boxComplete.innerHTML = "";

    if (!bookData || bookData.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.innerText = "Tidak ada buku";
        boxIncomplete.appendChild(emptyMessage);
        boxComplete.appendChild(emptyMessage.cloneNode(true));
        return;
    }

    bookData.forEach((book) => {
        const { id, title, author, year, completed } = book;

        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item", "select_item");
        bookItem.innerHTML = `<h3 name="${id}">${title}</h3>
                              <p>Penulis: ${author}</p>
                              <p>Tahun: ${year}</p>`;

        const containerActionItem = document.createElement("div");
        containerActionItem.classList.add("action");

        const greenButton = CreateGreenButton(book, (event) => {
            isCompleteBookHandler(event.target.parentElement.parentElement);

            const bookData = GetBookList();
            RefreshForm();
            RenderBookList(bookData);
        });

        const redButton = CreateRedButton((event) => {
            RemoveBook(event.target.parentElement.parentElement);

            const bookData = GetBookList();
            RefreshForm();
            RenderBookList(bookData);
        });

        containerActionItem.append(greenButton, redButton);

        bookItem.append(containerActionItem);

        if (!completed) {
            boxIncomplete.append(bookItem);
        } else {
            boxComplete.append(bookItem);
        }
    });
}

function CreateGreenButton(book, eventListener) {
    const completeBook = book.completed ? "Belum selesai" : "Selesai";

    const greenButton = document.createElement("button");
    greenButton.classList.add("green");
    greenButton.innerText = `${completeBook} di Baca`;
    greenButton.addEventListener("click", (event) => eventListener(event));
    return greenButton;
}

function CreateRedButton(eventListener) {
    const redButton = document.createElement("button");
    redButton.classList.add("red");
    redButton.innerText = "Hapus buku";
    redButton.addEventListener("click", (event) => eventListener(event));
    return redButton;
}

function isCompleteBookHandler(bookElement) {
    const bookData = GetBookList();
    if (bookData.length === 0) {
        return;
    }

    const title = bookElement.childNodes[0].innerText;
    const titleNameAttribut = bookElement.childNodes[0].getAttribute("name");
    for (let index = 0; index < bookData.length; index++) {
        if (bookData[index].title === title && bookData[index].id == titleNameAttribut) {
            bookData[index].completed = !bookData[index].completed;
            break;
        }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
}

function SearchBookList(title) {
    const bookData = GetBookList();
    if (bookData.length === 0) {
        return;
    }

    const bookList = [];


    for (let index = 0; index < bookData.length; index++) {
        const tempTitle = bookData[index].title.toLowerCase();
        const tempTitleTarget = title.toLowerCase();
        if (bookData[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
            bookList.push(bookData[index]);
        }
    }
    return bookList;
}


function GreenButtonHandler(parentElement) {
    let book = isCompleteBookHandler(parentElement);
    book.completed = !book.isComplete;
}

function GetBookList() {
    if (IsExistStorage) {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    }
    return [];
}

function RemoveBook(bookElement) {
    const bookData = GetBookList();
    if (bookData.length === 0) {
        return;
    }

    const titleNameAttribut = bookElement.childNodes[0].getAttribute("name");
    for (let index = 0; index < bookData.length; index++) {
        if (bookData[index].id == titleNameAttribut) {
            bookData.splice(index, 1);
            break;
        }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
}

searchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    const bookData = GetBookList();
    if (bookData.length === 0) {
        return;
    }

    const title = document.getElementById("searchBookTitle").value;
    const bookList = title ? SearchBookList(title) : bookData;
    RenderBookList(bookList);
});


function RefreshForm() {
    const inputFields = document.querySelectorAll('.form-input');
    inputFields.forEach((field) => field.value = '');
    const checkbox = document.getElementById("inputBookIsComplete");
    checkbox.checked = false;
    const searchField = document.getElementById("searchBookTitle");
    searchField.value = "";
}

const checkBoxs = document.getElementById('inputBookIsComplete');
const textSubmits = document.getElementById('textcomplete');

inputBookIsComplete.addEventListener('change', function () {
    if (checkBoxs.checked) {
        textSubmits.innerText = 'Sudah selesai dibaca';
    } else {
        textSubmits.innerText = 'Belum selesai dibaca';
    }
});