// Список книг і їхні файли
const books = [
    { title: "Кобзар", file: "kobzar.txt" },
    { title: "Мурашка й Цикада", file: "murashka.txt" },
    { title: "Комета прилітає", file: "comet.txt" }
];

// Ліміт символів на сторінку
const PAGE_LIMIT = 2000; // Кількість символів, яка повинна бути на одній сторінці

let currentPage = 0;
let bookContent = [];

// Функція для завантаження книги
async function loadBook(filePath) {
    const titleElement = document.getElementById('title');
    const authorElement = document.getElementById('author');
    const textElement = document.getElementById('text');
    const pageButton = document.getElementById('page-button');

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

        pageButton.style.display = 'block'; // Показуємо кнопку "Нова сторінка"
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

    // Якщо ми досягли кінця книги, приховуємо кнопку "Нова сторінка"
    if (end >= bookContent.length) {
        document.getElementById('page-button').style.display = 'none';
    }
}

// Функція для переходу на наступну сторінку
function nextPage() {
    if ((currentPage + 1) * PAGE_LIMIT < bookContent.length) {
        currentPage++;
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

// Завантажити першу книгу при завантаженні сторінки
window.onload = () => {
    generateBookLinks(); // Генеруємо кнопки для книг
    loadBook(books[0].file); // Завантажуємо першу книгу
};
