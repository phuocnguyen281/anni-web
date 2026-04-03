/* ===================================
   ANNIVERSARY LANDING PAGE — JavaScript
   Hoàng Phước & Thu Sang
   =================================== */

(function () {
    'use strict';

    // ========== CONFIG ==========
    const WEDDING_DATE = new Date('2020-04-04T00:00:00+07:00');
    const PHOTOS = [
        'images/photo1.jpg',
        'images/photo2.jpg',
        'images/photo3.jpg',
        'images/photo4.jpg',
        'images/photo5.jpg',
        'images/photo6.jpg',
        'images/photo7.jpg',
        'images/photo8.jpg',
        'images/photo9.jpg',
        'images/photo10.jpg',
        'images/photo11.jpg',
        'images/photo12.jpg',
        'images/photo13.jpg',
        'images/photo14.jpg',
        'images/photo15.jpg',
    ];

    // ========== SCROLL FADE ANIMATIONS ==========
    function initScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.scroll-fade').forEach((el, i) => {
            el.style.transitionDelay = `${i % 4 * 0.1}s`;
            observer.observe(el);
        });
    }

    // ========== LOVE COUNTER ==========
    function updateCounter() {
        const now = new Date();
        const diff = now - WEDDING_DATE;

        // Calculate years, months, days, hours
        const years = now.getFullYear() - WEDDING_DATE.getFullYear();
        const months =
            (now.getFullYear() - WEDDING_DATE.getFullYear()) * 12 +
            (now.getMonth() - WEDDING_DATE.getMonth());

        const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(diff / (1000 * 60 * 60));

        animateNumber('counter-years', years);
        animateNumber('counter-months', months);
        animateNumber('counter-days', totalDays);
        animateNumber('counter-hours', totalHours);
    }

    function animateNumber(id, target) {
        const el = document.getElementById(id);
        if (!el) return;

        const current = parseInt(el.textContent.replace(/,/g, ''), 10) || 0;
        if (current === target) return;

        const duration = 1500;
        const startTime = performance.now();

        function step(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(current + (target - current) * eased);
            el.textContent = value.toLocaleString('vi-VN');

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString('vi-VN');
            }
        }

        requestAnimationFrame(step);
    }

    // Update counter every minute
    let counterInitialized = false;
    function initCounter() {
        if (counterInitialized) return;
        counterInitialized = true;
        updateCounter();
        setInterval(updateCounter, 60000);
    }

    // Observe counter section to trigger animation
    function observeCounter() {
        const counterSection = document.getElementById('counter');
        if (!counterSection) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        initCounter();
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(counterSection);
    }

    // ========== PHOTO GALLERY LIGHTBOX ==========
    let currentPhotoIndex = 0;

    function initGallery() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');

        if (!lightbox) return;

        // Click on gallery items
        document.querySelectorAll('.gallery-item').forEach((item) => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index, 10);
                openLightbox(index);
            });
        });

        // Close
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Navigation
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(-1);
        });
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(1);
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });

        function openLightbox(index) {
            currentPhotoIndex = index;
            lightboxImg.src = PHOTOS[index];
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function navigateLightbox(direction) {
            currentPhotoIndex =
                (currentPhotoIndex + direction + PHOTOS.length) % PHOTOS.length;
            lightboxImg.src = PHOTOS[currentPhotoIndex];
        }
    }

    // ========== ROSE PETALS ANIMATION ==========
    function createPetal() {
        const container = document.getElementById('rose-petals');
        if (!container) return;

        const petal = document.createElement('div');
        petal.classList.add('petal');

        // Random properties
        const x = Math.random() * 100;
        const size = Math.random() * 12 + 8;
        const duration = Math.random() * 8 + 10;
        const delay = Math.random() * 5;
        const rotation = Math.random() * 360;

        // Rose petal SVG
        const colors = ['#E8B4B8', '#D4A8A8', '#f0c8cc', '#dbb5b5', '#F5D5D8'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        petal.innerHTML = `
            <svg width="${size}" height="${size}" viewBox="0 0 20 20" style="transform: rotate(${rotation}deg)">
                <ellipse cx="10" cy="10" rx="8" ry="5" fill="${color}" opacity="0.7"/>
            </svg>
        `;

        petal.style.left = `${x}%`;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay = `${delay}s`;

        container.appendChild(petal);

        // Remove after animation completes
        setTimeout(
            () => {
                if (petal.parentNode) {
                    petal.parentNode.removeChild(petal);
                }
            },
            (duration + delay) * 1000
        );
    }

    function initPetals() {
        // Create initial petals
        for (let i = 0; i < 8; i++) {
            setTimeout(() => createPetal(), i * 600);
        }
        // Keep creating petals
        setInterval(createPetal, 2500);
    }

    // ========== PROPOSAL SECTION ROSES ==========
    function initProposalRoses() {
        const container = document.getElementById('proposal-roses');
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Burst of rose petals
                        for (let i = 0; i < 20; i++) {
                            setTimeout(() => createProposalPetal(container), i * 200);
                        }
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(container.parentElement);
    }

    function createProposalPetal(container) {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        const x = Math.random() * 100;
        const size = Math.random() * 14 + 10;
        const duration = Math.random() * 6 + 6;
        const rotation = Math.random() * 360;

        const colors = ['#E8B4B8', '#D4A8A8', '#f0c8cc', '#C8A96E', '#E8D5A8'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        petal.innerHTML = `
            <svg width="${size}" height="${size}" viewBox="0 0 20 20" style="transform: rotate(${rotation}deg)">
                <ellipse cx="10" cy="10" rx="8" ry="5" fill="${color}" opacity="0.8"/>
            </svg>
        `;

        petal.style.left = `${x}%`;
        petal.style.animationDuration = `${duration}s`;

        container.appendChild(petal);

        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
        }, duration * 1000);
    }

    // ========== BACKGROUND MUSIC (YouTube IFrame API) ==========
    let ytPlayer = null;
    let isPlaying = false;

    function initMusic() {
        const btn = document.getElementById('music-toggle');
        if (!btn) return;

        // Initially show muted icon
        updateMusicButton(false);

        btn.addEventListener('click', toggleMusic);

        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(tag, firstScript);

        // Auto-play on first user interaction
        let autoPlayed = false;
        function autoPlay() {
            if (!autoPlayed) {
                autoPlayed = true;
                startMusic();
                document.removeEventListener('click', autoPlay);
                document.removeEventListener('touchstart', autoPlay);
                document.removeEventListener('scroll', autoPlay);
            }
        }

        document.addEventListener('click', autoPlay, { once: false });
        document.addEventListener('touchstart', autoPlay, { once: false });
        document.addEventListener('scroll', autoPlay, { once: false });
    }

    // Called by YouTube IFrame API when ready
    window.onYouTubeIframeAPIReady = function () {
        ytPlayer = new YT.Player('yt-player', {
            events: {
                onReady: function () {
                    ytPlayer.setVolume(50);
                },
            },
        });
    };

    function startMusic() {
        if (isPlaying) return;
        try {
            if (ytPlayer && ytPlayer.playVideo) {
                ytPlayer.playVideo();
            } else {
                // Fallback: try again after API loads
                setTimeout(startMusic, 1000);
                return;
            }
            isPlaying = true;
            updateMusicButton(true);
        } catch (e) {
            console.warn('YouTube player error:', e);
        }
    }

    function stopMusic() {
        if (!isPlaying) return;
        try {
            if (ytPlayer && ytPlayer.pauseVideo) {
                ytPlayer.pauseVideo();
            }
        } catch (e) {
            console.warn('YouTube player error:', e);
        }
        isPlaying = false;
        updateMusicButton(false);
    }

    function toggleMusic() {
        if (isPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    }

    function updateMusicButton(playing) {
        const btn = document.getElementById('music-toggle');
        const iconOn = document.getElementById('music-icon-on');
        const iconOff = document.getElementById('music-icon-off');

        if (!btn) return;

        if (playing) {
            btn.classList.add('playing');
            iconOn.classList.remove('hidden');
            iconOff.classList.add('hidden');
        } else {
            btn.classList.remove('playing');
            iconOn.classList.add('hidden');
            iconOff.classList.remove('hidden');
        }
    }

    // ========== SMOOTH SCROLL ==========
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ========== PARALLAX SUBTLE ==========
    function initParallax() {
        const heroBg = document.querySelector('.hero-bg');
        if (!heroBg) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (scrollY < window.innerHeight) {
                        heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ========== INIT ==========
    function init() {
        initScrollAnimations();
        observeCounter();
        initGallery();
        initPetals();
        initProposalRoses();
        initMusic();
        initSmoothScroll();
        initParallax();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
