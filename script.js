let orderNumber = 1;

// Оновлення даних у localStorage
function updateLocalStorage() {
    const table = document.getElementById("dataTable");
    const rows = table.querySelectorAll("tr");
    const data = [];
    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        const rowData = [];
        cells.forEach((cell, index) => {
            if (index < cells.length - 1) {
                rowData.push(cell.textContent); // Дані всіх колонок, окрім статусу
            } else {
                const select = cell.querySelector("select");
                rowData.push(select.value); // Статус
            }
        });
        data.push(rowData);
    });
    localStorage.setItem("tableData", JSON.stringify(data));
}

// Завантаження даних із localStorage
function loadTableFromLocalStorage() {
    const storedData = localStorage.getItem("tableData");
    if (storedData) {
        const data = JSON.parse(storedData);
        const table = document.getElementById("dataTable");
        table.innerHTML = ""; // Очищення таблиці перед завантаженням

        data.forEach((rowData) => {
            const newRow = table.insertRow();
            rowData.forEach((item, index) => {
                const cell = newRow.insertCell();
                if (index === rowData.length - 1) {
                    // Останній стовпець - статус
                    const statusSelect = document.createElement("select");
                    statusSelect.innerHTML = `
                        <option value="Отримано клієнтом" ${
                            item === "Отримано клієнтом" ? "selected" : ""
                        }>Отримано клієнтом</option>
                        <option value="Завершено" ${
                            item === "Завершено" ? "selected" : ""
                        }>Завершено</option>
                        <option value="Отримано" ${
                            item === "Отримано" ? "selected" : ""
                        }>Отримано</option>
                    `;
                    statusSelect.addEventListener("change", () => {
                        updateStatus(statusSelect);
                        updateLocalStorage();
                    });
                    cell.appendChild(statusSelect);
                    updateStatus(statusSelect);
                } else {
                    cell.textContent = item; // Інші дані
                }
            });
        });

        orderNumber = data.length + 1; // Оновлення номеру замовлення
    }
}

// Відкриття форми
function openFormWindow() {
    const formWindow = window.open("", "FormWindow", "width=600,height=400");
    formWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Форма введення</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                label { display: block; margin: 10px 0 5px; }
                input { width: 100%; padding: 8px; margin-bottom: 10px; }
                button { padding: 10px 20px; margin-top: 10px; cursor: pointer; }
            </style>
        </head>
        <body>
            <h2>Заповніть дані</h2>
            <form id="dataForm">
                <label for="column1">Ім'я та прізвище:</label>
                <input type="text" id="column1">

                <label for="column2">Ціна:</label>
                <input type="number" id="column2">

                <label for="column3">Виробник:</label>
                <input type="text" id="column3">

                <label for="column4">Серійний номер:</label>
                <input type="text" id="column4">

                <label for="column5">Опис:</label>
                <input type="text" id="column5">

                <label for="column6">Номер телефону:</label>
                <input type="number" id="column6">

                <label for="column7">Тип:</label>
                <input type="text" id="column7">

                <label for="column8">Модель:</label>
                <input type="text" id="column8">

                <button type="button" onclick="submitData()">Додати</button>
            </form>

            <script>
                function submitData() {
                    const data = [];
                    for (let i = 1; i <= 8; i++) {
                        const value = document.getElementById("column" + i).value;
                        data.push(value);
                    }
                    window.opener.receiveData(data);
                    window.close();
                }
            </script>
        </body>
        </html>
    `);
}

// Прийом даних із форми
function receiveData(data) {
    const table = document.getElementById("dataTable");
    const newRow = table.insertRow();
    const orderCell = newRow.insertCell();
    orderCell.textContent = orderNumber++;

    data.forEach((item) => {
        const cell = newRow.insertCell();
        cell.textContent = item;
    });

    const statusCell = newRow.insertCell();
    const statusSelect = document.createElement("select");
    statusSelect.innerHTML = `
        <option value="Отримано клієнтом">Отримано клієнтом</option>
        <option value="Завершено">Завершено</option>
        <option value="Отримано">Отримано</option>
    `;
    statusCell.appendChild(statusSelect);

    statusSelect.addEventListener("change", () => {
        updateStatus(statusSelect);
        updateLocalStorage();
    });

    updateStatus(statusSelect);
    updateLocalStorage();
}

// Оновлення статусу (колір рядка)
function updateStatus(select) {
    const row = select.closest("tr");
    const status = select.value;

    row.style.backgroundColor = ""; // Скидаємо стиль

    if (status === "Завершено") {
        row.style.backgroundColor = "red";
    } else if (status === "Отримано клієнтом") {
        row.style.backgroundColor = "green";
    }
}

// Пошук
function searchData() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#dataTable tr");

    rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll("td"));
        const match = cells.some((cell) =>
            cell.textContent.toLowerCase().includes(searchValue)
        );
        row.style.display = match ? "" : "none";
    });
}

// Завантаження таблиці
window.onload = loadTableFromLocalStorage;
