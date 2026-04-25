window.onload = function() {
    // Generate April (30 days) and May (31 days)
    createCalendar('aprilGrid', 30);
    createCalendar('mayGrid', 31);
    
    // Generate Falling Stars
    const starField = document.getElementById('starField');
    for (let i = 0; i < 45; i++) {
        let star = document.createElement('span');
        star.className = 'star';
        star.innerText = '★';
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 8 + 's';
        star.style.fontSize = (Math.random() * 12 + 8) + 'px';
        starField.appendChild(star);
    }
};

function createCalendar(gridId, days) {
    const grid = document.getElementById(gridId);
    const statuses = ['present', 'present', 'present', 'absent', 'late', 'excused', 'holiday', 'out-range'];
    
    for (let i = 1; i <= days; i++) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        grid.innerHTML += `<div class="day-box ${randomStatus}">${i}</div>`;
    }
}