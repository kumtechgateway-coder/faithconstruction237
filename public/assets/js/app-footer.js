class AppFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <footer class="bg-[#1A1A1A] pt-16 md:pt-24 pb-8">
            <div class="container mx-auto px-6 lg:px-8">
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <!-- About -->
                    <div class="col-span-2 lg:col-span-1">
                        <a href="index.html" class="flex items-center gap-3 mb-6">
                            <img src="/assets/images/logo.png" alt="Faith Construction Logo" class="h-12 w-auto rounded-[5px]" loading="lazy" decoding="async">
                            <div class="text-white flex flex-col leading-none">
                                <span class="font-['Lora'] text-2xl font-black tracking-widest">FAITH</span>
                                <span class="text-[#D4B357] text-[0.65rem] font-bold tracking-[0.2em]">CONSTRUCTION</span>
                            </div>
                        </a>
                        <p class="text-gray-400 text-sm leading-relaxed">
                            Building Cameroon's premium residential future with integrity, excellence, and an unwavering commitment to quality since 2010.
                        </p>
                    </div>

                    <!-- Quick Links -->
                    <div>
                        <h3 class="text-lg font-semibold text-white mb-6">Quick Links</h3>
                        <ul class="space-y-3">
                            <li><a href="about.html" class="text-gray-400 hover:text-[#D4B357] transition-colors">About Us</a></li>
                            <li><a href="services.html" class="text-gray-400 hover:text-[#D4B357] transition-colors">Services</a></li>
                            <li><a href="projects.html" class="text-gray-400 hover:text-[#D4B357] transition-colors">Projects</a></li>
                            <li><a href="contact.html" class="text-gray-400 hover:text-[#D4B357] transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <!-- Legal -->
                    <div>
                        <h3 class="text-lg font-semibold text-white mb-6">Legal</h3>
                        <ul class="space-y-3">
                            <li><a href="privacy-policy.html" class="text-gray-400 hover:text-[#D4B357] transition-colors">Privacy Policy</a></li>
                            <li><a href="cookie-policy.html" class="text-gray-400 hover:text-[#D4B357] transition-colors">Cookie Policy</a></li>
                            <li><a href="terms-of-service.html" class="text-gray-400 hover:text-[#D4B357] transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    <!-- Contact -->
                    <div>
                        <h3 class="text-lg font-semibold text-white mb-6">Contact Us</h3>
                        <ul class="space-y-4 text-sm">
                            <li class="flex items-start">
                                <i class="fas fa-map-marker-alt text-[#D4B357] mt-1 mr-3 w-4"></i>
                                <span class="text-gray-400">Simbock, Yaounde, Cameroon</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-phone-alt text-[#D4B357] mt-1 mr-3 w-4"></i>
                                <a href="tel:+237674942469" class="text-gray-400 hover:text-[#D4B357] transition-colors">+237 674 942 469</a>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-envelope text-[#D4B357] mt-1 mr-3 w-4"></i>
                                <a href="mailto:faithconstruction8@gmail.com" class="text-gray-400 hover:text-[#D4B357] transition-colors">faithconstruction8@gmail.com</a>
                            </li>
                        </ul>
                        <div class="flex space-x-4 mt-6">
                            <a href="https://wa.me/237674942469" target="_blank" rel="noopener noreferrer" aria-label="Chat with Faith Construction on WhatsApp" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#D4B357] hover:text-[#1A1A1A] transition-all"><i class="fab fa-whatsapp"></i></a>
                            <a href="mailto:faithconstruction8@gmail.com" aria-label="Email Faith Construction" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#D4B357] hover:text-[#1A1A1A] transition-all"><i class="fas fa-envelope"></i></a>
                            <a href="tel:+237674942469" aria-label="Call Faith Construction" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#D4B357] hover:text-[#1A1A1A] transition-all"><i class="fas fa-phone-alt"></i></a>
                        </div>
                    </div>
                </div>

                <!-- Copyright -->
                <div class="border-t border-gray-800 mt-12 pt-8">
                    <div class="flex flex-col sm:flex-row justify-between items-center text-sm">
                        <p class="text-gray-500 mb-4 sm:mb-0">&copy; ${new Date().getFullYear()} FAITH Construction. All Rights Reserved.</p>
                        <p class="text-gray-500">
                            Powered by <a href="https://kumtechgateway.com" target="_blank" rel="noopener noreferrer" class="text-[#D4B357] hover:text-white hover:underline transition-colors font-semibold cursor-pointer relative z-50 pointer-events-auto" style="cursor: pointer !important;">Kumtech Gateway</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }
}

customElements.define('app-footer', AppFooter);

