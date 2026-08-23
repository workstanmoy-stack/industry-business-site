

// ============ HERO CAROUSEL ============
const heroCarousel = document.querySelector("#hero-carousel");

if (heroCarousel) {
    const slides = [...heroCarousel.querySelectorAll(".hero-slide")];
    const dots = [...heroCarousel.querySelectorAll(".hero-dot")];
    const dotFills = [...heroCarousel.querySelectorAll(".hero-dot-fill")];
    const counter = heroCarousel.querySelector("#hero-counter");
    const prevBtn = heroCarousel.querySelector("#hero-prev");
    const nextBtn = heroCarousel.querySelector("#hero-next");
    const total = slides.length;
    const interval = Number(heroCarousel.dataset.interval) || 6000;

    let current = 0;
    let timer = null;
    let fillAnimation = null;

    const pad = (n) => String(n + 1).padStart(2, "0");

    const renderDots = () => {
        dots.forEach((dot, i) => {
            dot.querySelector(".hero-dot-fill").style.transition = "none";
            dot.querySelector(".hero-dot-fill").style.width = i < current ? "100%" : "0%";
        });
    };

    const animateActiveDot = () => {
        const fill = dotFills[current];
        if (!fill) return;
        fill.style.transition = "none";
        fill.style.width = "0%";
        void fill.offsetWidth;
        fill.style.transition = `width ${interval}ms linear`;
        fill.style.width = "100%";
    };

    const goTo = (index) => {
        current = (index + total) % total;
        slides.forEach((slide, i) => {
            slide.style.opacity = i === current ? "1" : "0";
        });
        if (counter) counter.textContent = `${pad(current)} / ${pad(total - 1)}`;
        renderDots();
        animateActiveDot();
        resetTimer();
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    const resetTimer = () => {
        clearInterval(timer);
        timer = setInterval(next, interval);
    };

    dots.forEach((dot) => {
        dot.addEventListener("click", () => goTo(Number(dot.dataset.goto)));
    });
    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    heroCarousel.addEventListener("mouseenter", () => clearInterval(timer));
    heroCarousel.addEventListener("mouseleave", resetTimer);

    goTo(0);
}

// ============ STAT COUNTERS ============
const statNumbers = document.querySelectorAll(".stat-number");

if (statNumbers.length) {
    const animateCount = (el) => {
        const target = Number(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || "";
        const duration = 1200;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach((el) => statObserver.observe(el));
}

// ============ SCROLL REVEAL ============
const revealTargets = document.querySelectorAll(".reveal-up, .reveal-item");

if (revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealTargets.forEach((el) => revealObserver.observe(el));
}

// ============ FAQ ACCORDION ============
document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;
    question.addEventListener("click", () => {
        const wasOpen = item.classList.contains("is-open");
        const parentContainer = item.closest(".reveal-group") || item.parentElement;

        if (parentContainer) {
            parentContainer.querySelectorAll(".faq-item.is-open").forEach((open) => {
                open.classList.remove("is-open");
            });
        }

        if (!wasOpen) item.classList.add("is-open");
    });
});

// ===============================
// INSIGHTS / PERSPECTIVES SLIDER
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const featuredCard = document.getElementById("featuredCard");
    const featuredImage = document.getElementById("featuredImage");
    const featuredCategory = document.getElementById("featuredCategory");
    const featuredTitle = document.getElementById("featuredTitle");
    const featuredBody = document.getElementById("featuredBody");
    const sideCards = document.getElementById("sideCards");
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");

    if (!featuredCard || !sideCards) return;

    const insights = [{
        image: "https://picsum.photos/900/600?random=1",
        category: "Cloud",
        title: "Accelerating enterprise cloud transformation.",
        body: "Helping organizations modernize infrastructure and build resilient digital ecosystems."
    },
    {
        image: "https://picsum.photos/900/600?random=2",
        category: "AI",
        title: "Making AI practical for business.",
        body: "Transforming enterprise data into measurable operational value."
    },
    {
        image: "https://picsum.photos/900/600?random=3",
        category: "Cyber Security",
        title: "Building resilient enterprises.",
        body: "Security strategies designed for modern cloud-first organizations."
    },
    {
        image: "https://picsum.photos/900/600?random=4",
        category: "ERP",
        title: "Modern ERP for global organizations.",
        body: "Connecting operations seamlessly across multi-national departments."
    },
    {
        image: "https://picsum.photos/900/600?random=5",
        category: "Data",
        title: "Turning enterprise data into decisions.",
        body: "Building intelligent data pipelines for forward-thinking organizations."
    },
    {
        image: "https://picsum.photos/900/600?random=6",
        category: "Digital",
        title: "Designing modern customer experiences.",
        body: "Creating scalable digital web and mobile products customers love."
    }
    ];

    let current = 0;

    function render() {
        const featured = insights[current];

        featuredCard.classList.add("fade-out");

        setTimeout(() => {
            if (featuredImage) featuredImage.src = featured.image;
            if (featuredCategory) featuredCategory.textContent = featured.category;
            if (featuredTitle) featuredTitle.textContent = featured.title;
            if (featuredBody) featuredBody.textContent = featured.body;

            let html = "";
            for (let i = 1; i <= 3; i++) {
                const item = insights[(current + i) % insights.length];

                html += `
                    <article class="group rounded-2xl overflow-hidden bg-white shadow hover:shadow-xl transition cursor-pointer">
                        <div class="overflow-hidden">
                            <img
                                src="${item.image}"
                                alt="${item.title}"
                                class="w-full h-40 object-cover group-hover:scale-105 transition duration-700">
                        </div>
                        <div class="p-5">
                            <div class="uppercase text-[11px] tracking-[.3em] text-blue-600 font-semibold">
                                ${item.category}
                            </div>
                            <h4 class="font-bold text-xl text-slate-900 mt-3 leading-snug">
                                ${item.title}
                            </h4>
                            <a class="inline-flex items-center gap-2 mt-5 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                                Read More →
                            </a>
                        </div>
                    </article>
                `;
            }

            sideCards.innerHTML = html;

            featuredCard.classList.remove("fade-out");
            featuredCard.classList.add("fade-in");

            setTimeout(() => {
                featuredCard.classList.remove("fade-in");
            }, 450);

        }, 450);
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            current = (current + 1) % insights.length;
            render();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            current = (current - 1 + insights.length) % insights.length;
            render();
        });
    }

    render();
});

