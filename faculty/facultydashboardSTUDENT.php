<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faculty Dashboard - Student Records</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="facultydashboardSTUDENT.css">
</head>
<body>
    <input type="file" id="pfpInput" style="display: none;" accept="image/*">
    <div class="background-container">
        <img src="../images/Flogin_bg.gif" alt="Background" class="background-image">
    </div>

    <div class="container">
      <?php include 'faculty_sidebar.php'; ?>
        
        <main class="class-list-dashboard">
            <div class="master-header-card">
                <div class="floating-stars">
                    <span class="material-symbols-outlined star-1">auto_awesome</span>
                    <span class="material-symbols-outlined star-2">star</span>
                    <span class="material-symbols-outlined star-3">auto_awesome</span>
                    <span class="material-symbols-outlined star-4">star_border</span>
                    <span class="material-symbols-outlined star-5">star</span>
                </div>

                <div class="header-content">
                   <div class="icon-wrapper">
                        <img src="../images/student records.png" alt="Student Records" class="header-icon">
                    </div>
                    
                    <div class="header-text-container">
                        <h1>Student Records</h1>
                        
                        <div class="modern-toggle-switch">
                            <div class="toggle-slider" id="toggle-slider"></div>
                            <button id="btn-excuse" class="toggle-tab active">Excuse Requests</button>
                            <button id="btn-leave" class="toggle-tab">Leave Requests</button>
                        </div>
                     </div>
                </div>
            </div>

            <div class="card filter-card">
                <h2>Select Class</h2>
                <div class="filter-controls">
                 <div class="input-group full-width">
                        <label>Subject</label>
                        <select required>
                            <option value="" disabled selected hidden>Select a subject</option>
                              <option value="software_design">Software Design</option>
                            <option value="engineering_management">Engineering Management</option>
                            <option value="electronic_circuits">Fundamentals of Electronic Circuits</option>
                          </select>
                    </div>
                    
                    <div class="filter-row">
                        <div class="input-group">
                             <label>Program</label>
                            <select required>
                                <option value="" disabled selected hidden>Select program</option>
                                  <option value="bscpe">BSCpE</option>
                            </select>
                        </div>
                        <div class="input-group">
                             <label>Block</label>
                            <select required>
                                <option value="" disabled selected hidden>Select block</option>
                                  <option value="block_1">Block 1</option>
                                <option value="block_2">Block 2</option>
                            </select>
                          </div>
                    </div>
                </div>
            </div>

            <div id="excuse-section" class="section-wrapper active-section">
                <div class="requests-container">
                   <div class="tabs-header">
                    <div class="tab active" data-target="e-pending-tab">Pending</div>
                    <div class="tab" data-target="e-approved-tab">Approved</div>
                    <div class="tab" data-target="e-declined-tab">Declined</div>
                  </div>

                   <div class="main-white-box">
                    
                    <div id="e-pending-tab" class="tab-content">
                      <div class="tab-top-controls" id="e-pending-controls">
                         <div class="search-container">
                          <input type="text" class="search-input e-search" placeholder="Search Name...">
                        </div>
                        <div class="sort-dropdown-container">
                           <button class="sort-btn e-sort-btn">Sort <span>⇌</span></button>
                          <div class="sort-menu e-sort-menu" style="display: none;">
                            <a href="#">Date Applied: Newest to Oldest</a>
                             <a href="#">Date Applied: Oldest to Newest</a>
                          </div>
                        </div>
                      </div>

                       <h2 class="box-title" id="e-pending-title">Pending Requests</h2>

                      <div id="e-pending-view">
                        <div class="cards-grid">
                          <div class="request-card">
                            <div class="card-body">
                              <div class="appeal-header">
                                 <div class="appeal-title-group">
                                  <span class="icon">📄</span> <h3 class="appeal-type">Emergency Leave</h3>
                                </div>
                                 <p class="apply-date">Applied on: March 2, 2026</p> 
                              </div>

                              <div class="appeal-detail-section card-details">
                                 <div class="detail-row">
                                  <span class="detail-label">Student Name:</span>
                                  <span class="detail-value student-name">[Student Name]</span>
                                 </div>
                                <div class="detail-row">
                                  <span class="detail-label">Student ID:</span>
                                   <span class="detail-value">2024-XXXXX</span>
                                </div>
                                <div class="detail-row">
                                   <span class="detail-label">College:</span>
                                  <span class="detail-value">College of Engineering</span>
                                </div>
                                 <div class="detail-row">
                                  <span class="detail-label">Program:</span>
                                  <span class="detail-value">BSCpE</span>
                                 </div>
                              </div>

                              <button class="review-btn e-review-btn full-width-btn">View Appeal Summary</button>
                             </div>
                          </div>
                        </div>
                      </div>
                  
                      <div id="e-pending-detail" style="display: none;">
                        <div class="detail-card-layout">
                          <div class="detail-top-actions">
                             <button class="back-btn" id="e-pending-back-btn">Back</button>
                          </div>
                          <div class="detail-content-row">
                            <div class="detail-left-col admin-style-details">
                              <div class="appeal-detail-section">
                                <div class="detail-row">
                                  <span class="detail-label">Student Name:</span>
                                  <span class="detail-value student-name">[Student Name]</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Student ID:</span>
                                  <span class="detail-value">2024-XXXXX</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">College:</span>
                                  <span class="detail-value">College of Engineering</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Program:</span>
                                  <span class="detail-value">BSCpE</span>
                                </div>
                                 <div class="detail-row">
                                  <span class="detail-label">Year</span>
                                  <span class="detail-value">2</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Block</span>
                                  <span class="detail-value">2</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Date Applied:</span>
                                  <span class="detail-value">March 1, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Appeal Type:</span>
                                  <span class="detail-value">[Value]</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Start Date:</span>
                                  <span class="detail-value">March 2, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">End Date:</span>
                                  <span class="detail-value">March 2, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Number of Days:</span>
                                  <span class="detail-value">1</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Return on:</span>
                                  <span class="detail-value">March 3, 2026</span>
                                </div>
                                 <div class="detail-row attachment-row">
                                <span class="detail-label">Attachment:</span>
                                <a href="#" class="attachment-link">[File Name]</a> 
                              </div>
                              <div class="detail-row updated-by-row">
                                <span class="detail-label">Status Updated by:</span>
                                <span class="detail-value">Prof. Juan Dela Cruz</span>
                              </div>
                              </div>
                            </div>
                             <div class="detail-right-col">
                               <div class="comment-section">
                                 <label><strong>Comment:</strong></label>
                                <textarea readonly class="comment-area"></textarea>
                                 </div>
                               <div class="detail-action-buttons right-aligned-buttons">
                                <button class="action-btn decline-btn e-trigger-decline">Decline</button>
                                 <button class="action-btn approve-btn e-trigger-approve">Approve</button>
                               </div>
                            </div>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div id="e-approved-tab" class="tab-content" style="display: none;">
                       <div class="tab-top-controls" id="e-approved-controls">
                         <div class="search-container">
                          <input type="text" class="search-input e-app-search" placeholder="Search Name...">
                        </div>
                         <div class="sort-dropdown-container">
                           <button class="sort-btn e-sort-btn">Sort <span>⇌</span></button>
                          <div class="sort-menu e-sort-menu" style="display: none;">
                             <a href="#">Date of Absence: Newest to Oldest</a>
                            <a href="#">Date of Absence: Oldest to Newest</a>
                            <a href="#">Date Approved: Newest to Oldest</a>
                             <a href="#">Date Approved: Oldest to Newest</a>
                          </div>
                        </div>
                      </div>

                       <h2 class="box-title" id="e-approved-title">Approved Requests</h2>

                      <div id="e-approved-view">
                        <div class="table-wrapper">
                          <table class="data-table">
                             <thead>
                               <tr>
                                <th></th>
                                 <th>Student Name</th>
                                <th>Date of Absence</th>
                                <th>Approval Date</th>
                                 <th>Attachment</th>
                               </tr>
                            </thead>
                            <tbody>
                               <tr class="approved-row">
                                <td>1</td>
                                <td>[Student Name]</td>
                                 <td>March 2, 2026</td>
                                <td>March 3, 2026</td>
                                <td><a href="#" class="attachment-link">[File Name]</a></td>
                               </tr>
                            </tbody>
                          </table>
                         </div>
                      </div>

                      <div id="e-approved-detail" style="display: none;">
                        <div class="detail-card-layout">
                           <div class="detail-top-actions">
                             <button class="back-btn" id="e-approved-back-btn">Back</button>
                          </div>
                          <div class="detail-content-row">
                            <div class="detail-left-col admin-style-details">
                              <div class="appeal-detail-section">
                                <div class="detail-row">
                                  <span class="detail-label">Student Name:</span>
                                  <span class="detail-value student-name">[Student Name]</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Student ID:</span>
                                  <span class="detail-value">2024-XXXXX</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">College:</span>
                                  <span class="detail-value">College of Engineering</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Program:</span>
                                  <span class="detail-value">BSCpE</span>
                                </div>
                                 <div class="detail-row">
                                  <span class="detail-label">Year</span>
                                  <span class="detail-value">2</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Block</span>
                                  <span class="detail-value">2</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Date Applied:</span>
                                  <span class="detail-value">March 1, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Appeal Type:</span>
                                  <span class="detail-value">[Value]</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Start Date:</span>
                                  <span class="detail-value">March 2, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">End Date:</span>
                                  <span class="detail-value">March 2, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Number of Days:</span>
                                  <span class="detail-value">1</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Return on:</span>
                                  <span class="detail-value">March 3, 2026</span>
                                </div>
                                <div class="detail-row attachment-row">
                              <span class="detail-label">Attachment:</span>
                              <a href="#" class="attachment-link">[File Name]</a> 
                            </div>
                            <div class="detail-row updated-by-row">
                              <span class="detail-label">Status Updated by:</span>
                              <span class="detail-value">Prof. Juan Dela Cruz</span>
                            </div>
                              </div>
                            </div>
                             <div class="detail-right-col">
                               <div class="comment-section">
                                <label><strong>Comment:</strong></label>
                                 <textarea readonly class="comment-area"></textarea>
                               </div>
                            </div>
                          </div>
                         </div>
                      </div>
                    </div>

                    <div id="e-declined-tab" class="tab-content" style="display: none;">
                       <div class="tab-top-controls" id="e-declined-controls">
                        <div class="search-container">
                           <input type="text" class="search-input e-dec-search" placeholder="Search Name...">
                        </div>
                         <div class="sort-dropdown-container">
                           <button class="sort-btn e-sort-btn">Sort <span>⇌</span></button>
                          <div class="sort-menu e-sort-menu" style="display: none;">
                             <a href="#">Date of Absence: Newest to Oldest</a>
                            <a href="#">Date of Absence: Oldest to Newest</a>
                            <a href="#">Date Declined: Newest to Oldest</a>
                             <a href="#">Date Declined: Oldest to Newest</a>
                          </div>
                        </div>
                      </div>

                       <h2 class="box-title" id="e-declined-title">Declined Requests</h2>

                      <div id="e-declined-view">
                        <div class="table-wrapper">
                          <table class="data-table">
                             <thead>
                              <tr>
                                <th></th>
                                 <th>Student Name</th>
                                <th>Date of Absence</th>
                                <th>Date Declined</th>
                                 <th>Attachment</th>
                              </tr>
                            </thead>
                            <tbody>
                               <tr class="declined-row">
                                 <td>1</td>
                                <td>[Student Name]</td>
                                 <td>March 2, 2026</td>
                                 <td>March 3, 2026</td>
                                <td><a href="#" class="attachment-link">[File Name]</a></td> 
                               </tr>
                            </tbody>
                          </table>
                        </div>
                       </div>

                      <div id="e-declined-detail" style="display: none;">
                        <div class="detail-card-layout">
                          <div class="detail-top-actions">
                             <button class="back-btn" id="e-declined-back-btn">Back</button>
                          </div>
                           <div class="detail-content-row">
                            <div class="detail-left-col admin-style-details">
                              <div class="appeal-detail-section">
                                <div class="detail-row">
                                  <span class="detail-label">Student Name:</span>
                                  <span class="detail-value student-name">[Student Name]</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Student ID:</span>
                                  <span class="detail-value">2024-XXXXX</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">College:</span>
                                  <span class="detail-value">College of Engineering</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Program:</span>
                                  <span class="detail-value">BSCpE</span>
                                </div>
                                 <div class="detail-row">
                                  <span class="detail-label">Year</span>
                                  <span class="detail-value">2</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Block</span>
                                  <span class="detail-value">2</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Date Applied:</span>
                                  <span class="detail-value">March 1, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Appeal Type:</span>
                                  <span class="detail-value">[Value]</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Start Date:</span>
                                  <span class="detail-value">March 2, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">End Date:</span>
                                  <span class="detail-value">March 2, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Number of Days:</span>
                                  <span class="detail-value">1</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Return on:</span>
                                  <span class="detail-value">March 3, 2026</span>
                                </div>
                                <div class="detail-row attachment-row">
                                <span class="detail-label">Attachment:</span>
                                <a href="#" class="attachment-link">[File Name]</a> 
                              </div>
                              <div class="detail-row updated-by-row">
                                <span class="detail-label">Status Updated by:</span>
                                <span class="detail-value">Prof. Juan Dela Cruz</span>
                              </div>
                              </div>
                            </div>
                             <div class="detail-right-col">
                              <div class="comment-section">
                               <label><strong>Comment:</strong></label>
                                <textarea readonly class="comment-area"></textarea>
                                </div>
                                <div class="detail-action-buttons right-aligned-buttons">
                                  <button class="action-btn e-trigger-reeval" style="background-color: #B88B2D;">Edit Status</button>
                              </div>
                            </div>
                           </div>
                         </div>
                      </div>
                    </div>

                  </div>
                </div>
             </div> 
            
            <div id="leave-section" class="section-wrapper">
                <div class="requests-container">
                  <div class="tabs-header">
                    <div class="tab active" data-target="l-pending-tab">Pending</div>
                     <div class="tab" data-target="l-approved-tab">Approved</div>
                    <div class="tab" data-target="l-declined-tab">Declined</div>
                  </div>

                  <div class="main-white-box">
                    
                    <div id="l-pending-tab" class="tab-content">
                      <div class="tab-top-controls" id="l-pending-controls">
                        <div class="search-container">
                          <input type="text" class="search-input l-search" placeholder="Search Name...">
                         </div>
                        <div class="sort-dropdown-container">
                          <button class="sort-btn l-sort-btn">Sort <span>⇌</span></button>
                          <div class="sort-menu l-sort-menu" style="display: none;">
                            <a href="#">Date Applied: Newest to Oldest</a>
                            <a href="#">Date Applied: Oldest to Newest</a>
                          </div>
                         </div>
                      </div>

                      <h2 class="box-title" id="l-pending-title">Pending Requests</h2>

                      <div id="l-pending-view">
                         <div class="cards-grid">
                          <div class="request-card">
                            <div class="card-body">
                                <div class="appeal-header">
                                  <div class="appeal-title-group">
                                  <span class="icon">📄</span> <h3 class="appeal-type">Emergency Leave</h3>
                                </div>
                                <p class="apply-date">Applied on: March 2, 2026</p> 
                               </div>

                              <div class="appeal-detail-section card-details">
                                <div class="detail-row">
                                   <span class="detail-label">Student Name:</span>
                                  <span class="detail-value student-name">[Student Name]</span>
                                </div>
                                 <div class="detail-row">
                                  <span class="detail-label">Student ID:</span>
                                  <span class="detail-value">2024-XXXXX</span>
                                 </div>
                                <div class="detail-row">
                                  <span class="detail-label">College:</span>
                                   <span class="detail-value">College of Engineering</span>
                                </div>
                                <div class="detail-row">
                                   <span class="detail-label">Program:</span>
                                  <span class="detail-value">BSCpE</span>
                                </div>
                               </div>

                              <button class="review-btn l-review-btn full-width-btn">View Appeal Summary</button>
                             </div>
                          </div>
                         </div>
                      </div>
                     
                      <div id="l-pending-detail" style="display: none;">
                         <div class="detail-card-layout">
                          <div class="detail-top-actions">
                            <button class="back-btn" id="l-pending-back-btn">Back</button>
                          </div>
                           <div class="detail-content-row">
                            <div class="detail-left-col admin-style-details">
                              <div class="appeal-detail-section">
                                <div class="detail-row">
                                  <span class="detail-label">Student Name:</span>
                                  <span class="detail-value student-name">[Student Name]</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Student ID:</span>
                                  <span class="detail-value">2024-XXXXX</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">College:</span>
                                  <span class="detail-value">College of Engineering</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Program:</span>
                                  <span class="detail-value">BSCpE</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Year</span>
                                  <span class="detail-value">2</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Block</span>
                                  <span class="detail-value">2</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Date Applied:</span>
                                  <span class="detail-value">March 2, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Appeal Type:</span>
                                  <span class="detail-value">Whole Day</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Start Date:</span>
                                  <span class="detail-value">March 3, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">End Date:</span>
                                  <span class="detail-value">March 5, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Number of Days:</span>
                                  <span class="detail-value">3</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Return on:</span>
                                  <span class="detail-value">March 6, 2026</span>
                                </div>
                                <div class="detail-row attachment-row">
                                <span class="detail-label">Attachment:</span>
                                <a href="#" class="attachment-link">[File Name]</a> 
                              </div>
                              <div class="detail-row updated-by-row">
                                <span class="detail-label">Status Updated by:</span>
                                <span class="detail-value">Prof. Juan Dela Cruz</span>
                              </div>
                              </div>
                            </div>
                             <div class="detail-right-col">
                               <div class="comment-section">
                               <label><strong>Comment:</strong></label>
                               <textarea readonly class="comment-area"></textarea>
                               </div>
                              <div class="detail-action-buttons right-aligned-buttons">
                                 <button class="action-btn decline-btn l-trigger-decline">Decline</button>
                                <button class="action-btn approve-btn l-trigger-approve">Approve</button>
                              </div>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div id="l-approved-tab" class="tab-content" style="display: none;">
                      <div class="tab-top-controls" id="l-approved-controls">
                        <div class="search-container">
                           <input type="text" class="search-input l-app-search" placeholder="Search Name...">
                         </div>
                        <div class="sort-dropdown-container">
                          <button class="sort-btn l-sort-btn">Sort <span>⇌</span></button>
                           <div class="sort-menu l-sort-menu" style="display: none;">
                            <a href="#">Leave Duration: Newest to Oldest</a>
                            <a href="#">Leave Duration: Oldest to Newest</a>
                            <a href="#">Date Approved: Newest to Oldest</a>
                            <a href="#">Date Approved: Oldest to Newest</a>
                          </div>
                        </div>
                       </div>

                      <h2 class="box-title" id="l-approved-title">Approved Requests</h2>

                      <div id="l-approved-view">
                        <div class="table-wrapper">
                           <table class="data-table">
                            <thead>
                              <tr>
                                 <th></th>
                                <th>Student Name</th>
                                <th>Leave Duration</th> 
                                <th>Approval Date</th>
                                <th>Attachment</th>
                              </tr>
                            </thead>
                             <tbody>
                              <tr class="approved-row l-approved-row">
                                <td>1</td>
                                 <td>[Student Name]</td>
                                <td>March 2, 2026 - March 6, 2026</td> 
                                <td>March 1, 2026</td>
                                 <td><a href="#" class="attachment-link">medical-cert.pdf</a></td>
                              </tr>
                            </tbody>
                           </table>
                        </div>
                      </div>

                      <div id="l-approved-detail" style="display: none;">
                         <div class="detail-card-layout">
                          <div class="detail-top-actions">
                            <button class="back-btn" id="l-approved-back-btn">Back</button>
                          </div>
                           <div class="detail-content-row">
                            <div class="detail-left-col admin-style-details">
                              <div class="appeal-detail-section">
                                <div class="detail-row">
                                  <span class="detail-label">Student Name:</span>
                                  <span class="detail-value student-name">[Student Name]</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Student ID:</span>
                                  <span class="detail-value">2024-XXXXX</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">College:</span>
                                  <span class="detail-value">College of Engineering</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Program:</span>
                                  <span class="detail-value">BSCpE</span>
                                </div>
                                 <div class="detail-row">
                                  <span class="detail-label">Year</span>
                                  <span class="detail-value">2</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Block</span>
                                  <span class="detail-value">2</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Date Applied:</span>
                                  <span class="detail-value">March 2, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Appeal Type:</span>
                                  <span class="detail-value">Whole Day</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Start Date:</span>
                                  <span class="detail-value">March 3, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">End Date:</span>
                                  <span class="detail-value">March 5, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Number of Days:</span>
                                  <span class="detail-value">3</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Return on:</span>
                                  <span class="detail-value">March 6, 2026</span>
                                </div>
                                <div class="detail-row attachment-row">
                                  <span class="detail-label">Attachment:</span>
                                  <a href="#" class="attachment-link">[File Name]</a> 
                                </div>
                                <div class="detail-row updated-by-row">
                                  <span class="detail-label">Status Updated by:</span>
                                  <span class="detail-value">Prof. Juan Dela Cruz</span>
                                </div>
                              </div>
                            </div>
                            <div class="detail-right-col">
                              <div class="comment-section">
                                <label><strong>Comment:</strong></label>
                                 <textarea readonly class="comment-area"></textarea>
                              </div>
                            </div>
                           </div>
                        </div>
                      </div>
                    </div>

                     <div id="l-declined-tab" class="tab-content" style="display: none;">
                      <div class="tab-top-controls" id="l-declined-controls">
                        <div class="search-container">
                          <input type="text" class="search-input l-dec-search" placeholder="Search Name...">
                         </div>
                        <div class="sort-dropdown-container">
                          <button class="sort-btn l-sort-btn">Sort <span>⇌</span></button>
                          <div class="sort-menu l-sort-menu" style="display: none;">
                              <a href="#">Leave Duration: Newest to Oldest</a>
                            <a href="#">Leave Duration: Oldest to Newest</a>
                            <a href="#">Date Declined: Newest to Oldest</a>
                               <a href="#">Date Declined: Oldest to Newest</a>
                          </div>
                        </div>
                      </div>

                       <h2 class="box-title" id="l-declined-title">Declined Requests</h2>

                      <div id="l-declined-view">
                        <div class="table-wrapper">
                          <table class="data-table">
                             <thead>
                              <tr>
                                <th></th>
                                  <th>Student Name</th>
                                <th>Leave Duration</th> 
                                <th>Date Declined</th>
                                  <th>Attachment</th> 
                              </tr>
                            </thead>
                              <tbody>
                               <tr class="declined-row l-declined-row">
                                <td>1</td>
                                  <td>[Student Name]</td>
                                <td>March 2, 2026 - March 6, 2026</td> 
                                <td>March 3, 2026</td>
                                  <td><a href="#" class="attachment-link">No attached proof</a></td>
                               </tr>
                            </tbody>
                           </table>
                         </div>
                      </div>

                      <div id="l-declined-detail" style="display: none;">
                         <div class="detail-card-layout">
                            <div class="detail-top-actions">
                            <button class="back-btn" id="l-declined-back-btn">Back</button>
                          </div>
                             <div class="detail-content-row">
                            <div class="detail-left-col admin-style-details">
                              <div class="appeal-detail-section">
                                 <div class="detail-row">
                                  <span class="detail-label">Student Name:</span>
                                  <span class="detail-value student-name">[Student Name]</span>
                                 </div>
                                <div class="detail-row">
                                     <span class="detail-label">Student ID:</span>
                                   <span class="detail-value">2024-XXXXX</span>
                                </div>
                                 <div class="detail-row">
                                   <span class="detail-label">College:</span>
                                  <span class="detail-value">College of Engineering</span>
                                 </div>
                                 <div class="detail-row">
                                  <span class="detail-label">Program:</span>
                                   <span class="detail-value">BSCpE</span>
                                  </div>
                                   <div class="detail-row">
                                  <span class="detail-label">Year</span>
                                  <span class="detail-value">2</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Block</span>
                                  <span class="detail-value">2</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Date Applied:</span>
                                   <span class="detail-value">March 2, 2026</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Appeal Type:</span>
                                  <span class="detail-value">Whole Day</span>
                                 </div>
                                <div class="detail-row">
                                  <span class="detail-label">Start Date:</span>
                                   <span class="detail-value">March 3, 2026</span>
                                </div>
                                <div class="detail-row">
                                   <span class="detail-label">End Date:</span>
                                  <span class="detail-value">March 5, 2026</span>
                                </div>
                               <div class="detail-row">
                                  <span class="detail-label">Number of Days:</span>
                                  <span class="detail-value">3</span>
                                 </div>
                                <div class="detail-row">
                                  <span class="detail-label">Return on:</span>
                                   <span class="detail-value">March 6, 2026</span>
                                </div>
                               <div class="detail-row attachment-row">
                            <span class="detail-label">Attachment:</span>
                            <a href="#" class="attachment-link">[File Name]</a> 
                          </div>
                          <div class="detail-row updated-by-row">
                            <span class="detail-label">Status Updated by:</span>
                            <span class="detail-value">Prof. Juan Dela Cruz</span>
                          </div>
                                </div>
                            </div>
                            <div class="detail-right-col">
                                <div class="comment-section">
                                <label><strong>Comment:</strong></label>
                                 <textarea readonly class="comment-area"></textarea>
                               </div>
                               <div class="detail-action-buttons right-aligned-buttons" style="justify-content: flex-end; margin-top: 10px;">
                                 <button class="action-btn l-trigger-reeval" style="background-color: #B88B2D;">Edit Status</button>
                              </div>
                            </div>
                           </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
            </div> 
        </main>
    </div>

    <div id="modal-overlay" class="modal-overlay"></div>

    <div id="e-approve-modal" class="modal">
      <div class="modal-header" style="background-color: #2F8C2F;">Request Approved!</div>
      <div class="modal-body">
        <p><strong>Attendance record has been updated to Excused.</strong></p>
         <button class="modal-btn back-to-pending-btn e-back-pending">Back to Pending Request</button>
      </div>
    </div>

    <div id="l-approve-modal" class="modal">
      <div class="modal-header" style="background-color: #2F8C2F;">Leave Request Approved!</div>
      <div class="modal-body">
        <p><strong>Student will be marked as 'On Leave' for the specified dates.</strong></p>
        <button class="modal-btn back-to-pending-btn l-back-pending">Back to Pending Request</button>
      </div>
    </div>

    <div id="decline-success-modal" class="modal">
      <div class="modal-header" style="background-color: #9C2727;">Request Declined!</div>
        <div class="modal-body">
        <p><strong>The student will be marked as Absent.</strong></p>
        <button class="modal-btn back-to-pending-btn reset-pending-btn">Back to Pending Request</button>
      </div>
    </div>

    <div id="reeval-confirm-modal" class="modal">
      <div class="modal-header" style="background-color: #C19321;">Update Appeal Status</div>
      <div class="modal-body">
        <p><strong>Are you sure you want to update this request? This will move the record back to the Pending tab.</strong></p>
        <div class="modal-action-row" style="justify-content: center; gap: 15px;">
          <button id="cancel-reeval-btn" class="modal-btn" style="background-color: #9C2727; color: #FFFFFF;">Cancel</button>
          <button id="confirm-reeval-btn" class="modal-btn" style="background-color: #2F8C2F; color: #FFFFFF;">Confirm</button>
        </div>
      </div>
    </div>

    <div id="reeval-success-modal" class="modal">
      <div class="modal-header" style="background-color: #C19321;">Update Appeal Status</div>
      <div class="modal-body">
          <p><strong>Success! Request moved back to Pending for further review.</strong></p>
        <button class="modal-btn reset-pending-btn" style="background-color: #E0E0E0; color: #333333;">Back to Pending Request</button>
      </div>
    </div>

    <script src="facultydashboardSTUDENT.js"></script>
</body>
</html>