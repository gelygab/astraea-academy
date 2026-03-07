async function loadDashboard(period = 'monthly') {
    try {
        const response = await fetch('student_data.json');
        if (!response.ok) throw new Error("Fetch failed");
        const data = await response.json();
        const student = data.students[0]; 

        // Profile Data Injection
        if(document.getElementById('studentName')) document.getElementById('studentName').innerText = student.name;
        if(document.getElementById('uid-val')) document.getElementById('uid-val').innerText = student.uid;
        if(document.getElementById('contact-val')) document.getElementById('contact-val').innerText = student.contact;
        if(document.getElementById('email-val')) document.getElementById('email-val').innerText = student.email;
        if(document.getElementById('address-val')) document.getElementById('address-val').innerText = student.address;

        // Date Filtering
        const now = new Date();
        let cutoff = new Date();
        if (period === 'daily') cutoff.setHours(0,0,0,0);
        else if (period === 'weekly') cutoff.setDate(now.getDate() - 7);
        else if (period === 'monthly') cutoff.setMonth(now.getMonth() - 1);

        const filtered = student.attendanceLogs.filter(log => new Date(log.date) >= cutoff);

        // Attendance Grid
        const categories = [
            { label: "Total Attendance", status: "Present" },
            { label: "Late Attendance", status: "Late" },
            { label: "Undertime Attendance", status: "Undertime" },
            { label: "Total Absent", status: "Absent" }
        ];

        const grid = document.getElementById('attendanceGrid');
        if (grid) {
            grid.innerHTML = categories.map(cat => {
                const count = filtered.filter(l => l.status === cat.status).length;
                return `
                    <div class="peach-box">
                        <span class="material-symbols-outlined">star</span>
                        <div class="box-content">
                            <strong>${count} ${count === 1 ? 'Day' : 'Days'}</strong>
                            <p>${cat.label}</p>
                        </div>
                    </div>`;
            }).join('');
        }

    } catch (error) {
        console.error("Dashboard Error:", error);
        const nameDisplay = document.getElementById('studentName');
        if (nameDisplay) nameDisplay.innerText = "Error Loading Data";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pill = document.getElementById('customDropdown');
    const menu = document.getElementById('dropdownMenu');
    const displayValue = document.getElementById('displayValue');
    const items = menu.querySelectorAll('li');

    // Setup Click Listeners FIRST
    pill.addEventListener('click', (e) => {
        e.stopPropagation();
        pill.classList.toggle('active');
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            const val = item.getAttribute('data-value');
            displayValue.innerText = item.innerText;
            items.forEach(i => i.classList.remove('active-item'));
            item.classList.add('active-item');
            loadDashboard(val);
        });
    });

    document.addEventListener('click', () => pill.classList.remove('active'));

    // Trigger Initial Load LAST
    loadDashboard('monthly');
});