// premium-motion.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Elements
    const grain = document.createElement("div");
    grain.className = "grain-overlay";
    document.body.appendChild(grain);

    // 2. Initialize Lenis (Smooth Scrolling)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Buttery easing
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // 3. Custom Cheese Cursor
    const isEditMode = window.location.search.includes('edit_mode=true');
    
    if (!isEditMode) {
        document.body.classList.add('hide-native-cursor');
        const cursor = document.createElement("div");
        cursor.className = "custom-cursor";
        document.body.appendChild(cursor);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor follow
        gsap.ticker.add(() => {
            const dt = 1.0 - Math.pow(1.0 - 0.25, gsap.ticker.deltaRatio()); 
            cursorX += (mouseX - cursorX) * dt;
            cursorY += (mouseY - cursorY) * dt;
            const velocityX = mouseX - cursorX;
            const rotate = Math.max(-15, Math.min(15, velocityX * 0.5));
            
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) rotate(${rotate}deg)`;
        });

        // Interactive elements hover
        const interactables = document.querySelectorAll("a, button, input, textarea, select, .btn-hover-effect");
        interactables.forEach(el => {
            el.addEventListener("mouseenter", () => cursor.classList.add("active"));
            el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
        });
    }

    // 4. GSAP Magnetic Buttons
    const magnets = document.querySelectorAll('.btn-hover-effect');
    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const position = magnet.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;

            gsap.to(magnet, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.8,
                ease: "power3.out"
            });
        });

        magnet.addEventListener('mouseleave', () => {
            gsap.to(magnet, {
                x: 0,
                y: 0,
                duration: 1,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // 5. Hero Entrance Animation
    const heroContent = document.querySelector("header .max-w-3xl") || document.querySelector("section .max-w-4xl");
    if (heroContent) {
        gsap.fromTo(heroContent.children, 
            { y: 80, opacity: 0, rotateX: -15, scale: 0.95 },
            { 
                y: 0, 
                opacity: 1, 
                rotateX: 0,
                scale: 1,
                duration: 1.8, 
                stagger: 0.15, 
                ease: "expo.out",
                delay: 0.2
            }
        );
    }

    // 6. Global Section Reveals (Progressive, Cinematic)
    const sections = document.querySelectorAll("section:not(header)");
    sections.forEach(section => {
        gsap.fromTo(section, 
            { opacity: 0, y: 100 },
            {
                opacity: 1,
                y: 0,
                duration: 1.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    end: "top 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // 7. Advanced Parallax & Image Unmasking
    // Replaced Shery.js with native DOM GSAP masking to prevent disappearing WebGL canvas issues.
    const images = document.querySelectorAll("img:not(.object-contain)");
    images.forEach(img => {
        if (img.width > 200 || img.classList.contains("object-cover")) {
            // First wrap the image to allow mask revealing
            const wrapper = document.createElement("div");
            wrapper.style.overflow = "hidden";
            wrapper.style.position = "relative";
            wrapper.style.borderRadius = window.getComputedStyle(img).borderRadius;
            wrapper.style.width = "100%";
            wrapper.style.height = "100%";
            
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);

            gsap.fromTo(wrapper,
                { clipPath: "inset(100% 0 0 0)" },
                {
                    clipPath: "inset(0% 0 0 0)",
                    duration: 1.5,
                    ease: "power3.inOut",
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top 85%",
                    }
                }
            );

            gsap.fromTo(img,
                { scale: 1.2, yPercent: -10 },
                {
                    scale: 1,
                    yPercent: 10,
                    ease: "none",
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                }
            );
        }
    });

    // 8. Text Elements Stagger (Headings)
    const headings = document.querySelectorAll("h2, h3");
    headings.forEach(heading => {
        gsap.fromTo(heading,
            { opacity: 0, x: -30 },
            {
                opacity: 1,
                x: 0,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: heading,
                    start: "top 85%",
                }
            }
        );
    });

    // 9. Opening Hours List Stagger
    const hoursContainer = document.querySelector('.bg-white.p-xl.rounded-2xl .space-y-sm');
    if (hoursContainer && hoursContainer.children.length > 0) {
        gsap.fromTo(hoursContainer.children,
            { opacity: 0, x: -30, filter: "blur(5px)" },
            {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 1,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: hoursContainer,
                    start: "top 80%",
                }
            }
        );
    }

    // 10. Mobile Menu Toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
});
