document.addEventListener('DOMContentLoaded', () => {
    
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
                if(targetContent) targetContent.style.display = 'block';
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
                pendingTitle.style.display = 'none';
                pendingDetail.style.display = 'block';
            });
        });

        if (pendingBackBtn) {
            pendingBackBtn.addEventListener('click', () => {
                pendingDetail.style.display = 'none';
                pendingView.style.display = 'block';
                pendingControls.style.display = 'flex';
                pendingTitle.style.display = 'block';
            });
        }

        // Approved
        const approvedRows = document.querySelectorAll(`.${prefix}-approved-row, #${prefix}-approved-view .approved-row`);
        const approvedView = document.getElementById(`${prefix}-approved-view`);
        const approvedDetail = document.getElementById(`${prefix}-approved-detail`);
        const approvedControls = document.getElementById(`${prefix}-approved-controls`);
        const approvedBackBtn = document.getElementById(`${prefix}-approved-back-btn`);

        approvedRows.forEach(row => {
            row.addEventListener('click', () => {
                approvedView.style.display = 'none';
                approvedControls.style.display = 'none';
                approvedDetail.style.display = 'block';
            });
        });

        if (approvedBackBtn) {
            approvedBackBtn.addEventListener('click', () => {
                approvedDetail.style.display = 'none';
                approvedView.style.display = 'block';
                approvedControls.style.display = 'flex';
            });
        }

        // Declined
        const declinedRows = document.querySelectorAll(`.${prefix}-declined-row, #${prefix}-declined-view .declined-row`);
        const declinedView = document.getElementById(`${prefix}-declined-view`);
        const declinedDetail = document.getElementById(`${prefix}-declined-detail`);
        const declinedControls = document.getElementById(`${prefix}-declined-controls`);
        const declinedBackBtn = document.getElementById(`${prefix}-declined-back-btn`);

        declinedRows.forEach(row => {
            row.addEventListener('click', () => {
                declinedView.style.display = 'none';
                declinedControls.style.display = 'none';
                declinedDetail.style.display = 'block';
            });
        });

        if (declinedBackBtn) {
            declinedBackBtn.addEventListener('click', () => {
                declinedDetail.style.display = 'none';
                declinedView.style.display = 'block';
                declinedControls.style.display = 'flex';
            });
        }
    }

    setupViewToggles('e');
    setupViewToggles('l');

    // MODALS
    const overlay = document.getElementById('modal-overlay');
    const eApproveModal = document.getElementById('e-approve-modal');
    const lApproveModal = document.getElementById('l-approve-modal');
    const declineReasonModal = document.getElementById('decline-reason-modal');
    const declineSuccessModal = document.getElementById('decline-success-modal');
    const reevalConfirmModal = document.getElementById('reeval-confirm-modal');
    const reevalSuccessModal = document.getElementById('reeval-success-modal');

    function closeAllModals() {
      if(overlay) overlay.style.display = 'none';
      if(eApproveModal) eApproveModal.style.display = 'none';
      if(lApproveModal) lApproveModal.style.display = 'none';
      if(declineReasonModal) declineReasonModal.style.display = 'none';
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

    // Decline Triggers
    document.querySelectorAll('.e-trigger-decline, .l-trigger-decline').forEach(btn => {
        btn.addEventListener('click', () => {
            if(overlay) overlay.style.display = 'block';
            if(declineReasonModal) declineReasonModal.style.display = 'block';
            const reasonText = document.getElementById('decline-reason-text');
            if(reasonText) reasonText.value = ''; 
        });
    });

    const submitDeclineBtn = document.getElementById('submit-decline-btn');
    if (submitDeclineBtn) {
      submitDeclineBtn.addEventListener('click', () => {
        if(declineReasonModal) declineReasonModal.style.display = 'none';
        if(declineSuccessModal) declineSuccessModal.style.display = 'block';
      });
    }

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