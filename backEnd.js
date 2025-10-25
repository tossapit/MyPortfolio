tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                },
            },
            plugins: [
                function ({ addComponents }) {
                    addComponents({
                        ".nav-link": {
                            "@apply text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors":
                                {},
                        },
                        ".mobile-nav-link": {
                            "@apply block px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors":
                                {},
                        },
                        ".skill-badge": {
                            "@apply bg-indigo-100 text-indigo-800 text-lg font-medium px-4 py-2 rounded-full dark:bg-indigo-900 dark:text-indigo-200 transition-colors":
                                {},
                        },
                        ".form-input": {
                            "@apply w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-500 transition-colors":
                                {},
                        },
                    });
                },
            ],
        };

        document.addEventListener("DOMContentLoaded", () => {
            const menuBtn = document.getElementById("mobile-menu-btn");
            const mobileMenu = document.getElementById("mobile-menu");

            menuBtn.addEventListener("click", () => {
                mobileMenu.classList.toggle("hidden");
            });

            const allSmoothScrollLinks = document.querySelectorAll('a[href^="#"]');

            allSmoothScrollLinks.forEach((link) => {
                link.addEventListener("click", function (event) {
                    event.preventDefault();

                    const href = this.getAttribute("href");
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (href === "#" || href === "#home") {
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        });
                    } else if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: "smooth",
                        });
                    }
                    if (mobileMenu.contains(this)) {
                        mobileMenu.classList.add("hidden");
                    }
                });
            });

            // Dark Mode Script (Unchanged)
            const themeToggleBtns = [
                document.getElementById("theme-toggle-btn"),
                document.getElementById("theme-toggle-btn-mobile"),
            ];
            const darkIcons = [
                document.getElementById("theme-toggle-dark-icon"),
                document.getElementById("theme-toggle-dark-icon-mobile"),
            ];
            const lightIcons = [
                document.getElementById("theme-toggle-light-icon"),
                document.getElementById("theme-toggle-light-icon-mobile"),
            ];
            const html = document.documentElement;
            function updateIcons(theme) {
                if (theme === "dark") {
                    darkIcons.forEach((icon) => icon.classList.remove("hidden"));
                    lightIcons.forEach((icon) => icon.classList.add("hidden"));
                } else {
                    darkIcons.forEach((icon) => icon.classList.add("hidden"));
                    lightIcons.forEach((icon) => icon.classList.remove("hidden"));
                }
            }
            function setTheme(theme) {
                html.classList.remove("dark", "light");
                html.classList.add(theme);
                localStorage.setItem("theme", theme);
                updateIcons(theme);
            }
            const currentTheme =
                localStorage.getItem("theme") ||
                (window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light");
            setTheme(currentTheme);
            themeToggleBtns.forEach((btn) => {
                btn.addEventListener("click", () => {
                    const isDark = html.classList.contains("dark");
                    setTheme(isDark ? "light" : "dark");
                });
            });

            // === LIGHTBOX SCRIPT (CHANGED) ===
            (function () {
                const lightboxModal = document.getElementById("lightbox-modal");
                // (CHANGED) Get both IMG and VIDEO elements
                const lightboxImg = document.getElementById("lightbox-img");
                const lightboxVideo = document.getElementById("lightbox-video");

                const lightboxClose = document.getElementById("lightbox-close");
                const lightboxPrev = document.getElementById("lightbox-prev");
                const lightboxNext = document.getElementById("lightbox-next");

                const groups = {};
                document.querySelectorAll("[data-lightbox]").forEach((el) => {
                    const gallery = el.dataset.gallery || "default";
                    const src = el.dataset.src || el.querySelector("img")?.src;
                    if (!src) return;
                    if (!groups[gallery]) groups[gallery] = [];
                    groups[gallery].push(src);
                    el.dataset.lightboxIndex = (groups[gallery].length - 1).toString();
                    el.addEventListener("click", () => openLightbox(gallery, parseInt(el.dataset.lightboxIndex)));
                });

                let currentGallery = [];
                let currentIndex = 0;

                // (CHANGED) Updated openLightbox function
                function openLightbox(gallery, index) {
                    currentGallery = groups[gallery] || [];
                    if (!currentGallery.length) return;
                    currentIndex = index || 0;

                    const src = currentGallery[currentIndex];

                    // Check file extension
                    if (src.endsWith(".mp4")) {
                        // It's a video
                        lightboxVideo.src = src;
                        lightboxVideo.classList.remove("hidden"); // Show video
                        lightboxImg.classList.add("hidden");    // Hide image
                        lightboxVideo.play();
                    } else {
                        // It's an image
                        lightboxImg.src = src;
                        lightboxImg.classList.remove("hidden");    // Show image
                        lightboxVideo.classList.add("hidden");    // Hide video
                    }

                    lightboxModal.classList.remove("hidden");
                    document.documentElement.style.overflow = "hidden";
                    updateNav();
                }

                // (CHANGED) Updated closeLightbox function
                function closeLightbox() {
                    lightboxModal.classList.add("hidden");

                    // Reset and pause both elements
                    lightboxImg.src = "";
                    lightboxVideo.pause();
                    lightboxVideo.src = "";

                    // Hide both
                    lightboxImg.classList.add("hidden");
                    lightboxVideo.classList.add("hidden");

                    document.documentElement.style.overflow = "";
                }

                // (CHANGED) Updated showIndex function (for prev/next)
                function showIndex(i) {
                    if (!currentGallery.length) return;
                    currentIndex = (i + currentGallery.length) % currentGallery.length;

                    const src = currentGallery[currentIndex];

                    // Stop video before switching
                    lightboxVideo.pause();

                    if (src.endsWith(".mp4")) {
                        // It's a video
                        lightboxVideo.src = src;
                        lightboxVideo.classList.remove("hidden");
                        lightboxImg.classList.add("hidden");
                        lightboxVideo.play();
                    } else {
                        // It's an image
                        lightboxImg.src = src;
                        lightboxImg.classList.remove("hidden");
                        lightboxVideo.classList.add("hidden");
                    }

                    updateNav();
                }

                // Unchanged functions below
                function updateNav() {
                    const single = currentGallery.length <= 1;
                    lightboxPrev.style.display = single ? "none" : "flex";
                    lightboxNext.style.display = single ? "none" : "flex";
                }

                lightboxClose.addEventListener("click", closeLightbox);

                lightboxPrev.addEventListener("click", (e) => {
                    e.stopPropagation();
                    showIndex(currentIndex - 1);
                });
                lightboxNext.addEventListener("click", (e) => {
                    e.stopPropagation();
                    showIndex(currentIndex + 1);
                });

                lightboxModal.addEventListener("click", (e) => {
                    if (e.target === lightboxModal) closeLightbox();
                });

                document.addEventListener("keydown", (e) => {
                    if (lightboxModal.classList.contains("hidden")) return;
                    if (e.key === "Escape") closeLightbox();
                    if (e.key === "ArrowLeft") showIndex(currentIndex - 1);
                    if (e.key === "ArrowRight") showIndex(currentIndex + 1);
                });
            })();
        });