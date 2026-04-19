/*
 * Astraea Academy - Interactive Landing Page
 */

// ==========================================
// GALAXY BACKGROUND SYSTEM
// ==========================================
class GalaxyBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.shootingStars = [];
        this.mouse = { x: 0, y: 0, active: false };
        this.config = {
            starCount: 250,
            starBaseSize: 1.2,
            speed: 0.03,
            shootingStarFrequency: 0.008
        };
        this.init();
    }

    init() {
        this.resize();
        this.createStars();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    createStars() {
        this.stars = [];
        for (let i = 0; i < this.config.starCount; i++) {
            this.stars.push(this.createStar());
        }
    }

    createStar() {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.max(this.canvas.width, this.canvas.height) * 0.8;
        return {
            x: this.centerX + Math.cos(angle) * distance,
            y: this.centerY + Math.sin(angle) * distance,
            z: Math.random() * 2 + 0.5,
            size: Math.random() * this.config.starBaseSize + 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2
        };
    }

    createShootingStar() {
        const startX = Math.random() < 0.5 ? -50 : this.canvas.width + 50;
        const startY = Math.random() * this.canvas.height * 0.5;
        const angle = Math.random() < 0.5 ? Math.PI / 4 : Math.PI * 0.75;
        const speed = Math.random() * 4 + 3;
        return {
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed * (startX < 0 ? 1 : -1),
            vy: Math.sin(angle) * speed,
            length: Math.random() * 100 + 50,
            life: 1,
            decay: 0.012,
            width: Math.random() * 2 + 1
        };
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.active = true;
            this.updateCursor(e.clientX, e.clientY);
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.active = false;
        });
    }

    updateCursor(x, y) {
        const cursor = document.getElementById('cursor');
        if (cursor) {
            cursor.style.left = x + 'px';
            cursor.style.top = y + 'px';
            cursor.classList.add('active');
        }
    }

    updateStars() {
        const time = Date.now() * 0.001;
        this.stars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
            
            if (this.mouse.active) {
                const dx = (this.mouse.x - this.centerX) * 0.02 * star.z;
                const dy = (this.mouse.y - this.centerY) * 0.02 * star.z;
                star.x += (dx - star.x * 0.01) * 0.1;
                star.y += (dy - star.y * 0.01) * 0.1;
            }
            
            star.x += Math.sin(time * 0.3 + star.z) * 0.08;
            star.y += Math.cos(time * 0.2 + star.z) * 0.08;
            
            const margin = 100;
            if (star.x < -margin) star.x = this.canvas.width + margin;
            if (star.x > this.canvas.width + margin) star.x = -margin;
            if (star.y < -margin) star.y = this.canvas.height + margin;
            if (star.y > this.canvas.height + margin) star.y = -margin;
            
            star.currentOpacity = star.opacity * twinkle;
        });
    }

    updateShootingStars() {
        if (Math.random() < this.config.shootingStarFrequency) {
            this.shootingStars.push(this.createShootingStar());
        }
        this.shootingStars = this.shootingStars.filter(star => {
            star.x += star.vx;
            star.y += star.vy;
            star.life -= star.decay;
            return star.life > 0;
        });
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            const size = star.size * star.z * 0.6;
            const opacity = star.currentOpacity;
            
            const gradient = this.ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, size * 4
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
            gradient.addColorStop(0.3, `rgba(255, 240, 200, ${opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, size * 4, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.fill();
        });
        
        this.shootingStars.forEach(star => {
            const tailX = star.x - star.vx * (star.length / 6);
            const tailY = star.y - star.vy * (star.length / 6);
            
            const gradient = this.ctx.createLinearGradient(star.x, star.y, tailX, tailY);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.life})`);
            gradient.addColorStop(0.4, `rgba(255, 200, 150, ${star.life * 0.6})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.beginPath();
            this.ctx.moveTo(star.x, star.y);
            this.ctx.lineTo(tailX, tailY);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = star.width;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
            
            const headGradient = this.ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, 6
            );
            headGradient.addColorStop(0, `rgba(255, 255, 255, ${star.life})`);
            headGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, 6, 0, Math.PI * 2);
            this.ctx.fillStyle = headGradient;
            this.ctx.fill();
        });
    }

    animate() {
        this.updateStars();
        this.updateShootingStars();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// LOGO INTERACTION SYSTEM
// ==========================================
class LogoInteraction {
    constructor() {
        this.logo = document.getElementById('academy-logo');
        this.container = document.getElementById('logo-container');
        this.clicked = false;
        this.init();
    }

    init() {
        if (!this.logo || !this.container) return;
        
        this.container.addEventListener('click', (e) => {
            if (this.clicked) return;
            this.clicked = true;
            this.createRipple(e);
            this.transitionToScene2();
        });

        setTimeout(() => {
            if (!this.clicked) {
                this.clicked = true;
                this.transitionToScene2();
            }
        }, 10000);
    }

    createRipple(e) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        const rect = this.container.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.5;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.container.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    }

    transitionToScene2() {
        const scene1 = document.getElementById('scene-1');
        const scene2 = document.getElementById('scene-2');
        const badge = document.getElementById('id-badge');
        
        scene1.style.transition = 'opacity 1s ease, transform 1s ease';
        scene1.style.opacity = '0';
        scene1.style.transform = 'scale(1.1)';
        
        if (badge) {
            badge.style.transition = 'all 0.5s ease';
            badge.style.transform = 'translateY(-500px) rotate(-10deg)';
            badge.style.opacity = '0';
        }
        
        setTimeout(() => {
            scene1.style.display = 'none';
            scene2.classList.add('active');
        }, 1000);
    }
}

// ==========================================
// ID BADGE PHYSICS
// ==========================================
class IDBadgePhysics {
    constructor() {
        this.badge = document.getElementById('id-badge');
        this.mouseX = 0;
        this.targetRotation = 0;
        this.currentRotation = 0;
        this.init();
    }

    init() {
        if (!this.badge) return;
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.handleMouseMove(e);
        });
        
        this.animate();
    }

    handleMouseMove(e) {
        if (!this.badge) return;
        const badgeRect = this.badge.getBoundingClientRect();
        const badgeCenterX = badgeRect.left + badgeRect.width / 2;
        const distX = e.clientX - badgeCenterX;
        const distance = Math.abs(distX);
        
        if (distance < 400) {
            const maxRotation = 8;
            this.targetRotation = (distX / 400) * maxRotation;
        } else {
            this.targetRotation = 0;
        }
    }

    animate() {
        if (!this.badge) return;
        
        this.currentRotation += (this.targetRotation - this.currentRotation) * 0.1;
        
        const computedStyle = window.getComputedStyle(this.badge);
        const animationName = computedStyle.animationName;
        
        if (animationName && animationName.includes('badgeSwing')) {
            this.badge.style.transform = `rotate(${this.currentRotation}deg)`;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================
function navigateTo(role) {
    const loginCard = document.getElementById('login-card');
    const scene2 = document.getElementById('scene-2');
    const schoolFacade = document.querySelector('.school-facade');
    const lockersBg = document.querySelector('.lockers-bg');
    const scrapbook = document.querySelector('.scrapbook-decoration');
    const cloud = document.querySelector('.cloud-image');
    
    // Fade out background elements
    if (schoolFacade) {
        schoolFacade.style.transition = 'opacity 0.6s ease';
        schoolFacade.style.opacity = '0';
    }
    if (lockersBg) {
        lockersBg.style.transition = 'opacity 0.6s ease';
        lockersBg.style.opacity = '0';
    }
    if (scrapbook) {
        scrapbook.style.transition = 'opacity 0.6s ease';
        scrapbook.style.opacity = '0';
    }
    if (cloud) {
        cloud.style.transition = 'opacity 0.6s ease';
        cloud.style.opacity = '0';
    }
    
    // Slide card to center
    if (loginCard) {
        const rect = loginCard.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        
        const translateX = centerX - cardCenterX;
        const translateY = centerY - cardCenterY;
        
        loginCard.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        loginCard.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.05)`;
        loginCard.style.zIndex = '1000';
    }
    
    // Navigate after animation
<<<<<<< HEAD
    setTimeout(() => {
        window.location.href = `${role}login.html`;
    }, 800);
}
=======
        setTimeout(() => {
            window.location.href = `${role}/${role}login.php`;
        }, 800);
}   
>>>>>>> 61fa391ed86d853022c510978d504960baf9947c

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('galaxy-canvas');
    if (canvas) {
        new GalaxyBackground(canvas);
    }

    new LogoInteraction();
    new IDBadgePhysics();
    
    document.body.style.cursor = 'none';
    
    console.log('✨ Astraea Academy initialized - Welcome, Stellar!');
});
