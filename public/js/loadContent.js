document.addEventListener('DOMContentLoaded', () => {
    // Load header and footer
    // loadHTML('header-placeholder', '/header.html');
    // loadHTML('footer-placeholder', '/footer.html');

    // Phone number validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', () => validatePhoneNumber(phoneInput));
    }

    // Budget slider
    const budgetSlider = document.getElementById('budget');
    const budgetValue = document.getElementById('budget-value');

    if (budgetSlider) {
        updateSliderBackground(budgetSlider.value);
        budgetSlider.addEventListener('input', () => updateBudgetValue(budgetSlider.value));
    }

    if (budgetValue) {
        budgetValue.addEventListener('input', () => updateBudgetSlider(budgetValue.value));
    }

    // Calendar rendering
    renderCalendar(currentMonth, currentYear);

    // Increment and decrement buttons
    document.querySelectorAll('.increment-btn').forEach(button => {
        button.addEventListener('click', () => changeValue(button.dataset.inputId, 1));
    });

    document.querySelectorAll('.decrement-btn').forEach(button => {
        button.addEventListener('click', () => changeValue(button.dataset.inputId, -1));
    });
});

function loadHTML(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
            }
        })
        .catch(error => console.error('Error loading HTML:', error));
}

function validatePhoneNumber(input) {
    input.value = input.value.replace(/[^0-9+]/g, '');

    if (input.value.includes('+')) {
        input.value = '+' + input.value.replace(/\+/g, '');
    }
    if (input.value.length > 13) {
        input.value = input.value.slice(0, 13);
    }

    let digitCount = input.value.replace(/[^0-9]/g, '').length;
    if (digitCount > 12) {
        input.value = (input.value.includes('+') ? '+' : '') + input.value.replace(/[^0-9]/g, '').slice(0, 12);
    }
}

function updateBudgetValue(value) {
    const budgetValue = document.getElementById('budget-value');
    if (budgetValue) {
        budgetValue.value = value;
    }
    updateSliderBackground(value);
}

function updateBudgetSlider(value) {
    const budgetSlider = document.getElementById('budget');
    if (budgetSlider && value >= 5000 && value <= 100000) {
        budgetSlider.value = value;
    }
    updateSliderBackground(value);
}

function updateSliderBackground(value) {
    const budgetSlider = document.getElementById('budget');
    if (budgetSlider) {
        const min = budgetSlider.min;
        const max = budgetSlider.max;
        const percentage = ((value - min) / (max - min)) * 100;
        budgetSlider.style.background = `linear-gradient(to right, #D6B957 ${percentage}%, #ddd ${percentage}%)`;
    }
}

function changeValue(id, delta) {
    const input = document.getElementById(id);
    if (input) {
        input.value = Math.max(0, parseInt(input.value) + delta);
    }
}

// Calendar functions
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedStartDate = null;
let selectedEndDate = null;

function renderCalendar(month, year) {
    const calendarDays = document.getElementById('calendar-days');
    const monthYear = document.getElementById('calendar-month-year');
    if (!calendarDays || !monthYear) return;

    calendarDays.innerHTML = '';

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    monthYear.textContent = `${monthNames[month]} ${year}`;

    document.getElementById('prev-month').textContent = `${shortMonthNames[(month + 11) % 12]}`;
    document.getElementById('next-month').textContent = `${shortMonthNames[(month + 1) % 12]} `;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const weekdayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    weekdayNames.forEach(day => {
        const weekdayCell = document.createElement('div');
        weekdayCell.textContent = day;
        weekdayCell.classList.add('calendar-day', 'weekday');
        calendarDays.appendChild(weekdayCell);
    });

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day', 'empty');
        calendarDays.appendChild(emptyCell);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = i;
        dayCell.classList.add('calendar-day');
        dayCell.onclick = () => selectDay(dayCell, new Date(year, month, i));
        calendarDays.appendChild(dayCell);
    }

    updateCalendarSelection();
}

function selectDay(dayCell, date) {
    if (!selectedStartDate || selectedEndDate) {
        selectedStartDate = date;
        selectedEndDate = null;
        document.getElementById('days').value = '';
        document.getElementById('nights').value = '';
    } else {
        selectedEndDate = date;
        const days = Math.round((selectedEndDate - selectedStartDate) / (1000 * 60 * 60 * 24));
        document.getElementById('days').value = days + 1;
        document.getElementById('nights').value = days;
    }
    updateCalendarSelection();
}

function updateCalendarSelection() {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)');
    calendarDays.forEach(dayCell => {
        const day = parseInt(dayCell.textContent);
        const date = new Date(currentYear, currentMonth, day);
        if (selectedStartDate && date.getTime() === selectedStartDate.getTime()) {
            dayCell.classList.add('selected');
        } else if (selectedEndDate && date.getTime() === selectedEndDate.getTime()) {
            dayCell.classList.add('selected');
        } else if (selectedStartDate && selectedEndDate && date >= selectedStartDate && date <= selectedEndDate) {
            dayCell.classList.add('selected');
        } else {
            dayCell.classList.remove('selected');
        }
    });
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
}

function prevYear() {
    currentYear--;
    renderCalendar(currentMonth, currentYear);
}

function nextYear() {
    currentYear++;
    renderCalendar(currentMonth, currentYear);
}