/* =========================
       PLACEHOLDER DATA SOURCE
       Replace these values with
       API / database response
    ========================== */
    const studentData = {
      name: "Tricia Mae Zamora",
      course: "Computer Engineering",
      yearBlock: "2nd Year - Block 2",
      uid: "09999999",
      contact: "09568080426",
      email: "mehfjdhsa@email.com",
      address: "123 Hotdog Kanto Street Caloocan"
    };

    const attendanceData = {
      semesters: [
        { schoolDays: 50, presentDays: 48 },
        { schoolDays: 63, presentDays: 63 },
        { schoolDays: 49, presentDays: 48 }
      ]
    };

    /* =========================
       POPULATE STUDENT INFO
    ========================== */
    function loadStudentInfo(data) {
      document.getElementById("studentName").textContent = data.name;
      document.getElementById("course").textContent = data.course;
      document.getElementById("yearBlock").textContent = data.yearBlock;
      document.getElementById("uid").textContent = data.uid;
      document.getElementById("contact").textContent = data.contact;
      document.getElementById("email").textContent = data.email;
      document.getElementById("address").textContent = data.address;
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

        document.getElementById(`school${index + 1}`).textContent = school;
        document.getElementById(`present${index + 1}`).textContent = present;
        document.getElementById(`absent${index + 1}`).textContent = absent;

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
    loadStudentInfo(studentData);
    loadAttendance(attendanceData);

    /* =========================
       OPTIONAL:
       Update data dynamically
    ========================== */
    function updateAttendance(newData) {
      loadAttendance(newData);
    }

    function updateStudent(newStudentData) {
      loadStudentInfo(newStudentData);
    }
    