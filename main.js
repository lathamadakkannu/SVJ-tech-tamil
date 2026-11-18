/* ==========================================================
   DATA
   ========================================================== */
const websiteData = {
    latestVideos: [
        { image: 'images/upcoming4.jpeg' },
        { image: 'images/upcoming5.jpeg' },
        { image: 'images/upcoming6.jpeg' },
        { image: 'images/upcoming7.jpeg' },
        { image: 'images/upcoming8.jpeg' },
        { image: 'images/upcoming9.jpeg' },
        { image: 'images/upcoming10.jpeg' }
    ],
    upcomingVideos: [
        { image: 'images/upcoming4.jpeg' },
        { image: 'images/upcoming5.jpeg' },
        { image: 'images/upcoming6.jpeg' },
        { image: 'images/upcoming7.jpeg' },
        { image: 'images/upcoming8.jpeg' },
        { image: 'images/upcoming9.jpeg' },
        { image: 'images/upcoming10.jpeg' },
        { image: 'images/upcoming11.jpeg' },
        { image: 'images/upcoming12.jpeg' },
        { image: 'images/upcoming13.jpeg' },
        { image: 'images/upcoming14.jpeg' },
        { image: 'images/upcoming15.jpeg' }
    ],
    topics: [
        {
            name: 'Frontend Development',
            image: 'images/frontend.jpg',
            technologies: ['HTML5', 'CSS3', 'JavaScript']
        },
        { name: 'React', image: 'images/react.jfif' },
        { name: 'Angular JS', image: 'images/angular.png' },
        { name: 'Node.js', image: 'images/node.png' },
        { name: 'MySQL', image: 'images/mysql.png' },
        { name: 'MongoDB', image: 'images/mongodb.png' },
        { name: 'Spring Boot', image: 'images/spring.jfif' },
        { name: 'PostgreSQL', image: 'images/postgresql.jfif' }
    ]
};

/* ==========================================================
   INIT
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
    initSliders();
    populateTopics();
    setupSmoothScrolling();
    setupFormValidation();
});

/* ==========================================================
   SLIDERS
   ========================================================== */
function initSliders() {
    new Slider({
        container: '.latest-slider',
        items: websiteData.latestVideos
    });

    new Slider({
        container: '.upcoming-slider',
        items: websiteData.upcomingVideos
    });
}

class Slider {
    constructor(options) {
        this.container = document.querySelector(options.container);
        this.items = options.items;
        this.currentIndex = 0;
        this.slidesToShow = this.getSlidesToShow();

        this.init();
        this.setupEventListeners();
    }

    getSlidesToShow() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    }

    init() {
        this.container.innerHTML = '';
        this.items.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `<img src="${item.image}" alt="Video thumbnail" loading="lazy">`;
            this.container.appendChild(slide);
        });
        this.updateSlider();
    }

    setupEventListeners() {
        const wrapper = this.container.parentNode;
        const prevBtn = wrapper.querySelector('.prev-btn');
        const nextBtn = wrapper.querySelector('.next-btn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const next = this.getSlidesToShow();
                if (next !== this.slidesToShow) {
                    this.slidesToShow = next;
                    this.currentIndex = 0;
                    this.updateSlider();
                }
            }, 150);
        });
    }

    prev() {
        const maxIndex = Math.max(0, this.items.length - this.slidesToShow);
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : maxIndex;
        this.updateSlider();
    }

    next() {
        const maxIndex = Math.max(0, this.items.length - this.slidesToShow);
        this.currentIndex = this.currentIndex < maxIndex ? this.currentIndex + 1 : 0;
        this.updateSlider();
    }

    updateSlider() {
        const slideEl = this.container.querySelector('.slide');
        if (!slideEl) return;

        const style = window.getComputedStyle(slideEl);
        const slideWidth = slideEl.offsetWidth +
                           parseFloat(style.marginLeft) +
                           parseFloat(style.marginRight);

        const translateX = -this.currentIndex * slideWidth;
        this.container.style.transform = `translateX(${translateX}px)`;
    }
}

/* ==========================================================
   TOPICS
   ========================================================== */
function populateTopics() {
    const topicsGrid = document.querySelector('.topics-grid');
    if (!topicsGrid) return;

    websiteData.topics.forEach(topic => {
        const topicCard = document.createElement('div');
        topicCard.className = 'topic-card';

        let html = `<img src="${topic.image}" alt="${topic.name}" loading="lazy">`;

        if (topic.technologies) {
            const techTags = topic.technologies
                .map(tech => `<span class="tech-tag">${tech}</span>`)
                .join('');
            html += `
                <div class="topic-name">
                    ${topic.name}
                    <div class="tech-tags">${techTags}</div>
                </div>`;
        } else {
            html += `<div class="topic-name">${topic.name}</div>`;
        }

        topicCard.innerHTML = html;
        topicsGrid.appendChild(topicCard);
    });
}

/* ==========================================================
   SMOOTH SCROLLING
   ========================================================== */
function setupSmoothScrolling() {
    const header = document.querySelector('.header');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({ top: targetPosition, behavior: 'smooth' });

            const toggle = document.getElementById('nav-toggle');
            if (toggle) toggle.checked = false;
        });
    });
}

/* ==========================================================
   FORM VALIDATION
   ========================================================== */
function setupFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim()) clearError(nameInput);
    });

    emailInput.addEventListener('input', () => {
        const val = emailInput.value.trim();
        if (val && isValidEmail(val)) {
            clearError(emailInput);
        } else if (val) {
            showError(emailInput, 'Please enter a valid email');
        } else {
            clearError(emailInput);
        }
    });

    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim()) clearError(messageInput);
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        if (!nameInput.value.trim()) {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else clearError(nameInput);

        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else clearError(emailInput);

        if (!messageInput.value.trim()) {
            showError(messageInput, 'Message is required');
            isValid = false;
        } else clearError(messageInput);

        if (isValid) {
            showToast('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        }
    });
}

function showError(input, message) {
    clearError(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
    input.classList.add('error');
}

function clearError(input) {
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) errorDiv.remove();
    input.classList.remove('error');
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/* ==========================================================
   TOAST NOTIFICATION
   ========================================================== */
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const iconClass = type === 'success' ? 'check-circle' : 'exclamation-circle';

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${iconClass}"></i>
        <span>${message}</span>
        <button class="toast-close" aria-label="Close">&times;</button>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
    }, 4000);
}