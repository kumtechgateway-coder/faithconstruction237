// /script.js

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const jsonCache = new Map();
    let reviewsPromise = null;

    async function fetchJson(url) {
        if (jsonCache.has(url)) {
            return jsonCache.get(url);
        }
        const request = (async () => {
            if (window.location.protocol === 'file:') {
                throw new Error('Data cannot be loaded from local files. Please use a local server.');
            }
            const response = await fetch(url, { cache: 'force-cache' });
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);
            return response.json();
        })().catch(error => {
            jsonCache.delete(url);
            throw error;
        });
        jsonCache.set(url, request);
        return request;
    }

    function slugify(value) {
        return String(value || '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function getSharedReviewSet(reviews, limit = 6) {
        return [...reviews]
            .sort((a, b) => {
                if (b.year !== a.year) return b.year - a.year;
                if (b.rating !== a.rating) return b.rating - a.rating;
                return a.author.localeCompare(b.author);
            })
            .slice(0, Math.min(limit, reviews.length));
    }

    function clampRating(value) {
        const parsed = Number(value);
        if (Number.isNaN(parsed)) return 5;
        return Math.max(1, Math.min(5, Math.round(parsed)));
    }

    function getInitials(name) {
        const parts = String(name || 'Client')
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2);
        if (!parts.length) return 'CL';
        return parts.map(part => part[0].toUpperCase()).join('');
    }

    function normalizeReview(review) {
        return {
            quote: String(review.quote || '').trim(),
            author: String(review.author || 'Verified Client').trim(),
            location: String(review.location || 'Cameroon').trim(),
            rating: clampRating(review.rating),
            service: String(review.service || 'General Construction').trim(),
            projectType: String(review.projectType || 'Residential').trim(),
            year: Number(review.year) || new Date().getFullYear(),
            verified: review.verified !== false
        };
    }

    function normalizeReviews(reviews) {
        if (!Array.isArray(reviews)) return [];
        return reviews.map(normalizeReview).filter(review => review.quote && review.author);
    }

    async function getReviews() {
        if (!reviewsPromise) {
            reviewsPromise = fetchJson('/assets/data/reviews.json').then(normalizeReviews);
        }
        return reviewsPromise;
    }

    // Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined' && !prefersReducedMotion) {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    function refreshScrollAnimations() {
        if (typeof AOS === 'undefined' || prefersReducedMotion) return;
        window.requestAnimationFrame(() => {
            AOS.refreshHard();
        });
    }

    // Initialize Lightbox
    if (typeof lightbox !== 'undefined' && document.querySelector('[data-lightbox]')) {
        lightbox.option({
            resizeDuration: 200,
            wrapAround: true,
            albumLabel: 'Project %1 of %2'
        });
    }

    // Projects functionality
    const projectsGrid = document.getElementById('projects-grid');
    const featuredGrid = document.getElementById('featured-projects-grid');
    const projectFilters = document.getElementById('project-filters');

    if (projectsGrid || featuredGrid) {
        loadProjects();
    }

    // Reviews system
    const testimonialSlider = document.getElementById('testimonial-slider');
    if (testimonialSlider) {
        loadTestimonials();
    }

    const aboutTestimonialsGrid = document.getElementById('testimonials-grid');
    if (aboutTestimonialsGrid) {
        loadGridTestimonials({
            gridId: 'testimonials-grid',
            summaryId: 'testimonials-summary',
            filterId: 'testimonials-filter',
            reviewSelector: reviews => getSharedReviewSet(reviews, 6)
        });
    }

    const projectTestimonialsGrid = document.getElementById('project-testimonials-grid');
    if (projectTestimonialsGrid) {
        loadGridTestimonials({
            gridId: 'project-testimonials-grid',
            summaryId: 'project-testimonials-summary',
            filterId: 'project-testimonials-filter',
            reviewSelector: reviews => getSharedReviewSet(reviews, 6)
        });
    }

    async function loadProjects() {
        try {
            const projects = await fetchJson('/assets/data/data.json');

            // Initial render
            renderProjects(projects);

            // Setup filters
            if (projectFilters) {
                setupFilters(projects);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            const errorMsg = `<p class="text-center col-span-full text-red-500">${error.message}</p>`;
            if (projectsGrid) projectsGrid.innerHTML = errorMsg;
            if (featuredGrid) featuredGrid.innerHTML = errorMsg;
        }
    }

    function renderProjects(projects) {
        // Render main grid if it exists
        if (projectsGrid) {
            projectsGrid.innerHTML = '';
            const fragment = document.createDocumentFragment();
            projects.forEach((project, index) => {
                fragment.appendChild(createProjectCard(project, index));
            });
            projectsGrid.appendChild(fragment);
            refreshScrollAnimations();
        }

        // Render featured grid if it exists (limit to 3)
        if (featuredGrid) {
            featuredGrid.innerHTML = '';
            const fragment = document.createDocumentFragment();
            const shuffled = [...projects];
            // Fisher-Yates shuffle to show random projects
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            shuffled.slice(0, 3).forEach((project, index) => {
                fragment.appendChild(createProjectCard(project, index));
            });
            featuredGrid.appendChild(fragment);
            refreshScrollAnimations();
        }
    }

    function createProjectCard(project, index) {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-item';
        projectCard.setAttribute('data-aos', 'fade-up');
        projectCard.setAttribute('data-aos-delay', `${100 + index * 100}`);

        const getCategoryLabel = cat => {
            const labels = {
                luxury: 'Luxury Villa',
                modern: 'Modern Home',
                renovation: 'Renovation',
                estate: 'Estate'
            };
            return labels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
        };

        projectCard.innerHTML = `
            <div class="project-img-wrapper">
                <a href="${escapeHtml(project.image)}" data-lightbox="featured-projects" data-title="${escapeHtml(project.title)}">
                    <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" loading="lazy" decoding="async" width="300" height="230">
                </a>
                ${project.status ? `<span class="status-badge">${escapeHtml(project.status)}</span>` : ''}
                <span class="category-badge">${escapeHtml(getCategoryLabel(project.category))}</span>
            </div>
            <div class="project-info">
                <h3 class="truncate"></h3>
                <p class="line-clamp-3"></p>
                <a href="project-detail.html?title=${encodeURIComponent(project.title)}" class="view-details-btn">View Details</a>
            </div>
        `;
        projectCard.querySelector('h3').textContent = project.title;
        projectCard.querySelector('p').textContent = project.description;
        return projectCard;
    }

    function setupFilters(allProjects) {
        const buttons = projectFilters.querySelectorAll('button');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(button => {
                    button.classList.remove('bg-[#1A1A1A]', 'text-white', 'shadow-lg');
                    button.classList.add('bg-white', 'text-gray-600', 'shadow-sm');
                });

                btn.classList.remove('bg-white', 'text-gray-600', 'shadow-sm');
                btn.classList.add('bg-[#1A1A1A]', 'text-white', 'shadow-lg');

                const filterValue = btn.getAttribute('data-filter');
                const slugMap = {
                    'Luxury Villas': 'luxury',
                    'Modern Homes': 'modern',
                    Renovations: 'renovation',
                    Estates: 'estate'
                };

                if (filterValue === 'all') {
                    renderProjects(allProjects);
                } else {
                    const filtered = allProjects.filter(p => (slugMap[p.category] || p.category.toLowerCase()) === filterValue);
                    renderProjects(filtered);
                }
            });
        });
    }

    // Security: Escape HTML to prevent XSS
    function escapeHtml(text) {
        if (!text && text !== 0) return text;
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function createStarsHTML(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const icon = i <= rating ? 'fas fa-star' : 'far fa-star';
            stars.push(`<i class="${icon}" aria-hidden="true"></i>`);
        }
        return stars.join('');
    }

    function createTestimonialCardHTML(review) {
        return `
            <div class="review-header">
                <div class="review-stars" aria-label="Rated ${review.rating} out of 5 stars">
                    ${createStarsHTML(review.rating)}
                </div>
                <span class="review-score">${review.rating.toFixed(1)}</span>
            </div>
            <p class="review-quote">"${escapeHtml(review.quote)}"</p>
            <div class="review-meta">
                <div class="review-author-block">
                    <span class="review-avatar">${escapeHtml(getInitials(review.author))}</span>
                    <div class="review-author-text">
                        <h4 class="review-author-name">${escapeHtml(review.author)}</h4>
                        <p class="review-author-location">${escapeHtml(review.location)}</p>
                    </div>
                </div>
                <div class="review-badges">
                    ${review.verified ? '<span class="review-badge verified"><i class="fas fa-check-circle" aria-hidden="true"></i>Verified</span>' : ''}
                    <span class="review-badge service">${escapeHtml(review.service)}</span>
                    <span class="review-badge year">${escapeHtml(review.year)}</span>
                </div>
            </div>
        `;
    }

    function createReviewCard(review, index) {
        const card = document.createElement('article');
        card.className = 'testimonial-card review-card';
        card.dataset.service = slugify(review.service);
        card.dataset.rating = String(review.rating);
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', `${100 + (index % 6) * 80}`);
        card.innerHTML = createTestimonialCardHTML(review);
        return card;
    }

    function calculateReviewSummary(reviews) {
        if (!reviews.length) {
            return {
                total: 0,
                average: 0,
                verifiedCount: 0,
                recommendation: 0
            };
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const verifiedCount = reviews.filter(review => review.verified).length;
        const recommendation = Math.round((reviews.filter(review => review.rating >= 4).length / reviews.length) * 100);

        return {
            total: reviews.length,
            average: totalRating / reviews.length,
            verifiedCount,
            recommendation
        };
    }

    function renderReviewSummary(containerId, reviews) {
        if (!containerId) return;
        const container = document.getElementById(containerId);
        if (!container) return;

        const summary = calculateReviewSummary(reviews);
        container.innerHTML = `
            <div class="review-summary-grid" role="list" aria-label="Client review summary">
                <article class="review-summary-card" role="listitem">
                    <span class="review-summary-value">${summary.average.toFixed(1)} <small>/ 5</small></span>
                    <span class="review-summary-label">Average Client Rating</span>
                </article>
                <article class="review-summary-card" role="listitem">
                    <span class="review-summary-value">${summary.verifiedCount}</span>
                    <span class="review-summary-label">Verified Testimonials</span>
                </article>
                <article class="review-summary-card" role="listitem">
                    <span class="review-summary-value">${summary.recommendation}%</span>
                    <span class="review-summary-label">Would Recommend FAITH</span>
                </article>
            </div>
        `;
    }

    function renderReviewFilters(containerId, reviews, onFilterChange) {
        if (!containerId) return;
        const container = document.getElementById(containerId);
        if (!container) return;

        const services = [...new Set(reviews.map(review => review.service))];
        const options = [{ label: 'All Reviews', value: 'all' }].concat(
            services.map(service => ({ label: service, value: slugify(service) }))
        );

        container.innerHTML = '';
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `review-filter-btn ${index === 0 ? 'active' : ''}`;
            button.textContent = option.label;
            button.dataset.filter = option.value;
            button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
            button.addEventListener('click', () => {
                container.querySelectorAll('.review-filter-btn').forEach(filterButton => {
                    const isActive = filterButton.dataset.filter === option.value;
                    filterButton.classList.toggle('active', isActive);
                    filterButton.setAttribute('aria-pressed', isActive ? 'true' : 'false');
                });
                onFilterChange(option.value);
            });
            container.appendChild(button);
        });
    }

    function initializeTestimonialSlider(slider, track, dotsContainer, prevBtn, nextBtn) {
        const slides = Array.from(track.children);
        if (slides.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            dotsContainer.innerHTML = '';
            return;
        }

        const dots = Array.from(dotsContainer.children);
        let currentIndex = 0;
        let autoPlayTimer = null;

        const goToSlide = index => {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, dotIndex) => {
                const isActive = dotIndex === currentIndex;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        };

        const stopAutoPlay = () => {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        };

        const startAutoPlay = () => {
            if (prefersReducedMotion) return;
            stopAutoPlay();
            autoPlayTimer = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 6500);
        };

        dots.forEach((dot, index) => {
            dot.type = 'button';
            dot.setAttribute('aria-label', `Go to review ${index + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(index);
                startAutoPlay();
            });
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
                startAutoPlay();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
                startAutoPlay();
            });
        }

        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
        slider.addEventListener('focusin', stopAutoPlay);
        slider.addEventListener('focusout', startAutoPlay);
        slider.addEventListener('keydown', event => {
            if (event.key === 'ArrowRight') {
                goToSlide(currentIndex + 1);
                startAutoPlay();
            }
            if (event.key === 'ArrowLeft') {
                goToSlide(currentIndex - 1);
                startAutoPlay();
            }
        });

        goToSlide(0);
        startAutoPlay();
    }

    async function loadTestimonials() {
        const slider = document.getElementById('testimonial-slider');
        const track = document.getElementById('testimonial-track');
        const dotsContainer = document.getElementById('slider-dots');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        if (!slider || !track || !dotsContainer) return;

        try {
            const reviews = await getReviews();
            const featuredReviews = getSharedReviewSet(reviews, 6);
            renderReviewSummary('testimonial-summary', reviews);

            track.innerHTML = '';
            dotsContainer.innerHTML = '';

            const slideFragment = document.createDocumentFragment();
            const dotFragment = document.createDocumentFragment();

            featuredReviews.forEach((review, index) => {
                const slide = document.createElement('div');
                slide.className = 'review-slide w-full flex-shrink-0';

                const card = createReviewCard(review, index);
                slide.appendChild(card);
                slideFragment.appendChild(slide);

                const dot = document.createElement('button');
                dot.className = `review-dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
                dotFragment.appendChild(dot);
            });

            track.appendChild(slideFragment);
            dotsContainer.appendChild(dotFragment);
            refreshScrollAnimations();
            initializeTestimonialSlider(slider, track, dotsContainer, prevBtn, nextBtn);
        } catch (error) {
            console.error('Error loading testimonials:', error);
            track.innerHTML = `<div class="w-full text-center text-red-500 p-4">${error.message}</div>`;
        }
    }

    async function loadGridTestimonials({ gridId, summaryId, filterId, reviewSelector }) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        grid.innerHTML = '<p class="col-span-full text-center text-gray-500">Loading testimonials...</p>';

        try {
            const allReviews = await getReviews();
            const selectedReviews = typeof reviewSelector === 'function' ? reviewSelector(allReviews) : allReviews;
            let activeFilter = 'all';

            renderReviewSummary(summaryId, allReviews);
            renderReviewFilters(filterId, selectedReviews, filterValue => {
                activeFilter = filterValue;
                renderGrid();
            });

            function renderGrid() {
                grid.innerHTML = '';
                const filteredReviews = activeFilter === 'all'
                    ? selectedReviews
                    : selectedReviews.filter(review => slugify(review.service) === activeFilter);

                if (!filteredReviews.length) {
                    grid.innerHTML = '<p class="review-empty col-span-full text-center text-gray-500">No reviews match this service category yet.</p>';
                    return;
                }

                const fragment = document.createDocumentFragment();
                filteredReviews.forEach((review, index) => {
                    fragment.appendChild(createReviewCard(review, index));
                });
                grid.appendChild(fragment);
                refreshScrollAnimations();
            }

            renderGrid();
        } catch (error) {
            console.error(`Failed to load testimonials for ${gridId}:`, error);
            grid.innerHTML = `<p class="text-red-500 col-span-full text-center">${error.message}</p>`;
        }
    }
});
