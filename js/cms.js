// Vision AI CMS Engine - Gaa-tha version

const CMS = {
    data: null,

    async init() {
        try {
            const response = await fetch('/api/data');
            if (response.ok) {
                this.data = await response.json();
                this.hydrateAll();

                // FIX: Because CMS fetches async, GSAP animations might have already run
                // on the old blank elements. When we inject new ones, they stay hidden.
                // We force them to be visible here so content doesn't stay hidden.
                setTimeout(() => {
                    document.querySelectorAll('.stunner, .fade-up, .timeline-card, .gsap-card').forEach(el => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                        el.classList.add('visible');
                    });
                     // Also restart ScrollTrigger to recalibrate heights
                    if (window.ScrollTrigger) ScrollTrigger.refresh();
                }, 100);
            }
        } catch (error) {
            console.error('CMS Init Error:', error);
        }
    },

    hydrateAll() {
        if (!this.data) return;

        // --- GLOBAL ---
        this.updateElements('.logo', this.data.settings.siteName);
        this.updateElements('.footer-logo', this.data.settings.siteName);
        this.updateElements('.copyright', this.data.settings.copyright);
        this.updateElements('.info-block p:first-child', this.data.settings.email, true); // rough mapping
        
        // CSS Variables
        document.documentElement.style.setProperty('--accent', this.data.settings.brandColor);

        // --- HOME PAGE (`#split-text` means it's the home page) ---
        if (document.getElementById('split-text')) {
            // Hero
            // We have to recreate the split text logic
            const titleEl = document.getElementById('split-text');
            if (titleEl && !titleEl.hasAttribute('data-hydrated')) {
                titleEl.setAttribute('data-hydrated', 'true');
                const text = this.data.home.heroTitle;
                titleEl.innerHTML = '';
                text.split('').forEach(char => {
                    if(char === ' ' || char === '<' || char === 'b' || char === 'r' || char === '>') {
                         // handle <br> roughly if needed, or just let user type normal text
                        if(char === ' ') titleEl.innerHTML += `<span class="char">&nbsp;</span>`;
                        else titleEl.innerHTML += `<span class="word"><span class="char">${char}</span></span>`;
                    } else {
                        titleEl.innerHTML += `<span class="word"><span class="char">${char}</span></span>`;
                    }
                });
            }

            this.updateElement('.hero-subtitle', this.data.home.heroSubtitle);
            
            // Marquee
            const tracks = document.querySelectorAll('.marquee-item');
            if (tracks.length > 0) {
                tracks.forEach(t => t.innerHTML = this.data.home.marqueeText);
            }

            // CTA Home
            this.updateElement('.cta-title', this.data.home.ctaTitle);
            this.updateElement('.cta-section .btn-large', this.data.home.ctaBtnText);
        }

        // --- ABOUT PAGE (timeline-section) ---
        if (document.querySelector('.timeline-section')) {
            this.updateElement('.hero h1', this.data.about.heroTitle);
            
            const tl = document.querySelector('.timeline-section');
            if (tl && tl.children.length > 1) { // has line + items
                // Rebuild timeline items
                const line = `<div class="timeline-line"></div>`;
                let itemsHtml = '';
                this.data.about.timeline.forEach(item => {
                    itemsHtml += `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-card">
                            <h4>${item.title}</h4>
                            <h5>${item.subtitle}</h5>
                            <p>${item.text}</p>
                        </div>
                    </div>`;
                });
                tl.innerHTML = line + itemsHtml;

                // Re-init observer for new elements
                if (window.observer) {
                    document.querySelectorAll('.timeline-card').forEach(card => window.observer.observe(card));
                }
            }
        }

        // --- PORTFOLIO PAGE (.portfolio-grid) ---
        if (document.querySelector('.portfolio-grid')) {
            this.updateElement('.hero-tag', this.data.portfolio.heroTag);
            this.updateElement('.hero-title', this.data.portfolio.heroTitle);

            const grid = document.querySelector('.portfolio-grid');
            if (grid) {
                grid.innerHTML = '';
                this.data.portfolio.items.forEach(item => {
                    grid.innerHTML += `
                    <div class="project-card stunner hover-target">
                        <div class="project-img-container">
                            <img src="${item.image}" alt="${item.title}" class="project-img" style="${item.filterStyle}">
                            <div class="play-icon"></div>
                        </div>
                        <div class="project-meta">
                            <div class="project-info">
                                <h3>${item.title}</h3>
                                <p>${item.subtitle}</p>
                            </div>
                            <div class="project-year">${item.year}</div>
                        </div>
                    </div>`;
                });
            }
        }

        // --- SERVICES PAGE (.service-list) ---
        if (document.querySelector('.service-list')) {
            this.updateElement('.hero-tag', this.data.services.heroTag);
            this.updateElement('.hero-title', this.data.services.heroTitle);

            const sList = document.querySelector('.service-list');
            if (sList) {
                sList.innerHTML = '';
                this.data.services.items.forEach(item => {
                    sList.innerHTML += `
                    <div class="service-item stunner hover-target">
                        <div class="s-num">${item.num}</div>
                        <div class="s-name">${item.name}</div>
                        <div class="s-desc">${item.desc}</div>
                    </div>`;
                });
            }
        }

        // --- CONTACT PAGE (.contact-container) ---
        if (document.querySelector('.contact-container')) {
            this.updateElement('.contact-header h1', this.data.contact.title);
            this.updateElement('.contact-header p', this.data.contact.desc);
            
            const infoBlocks = document.querySelectorAll('.info-block');
            if (infoBlocks.length >= 2) {
                infoBlocks[0].querySelector('h4').innerHTML = this.data.contact.emailLabel;
                infoBlocks[0].querySelector('p').innerHTML = this.data.settings.email;
                infoBlocks[1].querySelector('h4').innerHTML = this.data.contact.visitLabel;
                infoBlocks[1].querySelector('p').innerHTML = this.data.contact.visitText;
            }
        }
    },

    updateElement(selector, content, isText = false) {
        const el = document.querySelector(selector);
        if (el) {
            if (isText) el.innerText = content;
            else el.innerHTML = content;
        }
    },
    
    updateElements(selector, content) {
        document.querySelectorAll(selector).forEach(el => el.innerHTML = content);
    }
};

CMS.init();