// ===============================
// WHY CHOOSE US ACCORDION
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const panels = document.querySelectorAll(".whyPanel");

    function activate(panel) {
        panels.forEach(item => {
            item.classList.remove("active");
            item.setAttribute("aria-expanded", "false");
        });

        panel.classList.add("active");
        panel.setAttribute("aria-expanded", "true");
    }

    panels.forEach(panel => {
        panel.addEventListener("click", () => activate(panel));
        panel.addEventListener("mouseenter", () => activate(panel));
        panel.addEventListener("focus", () => activate(panel));
        panel.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                activate(panel);
            }
        });
    });
});

// ===============================
// INDUSTRY SECTION JS
// ===============================
const mobileButtons = document.querySelectorAll(".industryMobile");
const desktopItems = document.querySelectorAll(".industryItem");

function updateIndustryCard(data) {
    const image = document.getElementById("industryImage");
    const category = document.getElementById("industryCategory");
    const title = document.getElementById("industryTitle");
    const desc = document.getElementById("industryDesc");
    const tags = document.getElementById("industryTags");

    if (!image) return;

    image.classList.add("industryFade");

    setTimeout(() => {
        image.src = data.img;
        category.textContent = data.name;
        title.textContent = data.title;
        desc.textContent = data.desc;

        tags.innerHTML = "";
        data.tags.split("|").forEach(tag => {
            tags.innerHTML += `<span class="industryTag">${tag}</span>`;
        });

        image.classList.remove("industryFade");
    }, 250);
}

function setActiveIndustry(name) {
    mobileButtons.forEach(btn => {
        if (btn.dataset.name === name) {
            btn.classList.remove("bg-slate-100", "text-slate-700", "border-slate-200");
            btn.classList.add("bg-blue-600", "text-white", "border-blue-600");
        } else {
            btn.classList.remove("bg-blue-600", "text-white", "border-blue-600");
            btn.classList.add("bg-slate-100", "text-slate-700", "border-slate-200");
        }
    });

    desktopItems.forEach(item => {
        const heading = item.querySelector("h4");
        const arrow = item.querySelector("span");

        if (item.dataset.name === name) {
            item.classList.add("border-blue-600");
            if (heading) heading.classList.add("text-blue-600");
            if (arrow) arrow.classList.add("translate-x-2", "text-blue-600");
        } else {
            item.classList.remove("border-blue-600");
            if (heading) heading.classList.remove("text-blue-600");
            if (arrow) arrow.classList.remove("translate-x-2", "text-blue-600");
        }
    });
}

mobileButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        updateIndustryCard(btn.dataset);
        setActiveIndustry(btn.dataset.name);
    });
});

desktopItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
        updateIndustryCard(item.dataset);
        setActiveIndustry(item.dataset.name);
    });

    item.addEventListener("click", () => {
        updateIndustryCard(item.dataset);
        setActiveIndustry(item.dataset.name);
    });
});