document.addEventListener("DOMContentLoaded", () => {
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const numDaysInput = document.getElementById("num-days");
    const returnOnInput = document.getElementById("return-on");
    const uploadBtn = document.getElementById("upload-btn");
    const fileInput = document.getElementById("file-input");

    /* =========================================
        1. CUSTOM CALENDAR LOGIC
    ========================================= */
    let currentDate = new Date(); 
    let activeInputId = '';
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let startDateValue = null;
    let endDateValue = null;

    window.openCalendar = function(inputId) {
        activeInputId = inputId;
        const modal = document.getElementById('calendarModal');
        if(modal) {
            modal.classList.add('active');
            renderCalendar();
        }
    };

    window.closeCalendar = function() {
        const modal = document.getElementById('calendarModal');
        if(modal) {
            modal.classList.remove('active');
        }
    };

    document.getElementById('calendarModal')?.addEventListener('click', function(e) {
        if (e.target === this) window.closeCalendar();
    });

    window.changeMonth = function(direction) {
        currentDate.setMonth(currentDate.getMonth() + direction);
        renderCalendar();
    };

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const monthYearElement = document.getElementById('calendarMonthYear');
        if (monthYearElement) {
            monthYearElement.textContent = `${monthNames[month]} ${year}`;
        }

        const daysContainer = document.getElementById('calendarDays');
        if (!daysContainer) return; 

        daysContainer.innerHTML = '';

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate(); 
        const daysInPrevMonth = new Date(year, month, 0).getDate(); 

        const todayAtMidnight = new Date();
        todayAtMidnight.setHours(0, 0, 0, 0);

        // Previous month inactive days (for alignment)
        for (let i = firstDay; i > 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day', 'inactive');
            dayDiv.textContent = daysInPrevMonth - i + 1;
            daysContainer.appendChild(dayDiv);
        }

        // Current month days only
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day'); 
            dayDiv.textContent = i;
            
            const cellDate = new Date(year, month, i);
            cellDate.setHours(0, 0, 0, 0);

            if (cellDate.getTime() === todayAtMidnight.getTime()) {
                dayDiv.classList.add('today'); 
            }

            let isUnclickable = false;

            // Lock past dates
            if (cellDate.getTime() < todayAtMidnight.getTime()) {
                isUnclickable = true;
            }

            // Lock End Dates before Start Dates
            if (activeInputId === 'end-date' && startDateValue) {
                const startAtMidnight = new Date(startDateValue);
                startAtMidnight.setHours(0, 0, 0, 0);
                if (cellDate.getTime() < startAtMidnight.getTime()) {
                    isUnclickable = true;
                }
            }

            if (isUnclickable) {
                dayDiv.classList.add('inactive');
            } else {
                let isSelected = false;
                if (activeInputId === 'start-date' && startDateValue && cellDate.getTime() === startDateValue.getTime()) {
                    isSelected = true; 
                } else if (activeInputId === 'end-date' && endDateValue && cellDate.getTime() === endDateValue.getTime()) {
                    isSelected = true; 
                }

                if (isSelected) dayDiv.classList.add('selected'); 
                dayDiv.onclick = () => window.selectDate(i, month, year);
            }
            daysContainer.appendChild(dayDiv);
        } 
        // Next month overflow loop removed for a cleaner look
    }

    window.selectDate = function(day, month, year) {
        const selectedDate = new Date(year, month, day);
        selectedDate.setHours(0, 0, 0, 0);
        
        const formattedDate = `${monthNames[month].substring(0,3)} ${String(day).padStart(2, '0')}, ${year}`;
        const inputField = document.getElementById(activeInputId);
        
        if(inputField) {
            inputField.value = formattedDate;
        }

        if (activeInputId === 'start-date') {
            startDateValue = selectedDate;
            if (endDateValue && startDateValue.getTime() > endDateValue.getTime()) {
                endDateValue = null;
                document.getElementById('end-date').value = '';
                document.getElementById('num-days').value = '';
                document.getElementById('return-on').value = '';
            }
        } else if (activeInputId === 'end-date') {
            endDateValue = selectedDate;
        }

        window.closeCalendar();
        calculateExcuseDetails();
    };

    function calculateExcuseDetails() {
        const numDaysInput = document.getElementById('num-days');
        const returnOnInput = document.getElementById('return-on');

        if (startDateValue && endDateValue) {
            const timeDiff = endDateValue.getTime() - startDateValue.getTime();
            if (timeDiff >= 0) {
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
                numDaysInput.value = daysDiff === 1 ? '1 day' : `${daysDiff} days`;

                const returnDate = new Date(endDateValue);
                returnDate.setDate(returnDate.getDate() + 1);

                const retMonth = monthNames[returnDate.getMonth()].substring(0,3);
                const retDay = String(returnDate.getDate()).padStart(2, '0');
                const retYear = returnDate.getFullYear();
                returnOnInput.value = `${retMonth} ${retDay}, ${retYear}`;
            } else {
                numDaysInput.value = 'Invalid range';
                returnOnInput.value = '';
            }
        }
    }

    uploadBtn.addEventListener("click", () => { fileInput.click(); });
    fileInput.addEventListener("change", function() {
      if (this.files && this.files.length > 0) {
        uploadBtn.querySelector(".upload-text").textContent = this.files[0].name;
      }
    });

    const submitBtn = document.getElementById("submit-btn");
    const cancelBtn = document.getElementById("cancel-btn");

    function resetForm() {
      document.getElementById("time-type").value = "";
      document.getElementById("start-date").value = "";
      document.getElementById("end-date").value = "";
      document.getElementById("num-days").value = "";
      document.getElementById("return-on").value = "";
      document.getElementById("comment").value = "";
      document.getElementById("file-input").value = ""; 
      uploadBtn.querySelector(".upload-text").textContent = "Upload";
      startDateValue = null;
      endDateValue = null;
    }

    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const excuseType = document.getElementById("time-type").value;
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;

      if (!excuseType || !startDate || !endDate) {
        alert("Please select an Excuse Type, Start Date, and End Date before submitting.");
        return;
      }

      const formData = new FormData();
      formData.append('excuseType', excuseType);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('numDays', document.getElementById("num-days").value);
      formData.append('returnOn', document.getElementById("return-on").value);
      formData.append('comment', document.getElementById("comment").value);
      
      if (fileInput.files.length > 0) {
          formData.append('attachment', fileInput.files[0]);
      }

      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;

      fetch('api/api_submit_excuse.php', { method: 'POST', body: formData })
      .then(response => response.json())
      .then(data => {
          submitBtn.textContent = "Submit";
          submitBtn.disabled = false;
          if (data.success) {
              alert("Success! Your excuse request has been submitted to the Admin.");
              if (confirm("Would you like to file another excuse request?")) { resetForm(); } 
              else { window.location.href = "facultydashboardHOME.php"; }
          } else { alert("Error: " + data.error); }
      })
      .catch(error => {
          console.error('Error:', error);
          alert("A network error occurred. Please try again.");
          submitBtn.textContent = "Submit";
          submitBtn.disabled = false;
      });
    });

    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to cancel? Your progress will be lost.")) { resetForm(); }
    });
});