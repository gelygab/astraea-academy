document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // DYNAMIC DROPDOWN LOGIC
    // ==========================================
    const subjectSelect = document.getElementById('subject-select');
    const programSelect = document.getElementById('program-select');
    const blockSelect = document.getElementById('block-select');
    
    let fetchedSchedules = []; // This remembers the blocks for the chosen program

    if (subjectSelect) {
        // When a Subject is chosen...
        subjectSelect.addEventListener('change', () => {
            const subjectCode = subjectSelect.value;
            
            // Lock and reset the next dropdowns
            programSelect.innerHTML = '<option value="" disabled selected hidden>Loading...</option>';
            programSelect.disabled = true;
            blockSelect.innerHTML = '<option value="" disabled selected hidden>Select program first</option>';
            blockSelect.disabled = true;

            // Ask the PHP API for the Programs and Blocks
            const formData = new FormData();
            formData.append('subject_code', subjectCode);

            fetch('api/api_student_filter.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    programSelect.innerHTML = '<option value="" disabled selected hidden>Error loading programs</option>';
                    return;
                }

                // Save schedules memory for the Block dropdown
                fetchedSchedules = data.schedules; 

                // Populate and unlock the Program dropdown
                programSelect.innerHTML = '<option value="" disabled selected hidden>Select program</option>';
                data.depts.forEach(dept => {
                    const opt = document.createElement('option');
                    opt.value = dept.department_id;
                    opt.textContent = `${dept.department_name} (${dept.department_code})`;
                    programSelect.appendChild(opt);
                });
                programSelect.disabled = false;
            })
            .catch(err => {
                console.error("Network Error:", err);
                programSelect.innerHTML = '<option value="" disabled selected hidden>Network Error</option>';
            });
        });
    }

    if (programSelect) {
        // When a Program is chosen...
        programSelect.addEventListener('change', () => {
            const deptId = programSelect.value;
            
            // Filter our saved memory for just the blocks that match this program
            const filteredBlocks = fetchedSchedules.filter(s => s.department_id == deptId);
            
            // Populate and unlock the Block dropdown
            blockSelect.innerHTML = '<option value="" disabled selected hidden>Select block</option>';
            filteredBlocks.forEach(sc => {
                const opt = document.createElement('option');
                opt.value = sc.schedule_id;
                opt.textContent = `Block ${sc.student_block} (Year ${sc.student_year})`;
                blockSelect.appendChild(opt);
            });
            blockSelect.disabled = false;
        });
    }


    if (blockSelect) {
        // When a Block is chosen, fetch the appeals!
        blockSelect.addEventListener('change', () => {
            const scheduleId = blockSelect.value;
            
            const formData = new FormData();
            formData.append('schedule_id', scheduleId);

            fetch('api/api_student_fetch.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Render the pending cards using your exact HTML layout
                    renderPendingCards('e', data.excuse.filter(a => a.status === 'pending'));
                    renderPendingCards('l', data.leave.filter(a => a.status === 'pending'));
                    
                    // Re-attach the click listeners so the "View Appeal Summary" buttons work
                    setupViewToggles('e');
                    setupViewToggles('l');
                }
            })
            .catch(err => console.error("Fetch Error:", err));
        });
    }

    // This function injects YOUR exact HTML structure into the grid
    function renderPendingCards(prefix, appeals) {
        const view = document.getElementById(`${prefix}-pending-view`);
        if (!view) return;
        
        if (appeals.length === 0) {
            view.innerHTML = '<p style="text-align:center; padding: 30px; color: #888;">No pending requests found.</p>';
            return;
        }

        let html = '<div class="cards-grid">';
        appeals.forEach(a => {
            // Format the type (e.g. "sick_leave" -> "Sick Leave")
            const typeText = a.time_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            html += `
            <div class="request-card" data-appeal='${JSON.stringify(a).replace(/'/g, "&#39;")}'>
                <div class="card-body">
                    <div class="appeal-header">
                        <div class="appeal-title-group">
                            <span class="icon">📄</span> <h3 class="appeal-type">${typeText}</h3>
                        </div>
                        <p class="apply-date">Applied on: ${a.date_filed}</p> 
                    </div>
                    <div class="appeal-detail-section card-details">
                        <div class="detail-row">
                            <span class="detail-label">Student Name:</span>
                            <span class="detail-value student-name">${a.first_name} ${a.last_name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Student ID:</span>
                            <span class="detail-value">${a.user_uid}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Year & Block:</span>
                            <span class="detail-value">Year ${a.student_year} - Block ${a.student_block}</span>
                        </div>
                    </div>
                    <button class="review-btn ${prefix}-review-btn full-width-btn">View Appeal Summary</button>
                </div>
            </div>`;
        });
        html += '</div>';
        view.innerHTML = html;
    }
    // ==========================================

    // TOGGLE SWITCH
    const btnExcuse = document.getElementById('btn-excuse');
    const btnLeave = document.getElementById('btn-leave');
    const toggleSlider = document.getElementById('toggle-slider');
    const excuseSection = document.getElementById('excuse-section');
    const leaveSection = document.getElementById('leave-section');

    btnExcuse.addEventListener('click', () => {
        btnLeave.classList.remove('active');
        btnExcuse.classList.add('active');
        
        toggleSlider.style.transform = 'translateX(0)';
        
        // Switch the actual content sections
        leaveSection.classList.remove('active-section');
        excuseSection.classList.add('active-section');
    });

    btnLeave.addEventListener('click', () => {
        btnExcuse.classList.remove('active');
        btnLeave.classList.add('active');
        
        toggleSlider.style.transform = 'translateX(175px)';
        // Switch the actual content sections
        excuseSection.classList.remove('active-section');
        leaveSection.classList.add('active-section');
    });

    // TAB SWITCHING
    function setupTabs(sectionId) {
        const section = document.getElementById(sectionId);
        if(!section) return;

        const tabs = section.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                section.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                
                const targetId = tab.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                if(targetContent) 
                    targetContent.style.display = 'block';
            });
        });
    }

    setupTabs('excuse-section');
    setupTabs('leave-section');

    // SORT DROPDOWNS
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = btn.nextElementSibling;
        document.querySelectorAll('.sort-menu').forEach(m => {
          if (m !== menu) m.style.display = 'none';
        });
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.sort-menu').forEach(m => m.style.display = 'none');
    });

    // HELPER FUNCTION: Setup Section Views
    function setupViewToggles(prefix) {
        // Pending
        const pendingReviewBtns = document.querySelectorAll(`.${prefix}-review-btn`);
        const pendingView = document.getElementById(`${prefix}-pending-view`);
        const pendingDetail = document.getElementById(`${prefix}-pending-detail`);
        const pendingControls = document.getElementById(`${prefix}-pending-controls`);
        const pendingTitle = document.getElementById(`${prefix}-pending-title`);
        const pendingBackBtn = document.getElementById(`${prefix}-pending-back-btn`);

        pendingReviewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                pendingView.style.display = 'none';
                pendingControls.style.display = 'none';
                if (pendingTitle) pendingTitle.style.display = 'none'; // Hides title
                pendingDetail.style.display = 'block';
             });
        });

        if (pendingBackBtn) {
            pendingBackBtn.addEventListener('click', () => {
                pendingDetail.style.display = 'none';
                pendingView.style.display = 'block';
                pendingControls.style.display = 'flex';
                if (pendingTitle) pendingTitle.style.display = 'block'; // Shows title
             });
        }

        // Approved
        const approvedRows = document.querySelectorAll(`.${prefix}-approved-row, #${prefix}-approved-view .approved-row`);
        const approvedView = document.getElementById(`${prefix}-approved-view`);
        const approvedDetail = document.getElementById(`${prefix}-approved-detail`);
        const approvedControls = document.getElementById(`${prefix}-approved-controls`);
        const approvedTitle = document.getElementById(`${prefix}-approved-title`);
        const approvedBackBtn = document.getElementById(`${prefix}-approved-back-btn`);

        approvedRows.forEach(row => {
            row.addEventListener('click', () => {
                approvedView.style.display = 'none';
                approvedControls.style.display = 'none';
                if (approvedTitle) approvedTitle.style.display = 'none'; // Hides title
                approvedDetail.style.display = 'block';
            });
        });

        if (approvedBackBtn) {
            approvedBackBtn.addEventListener('click', () => {
                approvedDetail.style.display = 'none';
                approvedView.style.display = 'block';
                approvedControls.style.display = 'flex';
                if (approvedTitle) approvedTitle.style.display = 'block'; // Shows title
            });
        }

        // Declined
        const declinedRows = document.querySelectorAll(`.${prefix}-declined-row, #${prefix}-declined-view .declined-row`);
        const declinedView = document.getElementById(`${prefix}-declined-view`);
        const declinedDetail = document.getElementById(`${prefix}-declined-detail`);
        const declinedControls = document.getElementById(`${prefix}-declined-controls`);
        const declinedTitle = document.getElementById(`${prefix}-declined-title`);
        const declinedBackBtn = document.getElementById(`${prefix}-declined-back-btn`);

        declinedRows.forEach(row => {
            row.addEventListener('click', () => {
                declinedView.style.display = 'none';
                declinedControls.style.display = 'none';
                if (declinedTitle) declinedTitle.style.display = 'none'; // Hides title
                declinedDetail.style.display = 'block';
            });
        });

        if (declinedBackBtn) {
            declinedBackBtn.addEventListener('click', () => {
                declinedDetail.style.display = 'none';
                declinedView.style.display = 'block';
                declinedControls.style.display = 'flex';
                if (declinedTitle) declinedTitle.style.display = 'block'; // Shows title
            });
        }
    }

    setupViewToggles('e');
    setupViewToggles('l');

    // MODALS
    const overlay = document.getElementById('modal-overlay');
    const eApproveModal = document.getElementById('e-approve-modal');
    const lApproveModal = document.getElementById('l-approve-modal');
    const declineSuccessModal = document.getElementById('decline-success-modal');
    const reevalConfirmModal = document.getElementById('reeval-confirm-modal');
    const reevalSuccessModal = document.getElementById('reeval-success-modal');

    function closeAllModals() {
      if(overlay) overlay.style.display = 'none';
      if(eApproveModal) eApproveModal.style.display = 'none';
      if(lApproveModal) lApproveModal.style.display = 'none';
      if(declineSuccessModal) declineSuccessModal.style.display = 'none';
      if(reevalConfirmModal) reevalConfirmModal.style.display = 'none';
      if(reevalSuccessModal) reevalSuccessModal.style.display = 'none';
    }

    // Approve Triggers
    document.querySelectorAll('.e-trigger-approve').forEach(btn => {
        btn.addEventListener('click', () => {
            if(overlay) overlay.style.display = 'block';
            if(eApproveModal) eApproveModal.style.display = 'block';
        });
    });

    document.querySelectorAll('.l-trigger-approve').forEach(btn => {
        btn.addEventListener('click', () => {
            if(overlay) overlay.style.display = 'block';
            if(lApproveModal) lApproveModal.style.display = 'block';
        });
    });

    // Decline Triggers (Direct to Success Modal)
    document.querySelectorAll('.e-trigger-decline, .l-trigger-decline').forEach(btn => {
        btn.addEventListener('click', () => {
            if(overlay) overlay.style.display = 'block';
            if(declineSuccessModal) declineSuccessModal.style.display = 'block';
        });
    });

    // Re-eval Triggers
    document.querySelectorAll('.e-trigger-reeval, .l-trigger-reeval').forEach(btn => {
        btn.addEventListener('click', () => {
            if(overlay) overlay.style.display = 'block';
            if(reevalConfirmModal) reevalConfirmModal.style.display = 'block';
        });
    });

    const cancelReevalBtn = document.getElementById('cancel-reeval-btn');
    if (cancelReevalBtn) cancelReevalBtn.addEventListener('click', closeAllModals);

    const confirmReevalBtn = document.getElementById('confirm-reeval-btn');
    if (confirmReevalBtn) {
      confirmReevalBtn.addEventListener('click', () => {
        if(reevalConfirmModal) reevalConfirmModal.style.display = 'none';
        if(reevalSuccessModal) reevalSuccessModal.style.display = 'block';
      });
    }

    // Reset back to Pending Tab
    document.querySelectorAll('.reset-pending-btn, .e-back-pending, .l-back-pending').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
            
            // Check which section is currently active and reset its view
            if (excuseSection.classList.contains('active-section')) {
                document.querySelector('.tab[data-target="e-pending-tab"]')?.click();
                document.getElementById('e-pending-back-btn')?.click(); // Reset to grid view
            } else {
                document.querySelector('.tab[data-target="l-pending-tab"]')?.click();
                document.getElementById('l-pending-back-btn')?.click(); // Reset to grid view
            }
        });
    });

    if (overlay) overlay.addEventListener('click', closeAllModals);

    // SEARCH
    function setupSearch(inputSelector, itemSelector, nameSelector) {
        const searchInput = document.querySelector(inputSelector);
        const items = document.querySelectorAll(itemSelector);

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                items.forEach(item => {
                    const nameElement = item.querySelector(nameSelector);
                   
                     if (nameElement) {
                        const name = nameElement.textContent.toLowerCase();
                        // Hide or show based on search term
                        item.style.display = name.includes(term) ? '' : 'none';
                     }
                });
            });
        }
    }

    // Excuse Tab Search Event Listeners
    setupSearch('.e-search', '#e-pending-view .request-card', '.student-name');
    setupSearch('.e-app-search', '#e-approved-view tbody tr', 'td:nth-child(2)');
    setupSearch('.e-dec-search', '#e-declined-view tbody tr', 'td:nth-child(2)');

    // Leave Tab Search Event Listeners
    setupSearch('.l-search', '#l-pending-view .request-card', '.student-name');
    setupSearch('.l-app-search', '#l-approved-view tbody tr', 'td:nth-child(2)');
    setupSearch('.l-dec-search', '#l-declined-view tbody tr', 'td:nth-child(2)');

    // URL CHECKER FOR TAB REDIRECTION
    const urlParams = new URLSearchParams(window.location.search);
    const requestedTab = urlParams.get('tab');
    
    if (requestedTab === 'leave') {
        // Find the leave button 
        const leaveBtn = document.getElementById('btn-leave');
        if (leaveBtn) {
            leaveBtn.click();
        }
    } else if (requestedTab === 'excuse') {
        // Find the excuse button
        const excuseBtn = document.getElementById('btn-excuse');
        if (excuseBtn) {
            excuseBtn.click();
        }
    }

});