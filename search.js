document.getElementById("search").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const bookButtons = document.querySelectorAll(".book-button");

    bookButtons.forEach(button => {
        const bookTitle = button.textContent.toLowerCase();
        if (bookTitle.includes(query)) {
            button.style.display = "block"; // Показуємо, якщо відповідає пошуку
        } else {
            button.style.display = "none"; // Ховаємо, якщо не відповідає
        }
    });
});
