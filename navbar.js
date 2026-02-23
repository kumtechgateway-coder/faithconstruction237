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
        const style = document.createElement('style');
        style.textContent = `
            /* Mobile Menu Styles */
            .mobile-menu {
                position: fixed;
                top: 0;
                right: -100%;
                width: 80%;
                max-width: 400px;
                height: 100vh;
                background: #1A1A1A;
                z-index: 1000;
                transition: right 0.5s cubic-bezier(0.77, 0, 0.175, 1);
                padding: 40px;
                box-shadow: -10px 0 30px rgba(0,0,0,0.3);
            }

            .mobile-menu.active {
                right: 0;
            }

            .menu-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: rgba(0,0,0,0.8);
                backdrop-filter: blur(5px);
                z-index: 999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.5s;
            }

            .menu-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .gold-border-bottom {
                position: relative;
            }

            .gold-border-bottom::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 60px;
                height: 2px;
                background: #D4B357;
                transition: width 0.3s ease;
            }

            .gold-border-bottom:hover::after {
                width: 100px;
            }

            /* Ripple Effect */
            .ripple-container {
                position: relative;
                overflow: hidden;
            }
            .ripple {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(212, 179, 87, 0.5);
                transform: scale(0);
                animation: ripple-animation 600ms ease-out;
                pointer-events: none;
            }
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
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
                <a href="${item.href}" class="${activeClass} text-xl font-light transition-colors gold-border-bottom inline-block">${item.name}</a>
            `;
        }).join('');

        this.innerHTML = `
            <nav class="fixed w-full z-50 transition-all duration-500 ${isTransparent ? 'bg-transparent' : 'bg-[#1A1A1A] shadow-2xl'}" id="navbar">
                <div class="container mx-auto px-6 lg:px-8">
                    <div class="flex justify-between items-center py-6">
                        <!-- Logo -->
                        <a href="index.html" class="flex items-center gap-4">
                            <img src="images/logo.png" alt="Faith Construction Logo" class="h-12 w-auto rounded-[5px]">
                            <div class="text-white">
                                <span class="font-['Lora'] text-2xl font-black tracking-tight block leading-none">FAITH</span>
                                <span class="text-[#D4B357] text-xs tracking-[0.3em] block mt-1 font-light">CONSTRUCTION</span>
                            </div>
                        </a>

                        <!-- Desktop Menu -->
                        <div class="hidden lg:flex items-center space-x-8 xl:space-x-12">
                            ${desktopLinks}
                        </div>

                        <!-- Contact Info Desktop -->
                        <div class="hidden lg:flex items-center space-x-4">
                            <div class="text-right hidden xl:block">
                                <div class="text-[#D4B357] text-sm font-light">24/7 SUPPORT</div>
                                <div class="text-white text-lg font-semibold">+237 123 456 789</div>
                            </div>
                            <a href="contact.html" class="btn-ripple-nav bg-[#D4B357] hover:bg-[#B8963F] text-[#1A1A1A] px-6 py-3 rounded-md text-sm font-semibold transition-all duration-300 transform hover:scale-110 hover:-translate-y-3 hover:shadow-2xl">
                                GET QUOTE
                            </a>
                        </div>

                        <!-- Mobile Menu Button -->
                        <button class="lg:hidden text-white focus:outline-none" id="menuToggle">
                            <i class="fas fa-bars text-2xl"></i>
                        </button>
                    </div>
                </div>
            </nav>

            <!-- Mobile Menu -->
            <div class="menu-overlay" id="menuOverlay"></div>
            <div class="mobile-menu" id="mobileMenu">
                <div class="flex justify-end mb-12">
                    <button class="text-white focus:outline-none" id="closeMenu">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div class="flex flex-col space-y-8">
                    ${mobileLinks}
                </div>
                <div class="absolute bottom-10 left-10 right-10">
                    <div class="border-t border-gray-800 pt-8">
                        <div class="text-[#D4B357] mb-2 text-sm">CALL US</div>
                        <div class="text-white text-xl font-semibold mb-6">+237 123 456 789</div>
                        <a href="contact.html" class="btn-ripple-nav block text-center bg-[#D4B357] hover:bg-[#B8963F] text-[#1A1A1A] px-6 py-4 rounded-md text-sm font-semibold transition-all transform hover:scale-110 hover:-translate-y-3 hover:shadow-2xl">
                            GET A QUOTE
                        </a>
                    </div>
                </div>
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

        // Scroll Effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
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
        });

        // Mobile Menu Logic
        const openMobileMenu = () => {
            mobileMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeMobileMenu = () => {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
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
    }
}

customElements.define('app-navbar', AppNavbar);