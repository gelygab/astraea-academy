let startSelection = null;
let endSelection = null;
let currentBaseDate = new Date(2021, 3, 1); 

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

window.onload = () => {
    initDropdowns();
    renderCalendars();
};

function initDropdowns() {
    const monthSelectors = [document.getElementById('select-month-left'), document.getElementById('select-month-right')];
    const yearSelectors = [document.getElementById('select-year-left'), document.getElementById('select-year-right')];

    monthSelectors.forEach(sel => {
        months.forEach((m, i) => {
            let opt = new Option(m, i);
            sel.add(opt);
        });
    });

    yearSelectors.forEach(sel => {
        for (let y = 2020; y <= 2030; y++) {
            let opt = new Option(y, y);
            sel.add(opt);
        }
    });
}

function renderCalendars() {
    const leftDate = new Date(currentBaseDate);
    const rightDate = new Date(currentBaseDate);
    rightDate.setMonth(rightDate.getMonth() + 1);

    updateDropdownValues(leftDate, rightDate);
    drawMonth(leftDate, "days-left");
    drawMonth(rightDate, "days-right");
}

function updateDropdownValues(left, right) {
    document.getElementById('select-month-left').value = left.getMonth();
    document.getElementById('select-year-left').value = left.getFullYear();
    document.getElementById('select-month-right').value = right.getMonth();
    document.getElementById('select-year-right').value = right.getFullYear();
}

function jumpDate() {
    const m = parseInt(document.getElementById('select-month-left').value);
    const y = parseInt(document.getElementById('select-year-left').value);
    currentBaseDate = new Date(y, m, 1);
    renderCalendars();
}

function drawMonth(date, gridId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = "";
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    let blanks = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < blanks; i++) grid.appendChild(document.createElement("div"));

    for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement("div");
        dayEl.classList.add("day");
        dayEl.innerText = d;
        const thisDate = new Date(date.getFullYear(), date.getMonth(), d);

        if (startSelection && thisDate.getTime() === startSelection.getTime()) dayEl.classList.add("selected");
        if (endSelection && thisDate.getTime() === endSelection.getTime()) dayEl.classList.add("selected");
        if (startSelection && endSelection && thisDate > startSelection && thisDate < endSelection) dayEl.classList.add("in-range");

        dayEl.onclick = () => {
            if (!startSelection || (startSelection && endSelection)) {
                startSelection = thisDate; endSelection = null;
            } else if (thisDate < startSelection) {
                startSelection = thisDate;
            } else {
                endSelection = thisDate;
            }
            document.getElementById('display-from').value = startSelection ? startSelection.toLocaleDateString() : "";
            document.getElementById('display-to').value = endSelection ? endSelection.toLocaleDateString() : "";
            renderCalendars();
        };
        grid.appendChild(dayEl);
    }
}

function changeMonth(step) {
    currentBaseDate.setMonth(currentBaseDate.getMonth() + step);
    renderCalendars();
}