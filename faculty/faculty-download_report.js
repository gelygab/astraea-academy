/* =========================
   PLACEHOLDER DATA SOURCE
========================== */
const facultyData = {
  name: "Ryan Justine Mondero",
  course: "Computer Engineering",
  uid: "2024-0999-123",
  email: "rj.mondero@university",
};

const attendanceData = {
  semesters: [
    { schoolDays: 50, presentDays: 48 },
    { schoolDays: 63, presentDays: 63 },
    { schoolDays: 49, presentDays: 48 }
  ]
};

/* =========================
   POPULATE FACULTY INFO
========================== */
function loadFacultyInfo(data) {
  document.getElementById("facultyName").textContent = data.name;
  document.getElementById("course").textContent = data.course;
  document.getElementById("uid").textContent = data.uid;
  document.getElementById("email").textContent = data.email;
}

/* =========================
   CALCULATE ATTENDANCE
========================== */
function loadAttendance(data) {
  let totalSchool = 0;
  let totalPresent = 0;
  let totalAbsent = 0;

  data.semesters.forEach((semester, index) => {
    const school = semester.schoolDays;
    const present = semester.presentDays;
    const absent = school - present;

    // Use index + 1 to match school1, school2, etc.
    const schoolEl = document.getElementById(`school${index + 1}`);
    const presentEl = document.getElementById(`present${index + 1}`);
    const absentEl = document.getElementById(`absent${index + 1}`);

    if(schoolEl) schoolEl.textContent = school;
    if(presentEl) presentEl.textContent = present;
    if(absentEl) absentEl.textContent = absent;

    totalSchool += school;
    totalPresent += present;
    totalAbsent += absent;
  });

  document.getElementById("schoolTotal").textContent = totalSchool;
  document.getElementById("presentTotal").textContent = totalPresent;
  document.getElementById("absentTotal").textContent = totalAbsent;
}

/* =========================
   INIT
========================== */
window.onload = () => {
    loadFacultyInfo(facultyData);
    loadAttendance(attendanceData);
};

/* =========================
   DYNAMIC UPDATES
========================== */
function updateAttendance(newData) {
  loadAttendance(newData);
}

function updateFaculty(newFacultyData) {
  loadFacultyInfo(newFacultyData);
}