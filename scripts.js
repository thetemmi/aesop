// Ліміт символів на сторінку
const PAGE_LIMIT = 2000; // Кількість символів на одній сторінці

let currentPage = 0;
let bookContent = [];

// Функція для оновлення статусу сторінок
function updatePageStatus() {
    const pageStatusElement = document.getElementById('page-status');
    const totalPages = Math.ceil(bookContent.length / PAGE_LIMIT);
    pageStatusElement.textContent = `Сторінка ${currentPage + 1} із ${totalPages}`;
}

// Функція для завантаження книг
async function loadBooks() {
    try {
        const response = await fetch('/api/books');
        const books = await response.json();
        
        const bookLinksContainer = document.getElementById('book-links');
        bookLinksContainer.innerHTML = '';

        books.forEach(book => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'book-link';
            link.textContent = book.title;
            link.onclick = () => loadBook(book.file);
            bookLinksContainer.appendChild(link);
        });
    } catch (error) {
        console.error('Помилка завантаження книг:', error);
        const bookLinksContainer = document.getElementById('book-links');
        bookLinksContainer.innerHTML = '<p>Не вдалося завантажити список книг</p>';
    }
}

// Модифікована функція завантаження книги
async function loadBook(filename) {
    try {
        const response = await fetch(`/api/book/${filename}`);
        const book = await response.json();

        document.getElementById('title').textContent = book.title;
        document.getElementById('author').textContent = book.author;
        
        // Логіка розбиття на сторінки
        bookContent = book.content.split('');
        currentPage = 0;
        showPage();
    } catch (error) {
        console.error('Помилка завантаження книги:', error);
        document.getElementById('title').textContent = 'Помилка';
        document.getElementById('text').textContent = 'Не вдалося завантажити книгу';
    }
}

// Функція для показу поточної сторінки
function showPage() {
    const textElement = document.getElementById('text');
    const start = currentPage * PAGE_LIMIT;
    const end = start + PAGE_LIMIT;
    const pageContent = bookContent.slice(start, end).join("");

    textElement.textContent = pageContent;

    updatePageStatus(); // Оновлення статусу сторінок

    const nextButton = document.getElementById('next-page-button');
    const prevButton = document.getElementById('prev-page-button');

    // Керування кнопками
    if (currentPage === 0) {
        prevButton.style.display = 'none';
    } else {
        prevButton.style.display = 'block';
    }

    if (end >= bookContent.length) {
        nextButton.style.display = 'none';
    } else {
        nextButton.style.display = 'block';
    }
}

// Функція для переходу на наступну сторінку
function nextPage() {
    if ((currentPage + 1) * PAGE_LIMIT < bookContent.length) {
        currentPage++;
        showPage();
    }
}

// Функція для переходу на попередню сторінку
function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        showPage();
    }
}

// Фільтрація книг на основі пошукового запиту
function filterBooks() {
    const query = document.getElementById('search').value.toLowerCase();
    const bookLinksContainer = document.getElementById('book-links');

    // Отримуємо всі книги знову
    fetch('/api/books')
        .then(response => response.json())
        .then(books => {
            bookLinksContainer.innerHTML = '';
            books
                .filter(book => book.title.toLowerCase().includes(query))
                .forEach(book => {
                    const link = document.createElement('a');
                    link.href = '#';
                    link.className = 'book-link';
                    link.textContent = book.title;
                    link.onclick = () => loadBook(book.file);
                    bookLinksContainer.appendChild(link);
                });
        })
        .catch(error => {
            console.error('Помилка пошуку:', error);
            bookLinksContainer.innerHTML = '<p>Помилка пошуку</p>';
        });
}

// Функція для отримання параметра з URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Основна функція ініціалізації при завантаженні сторінки
window.onload = () => {
    // Додаємо обробник події для пошуку
    document.getElementById('search').addEventListener('input', filterBooks);

    // Перевіряємо параметр книги в URL
    const bookKey = getQueryParam('book');
    if (bookKey) {
        // Спочатку завантажуємо список книг
        fetch('/api/books')
            .then(response => response.json())
            .then(books => {
                const selectedBook = books.find(book => book.file.includes(bookKey));
                if (selectedBook) {
                    loadBook(selectedBook.file);
                } else {
                    alert('Книга не знайдена!');
                    loadBooks(); // Показуємо список книг
                }
            })
            .catch(error => {
                console.error('Помилка:', error);
                loadBooks(); // Показуємо список книг у разі помилки
            });
    } else {
        // Якщо параметр не вказано, показуємо список книг
        loadBooks();
    }
};