const displayButton = document.getElementById('display-button');
displayButton.addEventListener('click', displayTable, false);

const rowDelimiterInput = document.getElementById('row-delimiter');
rowDelimiterInput.addEventListener('change', () => {
    updateParsedAllCsv();
    updateParsedARowCsv();
    saveCookies();
});

const rowNumInput = document.getElementById('row-num');
rowNumInput.addEventListener('change', () => {
    updateParsedARowCsv();
    saveCookies();
});

const columnDelimiterInput = document.getElementById('column-delimiter');
columnDelimiterInput.addEventListener('change', () => {
    updateParsedAllCsv();
    updateParsedAColumnCsv();
    saveCookies();
});

const columnNumInput = document.getElementById('column-num');
columnNumInput.addEventListener('change', () => {
    updateParsedAColumnCsv();
    saveCookies();
});

loadCookies();
// テーブルデータ
let tableData = [];
document.getElementById('input').value = '1|2|3|4|5\nあ|い|う|え|お';

displayTable();

function displayTable() {
    const inputText = document
        .getElementById('input')
        .value.replace('\r\n', '\n')
        .replace('\r', '\n');
    let lines = [];
    if (inputText.includes('\n')) {
        lines = inputText.split('\n');
    } else {
        lines.push(inputText);
    }

    tableData = [];
    lines.forEach((line) => {
        let splitedLine = [];
        if (line.includes('|')) {
            splitedLine = line.split('|');
        } else {
            splitedLine.push(line);
        }
        tableData.push(splitedLine);
    });

    const tableElem = document.createElement('table');
    tableElem.id = 'preview';

    tableData.forEach((row) => {
        const rowElem = document.createElement('tr');

        row.forEach((cell) => {
            const cellElem = document.createElement('td');
            cellElem.textContent = cell;
            rowElem.append(cellElem);
        });

        tableElem.append(rowElem);
    });

    const nowTableElem = document.getElementById('preview');
    nowTableElem.replaceWith(tableElem);

    updateParsedAllCsv();
    updateParsedARowCsv();
    updateParsedAColumnCsv();
}

function updateParsedAllCsv() {
    const rowDelimiterInput = document.getElementById('row-delimiter').value;
    const columnDelimiterInput = document.getElementById('column-delimiter').value;

    const rowDelimiter = rowDelimiterInput
        .replace('\\t', '\t')
        .replace('\\r', '\r')
        .replace('\\n', '\n');
    const columnDelimiter = columnDelimiterInput
        .replace('\\t', '\t')
        .replace('\\r', '\r')
        .replace('\\n', '\n');

    let joinedRows = [];
    tableData.forEach((row) => {
        joinedRows.push(row.join(columnDelimiter));
    });

    const joinedText = joinedRows.join(rowDelimiter);

    const csvAllTextarea = document.getElementById('csv-all');
    csvAllTextarea.value = joinedText;
}

function updateParsedARowCsv() {
    const columnDelimiterInput = document.getElementById('column-delimiter').value;

    const columnDelimiter = columnDelimiterInput
        .replace('\\t', '\t')
        .replace('\\r', '\r')
        .replace('\\n', '\n');

    const rowNum = document.getElementById('row-num').value;

    let joinedText = '表示できるデータがありません';
    if (rowNum < tableData.length) {
        const targetRow = tableData[rowNum];

        joinedText = targetRow.join(columnDelimiter);
    }

    const csvARowTextarea = document.getElementById('csv-a-row');
    csvARowTextarea.value = joinedText;
}

function updateParsedAColumnCsv() {
    const rowDelimiterInput = document.getElementById('row-delimiter').value;

    const rowDelimiter = rowDelimiterInput
        .replace('\\t', '\t')
        .replace('\\r', '\r')
        .replace('\\n', '\n');

    const columnNum = document.getElementById('column-num').value;

    let targetColumn = [];
    let dataCount = 0;
    tableData.forEach((row) => {
        let data = '';
        if (columnNum < row.length) {
            data = row[columnNum];
            dataCount++;
        }
        targetColumn.push(data);
    });

    let joinedText = '表示できるデータがありません';
    if (0 < dataCount) {
        joinedText = targetColumn.join(rowDelimiter);
    }

    const csvAColumnTextarea = document.getElementById('csv-a-column');
    csvAColumnTextarea.value = joinedText;
}

function saveCookies() {
    const rowDelimiter = document.getElementById('row-delimiter').value;
    const columnDelimiter = document.getElementById('column-delimiter').value;
    const rowNum = document.getElementById('row-num').value;
    const columnNum = document.getElementById('column-num').value;

    document.cookie = `row-delimiter=${rowDelimiter}`;
    document.cookie = `column-delimiter=${columnDelimiter}`;
    document.cookie = `row-num=${rowNum}`;
    document.cookie = `column-num=${columnNum}`;
}

function loadCookies() {
    const rowDelimiter = getCookieValue('row-delimiter');
    const columnDelimiter = getCookieValue('column-delimiter');
    const rowNum = getCookieValue('row-num');
    const columnNum = getCookieValue('column-num');

    if (rowDelimiter != '') {
        document.getElementById('row-delimiter').value = getCookieValue('row-delimiter');
    }
    if (columnDelimiter != '') {
        document.getElementById('column-delimiter').value = getCookieValue('column-delimiter');
    }
    if (rowNum != '') {
        document.getElementById('row-num').value = getCookieValue('row-num');
    }
    if (columnNum != '') {
        document.getElementById('column-num').value = getCookieValue('column-num');
    }
}

function getCookieValue(key) {
    const cookies = document.cookie.split(';');
    const foundCookie = cookies.find((cookie) => cookie.split('=')[0].trim() === key.trim());
    if (foundCookie) {
        const cookieValue = decodeURIComponent(foundCookie.split('=')[1]);
        return cookieValue;
    }
    return '';
}
