/*
 * Astraea Academy - Faculty Login Page
 */

// ==========================================
// CUSTOM CURSOR
// ==========================================
class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.init();
    }

    init() {
        if (!this.cursor) return;
        
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
            this.cursor.classList.add('active');
        });

        document.addEventListener('mouseleave', () => {
            this.cursor.classList.remove('active');
        });
    }
}

// ==========================================
// PASSWORD TOGGLE
// ==========================================
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        eyeIcon.textContent = '👁';
    }
}

// ==========================================
// FORM VALIDATION & SUBMISSION
// ==========================================
class LoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.uidInput = document.getElementById('uid');
        this.passwordInput = document.getElementById('password');
        this.loginBtn = document.querySelector('.login-btn');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        this.uidInput.addEventListener('blur', () => this.validateUID());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
    }

    validateUID() {
        const uid = this.uidInput.value.trim();
        if (!uid) {
            this.showError(this.uidInput, 'Please enter your UID');
            return false;
        }
        this.clearError(this.uidInput);
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        if (!password) {
            this.showError(this.passwordInput, 'Please enter your password');
            return false;
        }
        if (password.length < 6) {
            this.showError(this.passwordInput, 'Password must be at least 6 characters');
            return false;
        }
        this.clearError(this.passwordInput);
        return true;
    }

    showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorEl = formGroup.querySelector('.error-message');
        
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            formGroup.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        input.style.borderColor = '#d1478c';
    }

    clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorEl = formGroup.querySelector('.error-message');
        
        if (errorEl) {
            errorEl.remove();
        }
        
        input.style.borderColor = 'rgba(255, 255, 255, 0.6)';
    }

    handleSubmit() {
<<<<<<< HEAD
        const isUIDValid = this.validateUID();
        const isPasswordValid = this.validatePassword();
        
        if (isUIDValid && isPasswordValid) {
            this.setLoading(true);
            
            setTimeout(() => {
                this.setLoading(false);
                this.showSuccessMessage();
            }, 1500);
        }
=======
        // const isUIDValid = this.validateUID();
        // const isPasswordValid = this.validatePassword();
        const formData = new FormData(this.form);

        // if (isUIDValid && isPasswordValid) {
            this.setLoading(true);
            
            fetch('facultylogin_process.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(status => {
                const result = status.trim();

                if (result === 'first_login' || result === 'dashboard') {
                    this.showSuccessMessage();
                    setTimeout(() => {
                        if (result === 'first_login') {
                            window.location.href = 'faculty_change_password.php';
                        } else if (result === 'dashboard') {
                            window.location.href = 'facultydashboardHOME.php';
                        }
                    }, 2000);
                } else {
                    this.setLoading(false);
                    alert('Login Failed: ' + result);
                    this.passwordInput.value = '';
                }
            })
            
            .catch(error => {
            this.setLoading(false);
            console.error('Error:', error);
            });
        // }
>>>>>>> 61fa391ed86d853022c510978d504960baf9947c
    }

    setLoading(loading) {
        if (loading) {
            this.loginBtn.classList.add('loading');
            this.loginBtn.disabled = true;
        } else {
            this.loginBtn.classList.remove('loading');
            this.loginBtn.disabled = false;
        }
    }

    showSuccessMessage() {
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 100;
            animation: fadeIn 0.2s ease;
        `;
        
        overlay.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 15px;">✨</div>
            <h3 style="font-family: Inter, sans-serif; font-size: 22px; color: #4a1c3d; margin-bottom: 10px;">Welcome Back!</h3>
            <p style="font-size: 14px; color: #5a3d4a;">Redirecting to your dashboard...</p>
        `;
        
        document.querySelector('.login-card').appendChild(overlay);
        
        setTimeout(() => {
<<<<<<< HEAD
            alert('Welcome to the Student Portal!');
=======
            alert('Welcome to the Faculty Portal!');
>>>>>>> 61fa391ed86d853022c510978d504960baf9947c
            overlay.remove();
        }, 1000);
    }
}

// ==========================================
// NAVIGATION
// ==========================================
function goBack() {
    const loginCard = document.querySelector('.login-card');
    loginCard.style.transform = 'translateX(100px)';
    loginCard.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 400);

}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
    new LoginForm();
    document.body.style.cursor = 'none';
<<<<<<< HEAD
    console.log('✨ Student Login initialized');
=======
    console.log('✨ Faculty Login initialized');
>>>>>>> 61fa391ed86d853022c510978d504960baf9947c
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(style);
