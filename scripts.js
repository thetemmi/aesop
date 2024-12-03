// Список книг і їхні файли
const books = [
    { title: "Кобзар", file: "kobzar.txt" },
    { title: "Мурашка й Цикада", file: "murashka.txt" },
    { title: "Біблія", file: "bible.txt" },
    { title: "Комета прилітає", file: "comet.txt" }
];

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

// Функція для завантаження книги
async function loadBook(filePath) {
    const titleElement = document.getElementById('title');
    const authorElement = document.getElementById('author');
    const textElement = document.getElementById('text');
    const nextButton = document.getElementById('next-page-button');
    const prevButton = document.getElementById('prev-page-button');

    // Очищення полів перед завантаженням
    titleElement.textContent = 'Завантаження...';
    authorElement.textContent = '';
    textElement.textContent = '';

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Не вдалося завантажити файл: ${filePath}`);
        const bookText = await response.text();

        // Розділити текст на назву, автора і вміст
        const [title, author, ...content] = bookText.split('\n');
        titleElement.textContent = title.replace('Назва: ', '') || 'Без назви';
        authorElement.textContent = author.replace('Автор: ', '') || 'Невідомий автор';
        bookContent = content.join('\n').trim().split(""); // Розділяємо текст на символи

        currentPage = 0; // Скидаємо номер поточної сторінки
        showPage(); // Показуємо першу сторінку
        updatePageStatus(); // Оновлюємо статус сторінок

        nextButton.style.display = 'block'; // Показуємо кнопку "Наступна сторінка"
        prevButton.style.display = 'none'; // Ховаємо кнопку "Попередня сторінка" для першої сторінки
    } catch (error) {
        titleElement.textContent = 'Помилка';
        authorElement.textContent = '';
        textElement.textContent = 'Не вдалося завантажити текст книги.';
        console.error(error.message);
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

// Функція для динамічного створення кнопок книг
function generateBookLinks() {
    const bookLinksContainer = document.getElementById('book-links');
    
    // Очищаємо попередні кнопки
    bookLinksContainer.innerHTML = '';

    books.forEach(book => {
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'book-link';
        link.textContent = book.title;
        link.onclick = () => loadBook(book.file);
        bookLinksContainer.appendChild(link);
    });
}

// Фільтрація книг на основі пошукового запиту
function filterBooks() {
    const query = document.getElementById('search').value.toLowerCase();
    const bookLinksContainer = document.getElementById('book-links');

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
}

// Додати обробник події для пошуку
document.getElementById('search').addEventListener('input', filterBooks);

// Завантажити першу книгу при завантаженні сторінки
// Функція для отримання параметра з URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Завантаження книги на основі параметра "book"
window.onload = () => {
    const bookKey = getQueryParam('book'); // Отримуємо значення параметра book
    if (bookKey) {
        const selectedBook = books.find(book => book.file.includes(bookKey));
        if (selectedBook) {
            loadBook(selectedBook.file); // Завантажуємо відповідну книгу
        } else {
            alert('Книга не знайдена!');
        }
    } else {
        generateBookLinks(); // Якщо параметр не задано, показуємо список книг
    }
};

