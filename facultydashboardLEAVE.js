document.addEventListener("DOMContentLoaded", () => {
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const numDaysInput = document.getElementById("num-days");
  const returnOnInput = document.getElementById("return-on");
  const uploadBtn = document.getElementById("upload-btn");
  const fileInput = document.getElementById("file-input");

  // FLATPICKR CALENDAR
  flatpickr("#start-date", {
    dateFormat: "F j, Y",
    minDate: "today",
    onChange: calculateDates
  });

  flatpickr("#end-date", {
    dateFormat: "F j, Y",
    minDate: "today",
    onChange: calculateDates 
  });

// Function to calculate days and return date
function calculateDates() {
    const startVal = startDateInput.value;
    const endVal = endDateInput.value;

    if (startVal && endVal) {
      // Convert the text back into a Date object
      const start = new Date(startVal);
      const end = new Date(endVal);

      const timeDiff = end.getTime() - start.getTime();
      
      if (timeDiff >= 0) {
        const diffDays = (timeDiff / (1000 * 3600 * 24)) + 1;
        numDaysInput.value = diffDays === 1 ? "1 day" : `${diffDays} days`;

        const returnDate = new Date(end);
        returnDate.setDate(returnDate.getDate() + 1);
        
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        returnOnInput.value = returnDate.toLocaleDateString('en-US', options);
      } else {
        numDaysInput.value = "Invalid range";
        returnOnInput.value = "";
      }
    }
  }

  // Listeners for date changes
  startDateInput.addEventListener("change", calculateDates);
  endDateInput.addEventListener("change", calculateDates);

  // Trigger file upload click when clicking the upload box
  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", function() {
    if (this.files && this.files.length > 0) {
      uploadBtn.querySelector(".upload-text").textContent = this.files[0].name;
    }
  });

  // submit and cancel
  const submitBtn = document.getElementById("submit-btn");
  const cancelBtn = document.getElementById("cancel-btn");

  // load new form
  function resetForm() {
    document.getElementById("time-type").value = "";
    document.getElementById("start-date").value = "";
    document.getElementById("end-date").value = "";
    document.getElementById("num-days").value = "";
    document.getElementById("return-on").value = "";
    document.getElementById("comment").value = "";
    document.getElementById("file-input").value = ""; 
    uploadBtn.querySelector(".upload-text").textContent = "Upload";
  }

 // SUBMIT
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // 1. Grab the values from your frontend IDs
    const leaveType = document.getElementById("time-type").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const numDays = document.getElementById("num-days").value;
    const returnOn = document.getElementById("return-on").value;
    const comment = document.getElementById("comment").value;

    // Validation
    if (!leaveType || !startDate || !endDate) {
      alert("Please select a Leave Type, Start Date, and End Date before submitting.");
      return;
    }

    // 2. Package it up for PHP
    const startConvert = new Date(startDate);
    const endConvert = new Date(endDate);

    if (startConvert > endConvert) {
      alert("Hold up! The End Date cannot be before the Start Date.");
      return; 
    }

    const formData = new FormData();
    formData.append('leaveType', leaveType);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('numDays', numDays);
    formData.append('returnOn', returnOn);
    formData.append('comment', comment);

    if (fileInput.files.length > 0) {
      formData.append('attachment', fileInput.files[0]);
    }

    // Button loading state
    submitBtn.textContent = "Submitting...";
    submitBtn.disabled = true;

    // 3. Send it!
    fetch('faculty/faculty_api/api_submit_leave.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Reset button
        submitBtn.textContent = "Submit";
        submitBtn.disabled = false;

        if (data.success) {
            alert("Success! Your leave request has been submitted to the Admin.");
            if (confirm("Would you like to file another leave request?")) {
                resetForm(); 
            } else {
                window.location.href = "facultydashboardHOME.php"; 
            }
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("A network error occurred. Please try again.");
        submitBtn.textContent = "Submit";
        submitBtn.disabled = false;
    });
  });

  // CANCEL
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    if (confirm("Are you sure you want to cancel? Your progress will be lost.")) {
      resetForm();
    }
    
  });
});