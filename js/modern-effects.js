// CINEMATIC MODERN EFFECTS SCRIPT
// Adds custom cursor, smooth reveal animations, and page transitions.

document.addEventListener("DOMContentLoaded", () => {
    // 1. Setup Page Transition Element
    const transitionEl = document.createElement("div");
    transitionEl.classList.add("page-transition");
    document.body.appendChild(transitionEl);

    // Initial load animation
    if (typeof gsap !== 'undefined') {
        gsap.to(transitionEl, {
            scaleY: 0,
            duration: 1.2,
            ease: "power4.inOut",
            onComplete: () => {
                transitionEl.style.display = "none";
            }
        });
    } else {
        transitionEl.style.display = "none";
    }



    // Observer for cinematic reveals
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const applyReveals = () => {
        const autoRevealTargets = document.querySelectorAll("h1, h2, h3, .work-info p, .timeline-card p, .sc-points li");
        autoRevealTargets.forEach(el => {
            if (!el.classList.contains("fade-up") && !el.classList.contains("cinematic-reveal")) {
                el.classList.add("cinematic-reveal");
                revealObserver.observe(el);
            }
        });

        const imgTargets = document.querySelectorAll("img:not(.work-img)");
        imgTargets.forEach(img => {
            if (!img.closest('.img-hover-wrap') && !img.closest('.anim-logo-box')) {
                const wrap = document.createElement('div');
                wrap.classList.add('img-hover-wrap');
                if (img.parentNode) {
                    img.parentNode.insertBefore(wrap, img);
                    wrap.appendChild(img);
                }
            }
        });
        
        // Ensure manual cinematic reveals are observed
        document.querySelectorAll(".cinematic-reveal:not(.observed)").forEach(el => {
            el.classList.add("observed");
            revealObserver.observe(el);
        });
        

    };

    // Initial apply
    applyReveals();

    // Observe DOM for dynamic changes from CMS
    const domObserver = new MutationObserver(() => {
        applyReveals();
    });
    domObserver.observe(document.body, { childList: true, subtree: true });
    
    // Page transition out on link click
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", (e) => {
            if (link.hostname === window.location.hostname && !link.hash && link.target !== "_blank") {
                e.preventDefault();
                const targetUrl = link.href;
                transitionEl.style.display = "block";
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(transitionEl, 
                        { scaleY: 0, transformOrigin: "top" },
                        { scaleY: 1, duration: 0.8, ease: "power4.inOut", onComplete: () => {
                            window.location.href = targetUrl;
                        }}
                    );
                } else {
                    window.location.href = targetUrl;
                }
            }
        });
    });
});
