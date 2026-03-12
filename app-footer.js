class AppFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <footer class="bg-[#1A1A1A] border-t border-gray-800">
                <div class="container mx-auto px-6 lg:px-8">
                    <!-- Main Footer -->
                    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 py-20">
                        <!-- Company Info -->
                        <div>
                            <div class="mb-6 flex items-center gap-3">
                                <img src="images/logo.png" alt="Faith Construction Logo" class="h-12 w-auto rounded-[5px]">
                                <div class="flex flex-col leading-none">
                                    <span class="font-['Lora'] text-2xl font-black text-white tracking-widest">FAITH</span>
                                    <span class="text-[#D4B357] text-[0.65rem] font-bold tracking-[0.2em]">CONSTRUCTION</span>
                                </div>
                            </div>
                            <p class="text-gray-400 text-sm leading-relaxed mb-6">
                                Building Cameroon's premium residential future with integrity, excellence, and unwavering commitment to quality.
                            </p>
                            <div class="flex space-x-4">
                                <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-[#D4B357] hover:bg-[#D4B357] hover:text-[#1A1A1A] transition-all">
                                    <i class="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-[#D4B357] hover:bg-[#D4B357] hover:text-[#1A1A1A] transition-all">
                                    <i class="fab fa-linkedin-in"></i>
                                </a>
                                <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-[#D4B357] hover:bg-[#D4B357] hover:text-[#1A1A1A] transition-all">
                                    <i class="fab fa-instagram"></i>
                                </a>
                            </div>
                        </div>

                        <!-- Quick Links -->
                        <div>
                            <h4 class="text-white text-lg font-bold mb-6 gold-border-bottom inline-block">Quick Links</h4>
                            <ul class="space-y-4">
                                <li><a href="index.html" class="text-gray-400 hover:text-[#D4B357] transition-colors flex items-center group"><i class="fas fa-chevron-right text-xs mr-3 text-[#D4B357] group-hover:translate-x-2 transition-transform"></i>Home</a></li>
                                <li><a href="services.html" class="text-gray-400 hover:text-[#D4B357] transition-colors flex items-center group"><i class="fas fa-chevron-right text-xs mr-3 text-[#D4B357] group-hover:translate-x-2 transition-transform"></i>Services</a></li>
                                <li><a href="projects.html" class="text-gray-400 hover:text-[#D4B357] transition-colors flex items-center group"><i class="fas fa-chevron-right text-xs mr-3 text-[#D4B357] group-hover:translate-x-2 transition-transform"></i>Projects</a></li>
                                <li><a href="about.html" class="text-gray-400 hover:text-[#D4B357] transition-colors flex items-center group"><i class="fas fa-chevron-right text-xs mr-3 text-[#D4B357] group-hover:translate-x-2 transition-transform"></i>About Us</a></li>
                                <li><a href="contact.html" class="text-gray-400 hover:text-[#D4B357] transition-colors flex items-center group"><i class="fas fa-chevron-right text-xs mr-3 text-[#D4B357] group-hover:translate-x-2 transition-transform"></i>Contact</a></li>
                            </ul>
                        </div>

                        <!-- Services -->
                        <div>
                            <h4 class="text-white text-lg font-bold mb-6 gold-border-bottom inline-block">Our Services</h4>
                            <ul class="space-y-4">
                                <li><a href="services.html#design" class="text-gray-400 hover:text-[#D4B357] transition-colors">Architectural Design</a></li>
                                <li><a href="services.html#construction" class="text-gray-400 hover:text-[#D4B357] transition-colors">Residential Construction</a></li>
                                <li><a href="services.html#finishing" class="text-gray-400 hover:text-[#D4B357] transition-colors">Interior & Exterior Finishing</a></li>
                                <li><a href="services.html#renovation" class="text-gray-400 hover:text-[#D4B357] transition-colors">Renovation & Remodeling</a></li>
                                <li><a href="services.html#management" class="text-gray-400 hover:text-[#D4B357] transition-colors">Project Management</a></li>
                                <li><a href="services.html#realestate" class="text-gray-400 hover:text-[#D4B357] transition-colors">Real Estate Services</a></li>
                            </ul>
                        </div>

                        <!-- Contact Info -->
                        <div>
                            <h4 class="text-white text-lg font-bold mb-6 gold-border-bottom inline-block">Contact Us</h4>
                            <ul class="space-y-4">
                                <li class="flex items-start space-x-3"><i class="fas fa-map-marker-alt text-[#D4B357] mt-1"></i><span class="text-gray-400">Simbock, Yaoundé, Cameroon</span></li>
                                <li class="flex items-start space-x-3"><i class="fas fa-phone text-[#D4B357]"></i><span class="text-gray-400">+237 674 942 469</span></li>
                                <li class="flex items-start space-x-3"><i class="fas fa-envelope text-[#D4B357]"></i><span class="text-gray-400">faithconstruction8@gmail.com</span></li>
                                <li class="flex items-start space-x-3"><i class="fas fa-clock text-[#D4B357]"></i><span class="text-gray-400">Mon-Fri: 8:00 AM - 6:00 PM</span></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Bottom Bar -->
                    <div class="border-t border-gray-800 py-8">
                        <div class="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
                            <p class="text-gray-400 text-sm text-center sm:text-left">
                                &copy; ${new Date().getFullYear()} FAITH Construction. All rights reserved.
                            </p>
                            <div class="flex flex-wrap justify-center items-center space-x-6">
                                <a href="#" class="text-gray-400 hover:text-[#D4B357] text-sm transition-colors">Privacy Policy</a>
                                <a href="#" class="text-gray-400 hover:text-[#D4B357] text-sm transition-colors">Terms of Service</a>
                                <a href="#" class="text-gray-400 hover:text-[#D4B357] text-sm transition-colors">Cookie Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('app-footer', AppFooter);