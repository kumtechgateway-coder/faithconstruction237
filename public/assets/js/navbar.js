class AppNavbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.initStyles();
        this.initScripts();
    }

    initStyles() {
        // Styles are now handled in style.css to prevent duplication
        // and ensure consistency across the application.
    }

    render() {
        const isTransparent = this.getAttribute('transparent') === 'true';
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        // Define menu items
        const menuItems = [
            { name: 'HOME', href: 'index.html' },
            { name: 'SERVICES', href: 'services.html' },
            { name: 'PROJECTS', href: 'projects.html' },
            { name: 'ABOUT', href: 'about.html' },
            { name: 'CONTACT', href: 'contact.html' }
        ];

        // Generate Desktop Links
        const desktopLinks = menuItems.map(item => {
            const isActive = currentPath === item.href;
            const activeClass = isActive ? 'text-[#D4B357]' : 'text-white hover:text-[#D4B357]';
            const borderClass = isActive ? 'w-full' : 'w-0 group-hover:w-full';
            
            return `
                <a href="${item.href}" class="${activeClass} text-sm tracking-wider transition-colors duration-300 relative group">
                    ${item.name}
                    <span class="absolute bottom-0 left-0 ${borderClass} h-0.5 bg-[#D4B357] transition-all duration-300"></span>
                </a>
            `;
        }).join('');

        // Generate Mobile Links
        const mobileLinks = menuItems.map(item => {
            const isActive = currentPath === item.href;
            const activeClass = isActive ? 'text-[#D4B357]' : 'text-white hover:text-[#D4B357]';
            
            return `
                <a href="${item.href}" class="${activeClass} text-2xl font-light transition-colors gold-border-bottom inline-block py-4">${item.name}</a>
            `;
        }).join('');

        this.innerHTML = `
            <nav class="fixed w-full z-50 transition-all duration-500 ${isTransparent ? 'bg-transparent' : 'bg-[#1A1A1A] shadow-2xl'}" id="navbar">
                <div class="container mx-auto px-6 lg:px-8">
                    <div class="flex justify-between items-center py-6">
                        <!-- Logo -->
                        <a href="index.html" class="flex items-center gap-3">
                            <img src="/assets/images/logo.png" alt="Faith Construction Logo" class="h-12 w-auto rounded-[5px]" fetchpriority="high" decoding="async" width="72" height="50">
                            <div class="text-white flex flex-col leading-none">
                                <span class="font-['Lora'] text-2xl font-black tracking-widest">FAITH</span>
                                <span class="text-[#D4B357] text-[0.65rem] font-bold tracking-[0.2em]">CONSTRUCTION</span>
                            </div>
                        </a>

                        <!-- Desktop Menu -->
                        <div class="hidden lg:flex items-center space-x-8 xl:space-x-12">
                            ${desktopLinks}
                        </div>

                        <!-- Contact Info Desktop -->
                        <div class="hidden lg:flex items-center space-x-4">
                            <button type="button" aria-label="Toggle theme" class="theme-toggle-btn text-gray-400 hover:text-white p-2 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4B357] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]">
                                <i class="fas fa-moon text-xl"></i>
                                <i class="fas fa-sun text-xl hidden"></i>
                            </button>
                            <div class="text-right hidden xl:block">
                                <div class="text-[#D4B357] text-sm font-light">24/7 SUPPORT</div>
                                <div class="text-white text-lg font-semibold">+237 674 942 469</div>
                            </div>
                            <a href="contact.html" class="btn-ripple-nav bg-[#D4B357] hover:bg-[#B8963F] text-[#1A1A1A] px-6 py-3 rounded-md text-sm font-semibold transition-all duration-300 transform hover:scale-110 hover:-translate-y-3 hover:shadow-2xl">
                                GET QUOTE
                            </a>
                        </div>

                        <!-- Mobile Menu Button -->
                        <button class="lg:hidden text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4B357] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] rounded-md" id="menuToggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobileMenu">
                            <i class="fas fa-bars text-2xl"></i>
                        </button>
                    </div>
                </div>
            </nav>

            <!-- Mobile Menu -->
            <div class="menu-overlay" id="menuOverlay"></div>
            <div class="mobile-menu bg-[#1A1A1A]" id="mobileMenu">
                <div class="flex justify-end mb-8">
                    <button class="text-white p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4B357] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] rounded-md" id="closeMenu" aria-label="Close navigation menu">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div class="flex flex-col space-y-8">
                    ${mobileLinks}
                </div>
                <div class="absolute bottom-10 left-10 right-10">
                    <div class="border-t border-gray-700 pt-8">
                        <div class="text-[#D4B357] mb-2 text-sm">CALL US</div>
                        <div class="text-white text-xl font-semibold mb-6">+237 674 942 469</div>
                        <div class="flex items-center justify-center gap-4">
                            <a href="contact.html" class="btn-ripple-nav block text-center bg-[#D4B357] hover:bg-[#B8963F] text-[#1A1A1A] px-6 py-4 rounded-md text-sm font-semibold transition-all transform hover:scale-110 hover:-translate-y-3 hover:shadow-2xl flex-grow">
                                GET A QUOTE
                            </a>
                            <button type="button" aria-label="Toggle theme" class="theme-toggle-btn text-gray-400 hover:text-white p-4 rounded-lg text-sm bg-gray-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4B357] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]">
                                <i class="fas fa-moon text-xl"></i>
                                <i class="fas fa-sun text-xl hidden"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- WhatsApp Widget -->
            <div class="fixed bottom-[6.5rem] right-6 z-50 flex flex-col items-end">
                <!-- Message Bubble -->
                <div id="whatsapp-bubble" class="bg-white text-gray-800 p-4 rounded-2xl shadow-2xl mb-4 mr-0 relative transform transition-all duration-500 opacity-0 translate-y-10 scale-90 origin-bottom-right max-w-xs border border-gray-100">
                    <div class="flex items-center gap-3">
                        <div class="bg-green-500/10 p-2 rounded-full shrink-0">
                            <i class="fas fa-comment-dots text-green-600 text-lg"></i>
                        </div>
                        <div>
                            <p class="font-bold text-sm text-[#1A1A1A]">You have a message!</p>
                            <p class="text-xs text-gray-500 mt-0.5">Contact us on WhatsApp for instant support.</p>
                        </div>
                    </div>
                    <!-- Arrow -->
                    <div class="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100"></div>
                    
                    <!-- Close Button -->
                    <button id="close-whatsapp" aria-label="Dismiss WhatsApp message bubble" class="absolute -top-2 -right-2 bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm transition-colors">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Button -->
                <a href="https://wa.me/237674942469" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" class="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] w-14 h-14 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-12 relative group">
                    <i class="fab fa-whatsapp text-3xl"></i>
                    <span class="absolute top-0 right-0 flex h-3 w-3">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </a>
            </div>
        `;
    }

    initScripts() {
        const navbar = this.querySelector('#navbar');
        const menuToggle = this.querySelector('#menuToggle');
        const closeMenu = this.querySelector('#closeMenu');
        const mobileMenu = this.querySelector('#mobileMenu');
        const menuOverlay = this.querySelector('#menuOverlay');
        const isTransparent = this.getAttribute('transparent') === 'true';

        // WhatsApp Bubble Logic
        const whatsappBubble = this.querySelector('#whatsapp-bubble');
        const closeWhatsapp = this.querySelector('#close-whatsapp');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        let shouldShowWhatsAppBubble = currentPath === 'index.html' && !sessionStorage.getItem('whatsappBubbleShown');

        if (closeWhatsapp) {
            closeWhatsapp.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                whatsappBubble.classList.add('opacity-0', 'translate-y-10', 'scale-90');
                shouldShowWhatsAppBubble = false;
            });
        }

        // Scroll Effect (rAF-throttled and passive for smoother scrolling)
        let latestScrollY = window.scrollY;
        let isScrollTicking = false;

        const applyScrollState = () => {
            if (latestScrollY > 50) {
                navbar.classList.add('bg-[#1A1A1A]', 'shadow-2xl');
                if (isTransparent) navbar.classList.remove('bg-transparent');
            } else {
                navbar.classList.remove('shadow-2xl');
                if (isTransparent) {
                    navbar.classList.remove('bg-[#1A1A1A]');
                    navbar.classList.add('bg-transparent');
                } else {
                    navbar.classList.add('bg-[#1A1A1A]');
                }
            }

            if (shouldShowWhatsAppBubble && latestScrollY > 200 && whatsappBubble) {
                whatsappBubble.classList.remove('opacity-0', 'translate-y-10', 'scale-90');
                sessionStorage.setItem('whatsappBubbleShown', 'true');
                shouldShowWhatsAppBubble = false;
            }
        };

        const onWindowScroll = () => {
            latestScrollY = window.scrollY;
            if (isScrollTicking) return;

            isScrollTicking = true;
            window.requestAnimationFrame(() => {
                applyScrollState();
                isScrollTicking = false;
            });
        };

        applyScrollState();
        window.addEventListener('scroll', onWindowScroll, { passive: true });

        // Mobile Menu Logic
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-controls', 'mobileMenu');
        }
        if (mobileMenu) mobileMenu.setAttribute('aria-hidden', 'true');

        const openMobileMenu = () => {
            mobileMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
            if (mobileMenu) mobileMenu.setAttribute('aria-hidden', 'false');
        };

        const closeMobileMenu = () => {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
            if (mobileMenu) mobileMenu.setAttribute('aria-hidden', 'true');
        };

        if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
        if (closeMenu) closeMenu.addEventListener('click', closeMobileMenu);
        if (menuOverlay) menuOverlay.addEventListener('click', closeMobileMenu);

        // Ripple Effect for Navbar Buttons
        const rippleButtons = this.querySelectorAll('.btn-ripple-nav');
        rippleButtons.forEach(button => {
            button.classList.add('ripple-container');
            button.addEventListener('click', function (e) {
                const rect = button.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
                ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
                
                ripple.classList.add('ripple');
                
                const existingRipple = button.querySelector('.ripple');
                if(existingRipple) {
                    existingRipple.remove();
                }
                
                button.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Theme Toggle Logic
        const themeToggleBtns = this.querySelectorAll('.theme-toggle-btn');

        const updateThemeIcons = (isDarkMode) => {
            themeToggleBtns.forEach(btn => {
                const darkIcon = btn.querySelector('.fa-moon');
                const lightIcon = btn.querySelector('.fa-sun');
                if (isDarkMode) {
                    darkIcon.classList.add('hidden');
                    lightIcon.classList.remove('hidden');
                } else {
                    darkIcon.classList.remove('hidden');
                    lightIcon.classList.add('hidden');
                }
            });
        };

        // Set initial icon state based on the class on <html>
        updateThemeIcons(document.documentElement.classList.contains('dark'));

        themeToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const isDarkMode = document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
                updateThemeIcons(isDarkMode);
            });
        });
    }
}

customElements.define('app-navbar', AppNavbar);
