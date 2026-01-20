/**
 * Navigation Manager Module
 * Handles mobile menu, active states, and smooth scrolling
 */

import { smoothScrollTo, debounce } from './utils.js';

export class NavigationManager {
    constructor() {
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileNav = document.querySelector('.mobile-nav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initActiveStates();
        this.initSmoothScroll();
    }

    initMobileMenu() {
        if (!this.mobileToggle || !this.mobileNav) return;

        // Toggle mobile menu
        this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());

        // Close menu when clicking links
        this.mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.mobileNav.classList.contains('active') &&
                !e.target.closest('.mobile-nav') &&
                !e.target.closest('.mobile-menu-toggle')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const isActive = this.mobileToggle.classList.toggle('active');
        this.mobileNav.classList.toggle('active');
        this.mobileToggle.setAttribute('aria-expanded', isActive);

        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.mobileToggle.classList.remove('active');
        this.mobileNav.classList.remove('active');
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    initActiveStates() {
        const updateActiveState = () => {
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', debounce(updateActiveState, 100));
        updateActiveState(); // Initial call
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Ignore if it's just '#'
                if (href === '#') return;
                
                e.preventDefault();
                smoothScrollTo(href);
            });
        });
    }

    setActiveLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
}