// /script.js

document.addEventListener('DOMContentLoaded', () => {
    // Projects functionality
    const projectsGrid = document.getElementById('projects-grid');
    const projectFilters = document.getElementById('project-filters');

    if (projectsGrid) {
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
            projectsGrid.innerHTML = '<p class="text-center col-span-full text-gray-500">Failed to load projects. Please try again later.</p>';
        }
    }

    function renderProjects(projects) {
        projectsGrid.innerHTML = '';
        
        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'group relative overflow-hidden rounded-sm shadow-xl cursor-pointer h-[400px] animate-fade-in-up';
            projectCard.style.animationDelay = `${index * 100}ms`;
            
            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span class="text-brand-gold text-xs font-bold uppercase tracking-widest mb-2 block">${project.category}</span>
                    <h3 class="text-2xl font-serif font-bold text-white mb-2">${project.title}</h3>
                    <p class="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">${project.description}</p>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
    }

    function setupFilters(allProjects) {
        const buttons = projectFilters.querySelectorAll('button');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                buttons.forEach(b => {
                    b.classList.remove('bg-brand-black', 'text-white', 'shadow-lg');
                    b.classList.add('bg-white', 'text-gray-600', 'shadow-sm');
                });
                
                // Add active class to clicked
                btn.classList.remove('bg-white', 'text-gray-600', 'shadow-sm');
                btn.classList.add('bg-brand-black', 'text-white', 'shadow-lg');
                
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