// Vision AI - Main Global Logic
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('mainNav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.innerText = nav.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu on link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.innerText = '☰';
            });
        });
    }

    // Scroll Header Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 5, 5, 0.9)';
            header.style.padding = '10px 5%';
        } else {
            header.style.background = 'var(--glass)';
            header.style.padding = '0 5%';
        }
    });

    // Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            btn.innerText = 'Transmitting...';
            setTimeout(() => {
                btn.innerText = 'Initialized Successfully';
                contactForm.reset();
            }, 1500);
        });
    }
});
