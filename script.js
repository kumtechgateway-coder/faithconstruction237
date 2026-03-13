// /script.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // Initialize Lightbox
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'albumLabel': 'Project %1 of %2'
        });
    }

    // Projects functionality
    const projectsGrid = document.getElementById('projects-grid');
    const featuredGrid = document.getElementById('featured-projects-grid');
    const projectFilters = document.getElementById('project-filters');
 
    if (projectsGrid || featuredGrid) {
        loadProjects();
    }

    // --- Testimonials ---

    // Testimonials slider for homepage
    const testimonialSlider = document.getElementById('testimonial-slider');
    if (testimonialSlider) {
        loadTestimonials();
    }

    // Testimonials grid for about page
    const aboutTestimonialsGrid = document.getElementById('testimonials-grid');
    if (aboutTestimonialsGrid) {
        // Use last 3 reviews for about page
        loadGridTestimonials('testimonials-grid', reviews => reviews.slice(-3));
    }

    // Testimonials grid for projects page
    const projectTestimonialsGrid = document.getElementById('project-testimonials-grid');
    if (projectTestimonialsGrid) {
        // Use 3 random reviews for projects page
        loadGridTestimonials('project-testimonials-grid', reviews => {
            const shuffled = [...reviews].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, 3);
        });
    }

    async function loadProjects() {
        try {
            if (window.location.protocol === 'file:') {
                throw new Error('Projects cannot be loaded from local files. Please use a local server.');
            }
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Failed to fetch projects');
            const projects = await response.json();
            
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
            projects.forEach((project, index) => {
                projectsGrid.appendChild(createProjectCard(project, index));
            });
        }

        // Render featured grid if it exists (limit to 3)
        if (featuredGrid) {
            featuredGrid.innerHTML = '';
            const shuffled = [...projects];
            // Fisher-Yates shuffle to show random projects
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            shuffled.slice(0, 3).forEach((project, index) => {
                featuredGrid.appendChild(createProjectCard(project, index));
            });
        }
    }

    function createProjectCard(project, index) {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-item';
        projectCard.setAttribute('data-aos', 'fade-up');
        projectCard.setAttribute('data-aos-delay', `${100 + index * 100}`);
        
        const getCategoryLabel = (cat) => {
            const labels = {
                'luxury': 'Luxury Villa',
                'modern': 'Modern Home',
                'renovation': 'Renovation',
                'estate': 'Estate'
            };
            return labels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
        };

        projectCard.innerHTML = `
            <div class="project-img-wrapper">
                <a href="${project.image}" data-lightbox="featured-projects" data-title="${project.title}">
                    <img src="${project.image}" alt="${project.title}" loading="lazy" decoding="async" width="300" height="230">
                </a>
                ${project.status ? `<span class="status-badge">${project.status}</span>` : ''}
                <span class="category-badge">${getCategoryLabel(project.category)}</span>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="project-detail.html?title=${encodeURIComponent(project.title)}" class="view-details-btn">View Details</a>
            </div>
        `;
        return projectCard;
    }

    function setupFilters(allProjects) {
        const buttons = projectFilters.querySelectorAll('button');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                buttons.forEach(b => {
                    b.classList.remove('bg-[#1A1A1A]', 'text-white', 'shadow-lg');
                    b.classList.add('bg-white', 'text-gray-600', 'shadow-sm');
                });
                
                // Add active class to clicked
                btn.classList.remove('bg-white', 'text-gray-600', 'shadow-sm');
                btn.classList.add('bg-[#1A1A1A]', 'text-white', 'shadow-lg');
                
                const filterValue = btn.getAttribute('data-filter');
                const slugMap = {
                    'Luxury Villas': 'luxury',
                    'Modern Homes': 'modern',
                    'Renovations': 'renovation',
                    'Estates': 'estate'
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

    function initializeTestimonialSlider() {
        const track = document.getElementById('testimonial-track');
        const dotsContainer = document.getElementById('slider-dots');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');

        if (track && dotsContainer && prevBtn && nextBtn && track.children.length > 1) {
            const slides = Array.from(track.children);
            const slideCount = slides.length;
            const dots = Array.from(dotsContainer.children);
            let currentIndex = 0;

            const goToSlide = (index) => {
                if (index < 0 || index >= slideCount) return;
                currentIndex = index;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach((dot, i) => {
                    if (i === currentIndex) {
                        dot.classList.add('bg-[#D4B357]', 'w-6');
                        dot.classList.remove('bg-gray-300', 'w-3');
                    } else {
                        dot.classList.add('bg-gray-300', 'w-3');
                        dot.classList.remove('bg-[#D4B357]', 'w-6');
                    }
                });
            };

            dots.forEach((dot, index) => dot.addEventListener('click', () => goToSlide(index)));
            nextBtn.addEventListener('click', () => goToSlide((currentIndex + 1) % slideCount));
            prevBtn.addEventListener('click', () => goToSlide((currentIndex - 1 + slideCount) % slideCount));
        }
    }

    // Helper to create consistent testimonial card HTML
    function createTestimonialCardHTML(review) {
        return `
            <div class="testimonial-content">
                <p class="text-lg italic text-gray-700 leading-relaxed">"${review.quote}"</p>
            </div>
            <div class="testimonial-author flex items-center">
                <h4 class="font-bold text-[#1A1A1A]">${review.author}</h4>
                <p class="text-gray-500 ml-auto pl-4">${review.location}</p>
            </div>
        `;
    }

    async function loadTestimonials() {
        const track = document.getElementById('testimonial-track');
        const dotsContainer = document.getElementById('slider-dots');
        if (!track || !dotsContainer) return;

        try {
            if (window.location.protocol === 'file:') {
                throw new Error('Testimonials cannot be loaded from local files. Please use a local server.');
            }
            const response = await fetch('reviews.json');
            if (!response.ok) throw new Error('Failed to fetch reviews');
            const reviews = await response.json();

            track.innerHTML = '';
            dotsContainer.innerHTML = '';

            // Use first 3 reviews for the homepage slider
            reviews.slice(0, 3).forEach((review, index) => {
                const slide = document.createElement('div');
                // The slide IS the card now. No wrapper, no extra padding.
                slide.className = 'testimonial-card w-full flex-shrink-0';
                slide.innerHTML = createTestimonialCardHTML(review);
                track.appendChild(slide);

                const dot = document.createElement('button');
                dot.className = `rounded-full transition-all duration-300 ${index === 0 ? 'w-6 h-3 bg-[#D4B357]' : 'w-3 h-3 bg-gray-300 hover:bg-[#D4B357]'}`;
                dotsContainer.appendChild(dot);
            });

            initializeTestimonialSlider();
        } catch (error) {
            console.error('Error loading testimonials:', error);
            track.innerHTML = `<div class="w-full text-center text-red-500 p-4">${error.message}</div>`;
        }
    }

    // Generic function to load testimonials into a grid
    async function loadGridTestimonials(gridId, reviewSelector) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        grid.innerHTML = '<p class="col-span-full text-center text-gray-500">Loading testimonials...</p>';

        try {
            if (window.location.protocol === 'file:') {
                throw new Error('Testimonials cannot be loaded from local files. Please use a local server.');
            }
            const response = await fetch('reviews.json');
            if (!response.ok) throw new Error('Failed to fetch reviews');
            const reviews = await response.json();

            grid.innerHTML = ''; // Clear loading message

            const selectedReviews = reviewSelector(reviews);

            selectedReviews.forEach((review, index) => {
                const card = document.createElement('div');
                card.className = 'testimonial-card';
                card.setAttribute('data-aos', 'fade-up');
                card.setAttribute('data-aos-delay', (index + 1) * 100);
                card.innerHTML = createTestimonialCardHTML(review);
                grid.appendChild(card);
            });
        } catch (error) {
            console.error(`Failed to load testimonials for ${gridId}:`, error);
            grid.innerHTML = `<p class="text-red-500 col-span-full text-center">${error.message}</p>`;
        }
    }
});