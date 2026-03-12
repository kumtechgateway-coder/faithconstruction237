// /script.js

document.addEventListener('DOMContentLoaded', () => {
    // Projects functionality
    const projectsGrid = document.getElementById('projects-grid');
    const featuredGrid = document.getElementById('featured-projects-grid');
    const projectFilters = document.getElementById('project-filters');

    if (projectsGrid || featuredGrid) {
        loadProjects();
    }

    async function loadProjects() {
        try {
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
            const errorMsg = '<p class="text-center col-span-full text-gray-500">Failed to load projects. Please try again later.</p>';
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
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                </a>
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
                
                if (filterValue === 'all') {
                    renderProjects(allProjects);
                } else {
                    const filtered = allProjects.filter(p => p.category === filterValue);
                    renderProjects(filtered);
                }
            });
        });
    }
});