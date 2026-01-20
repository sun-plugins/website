/**
 * Main Application Entry Point
 * me.sunmc | SunMC Development Portfolio
 */

import { CursorManager } from './modules/cursor.js';
import { NavigationManager } from './modules/navigation.js';
import { ConstellationRenderer } from './modules/constellation.js';
import { ProjectsManager } from './modules/projects.js';
import { FormHandler } from './modules/forms.js';
import { debounce, isTouchDevice } from './modules/utils.js';

// Project Data
export const PROJECT_DATA = [
    {
        id: "p1",
        name: "PlayerProfile",
        stack: "Java 21 • Database Support • PacketEvents • Luckperms",
        desc: "Advanced multi-profile management system for Minecraft Paper servers (1.21.4+). Supports multiple profiles per player with seamless switching.",
        link: "https://github.com/sun-mc-dev/PlayerProfile",
        jarlink: "https://www.spigotmc.org/resources/playerprofile.131872/",
        tags: ["java", "database", "packet"]
    },
    {
        id: "p2",
        name: "Smite",
        stack: "PacketEvents • Database Support • Math Optimizations • Java 21",
        desc: "A high-performance, packet-based ability system for Paper 1.21+ servers with a flexible Cell-based API, persistent SQLite storage, and optimized math calculations.",
        link: "https://github.com/sun-mc-dev/Smite",
        jarlink: "#",
        tags: ["java", "database", "packet"]
    },
    {
        id: "p3",
        name: "SunCrates (soon)",
        stack: "Paper API • Java 21 • PacketEvents • Async Operations • GUI Framework",
        desc: "A modern crate plugin for Paper servers (1.21.4+) featuring animated GUIs, async operations, and packet-level optimizations for lag-free gameplay.",
        link: "#",
        jarlink: "#",
        tags: ["java", "packet"]
    }
];

class PortfolioApp {
    constructor() {
        this.isTouchDevice = isTouchDevice();
        this.modules = {};
        this.elements = this.cacheElements();
        
        this.init();
    }

    cacheElements() {
        return {
            loader: document.querySelector('#boot-sequence'),
            scrollProgress: document.getElementById('scroll-progress'),
            backToTop: document.getElementById('back-to-top')
        };
    }

    async init() {
        // Detect touch device
        if (this.isTouchDevice) {
            document.body.classList.add('touch-device');
        }

        // Initialize modules
        this.modules.cursor = new CursorManager(this.isTouchDevice);
        this.modules.navigation = new NavigationManager();
        this.modules.projects = new ProjectsManager(PROJECT_DATA);
        this.modules.form = new FormHandler();
        
        // Initialize UI components
        this.initScrollProgress();
        this.initBackToTop();
        await this.simulateBoot();
        
        // Initialize constellation after boot
        this.modules.constellation = new ConstellationRenderer(this.isTouchDevice);
        
        // Initialize counters and skill bars
        this.initCounters();
        this.initSkillBars();
        this.observeSections();
        
        // Keyboard shortcuts
        this.initKeyboardShortcuts();
    }

    simulateBoot() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.elements.loader.classList.add('loading-complete');
                resolve();
            }, 1500);
        });
    }

    initScrollProgress() {
        const updateProgress = () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            this.elements.scrollProgress.style.width = `${scrolled}%`;
        };

        window.addEventListener('scroll', debounce(updateProgress, 10));
    }

    initBackToTop() {
        const checkScroll = () => {
            if (window.scrollY > 500) {
                this.elements.backToTop.classList.add('visible');
            } else {
                this.elements.backToTop.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', debounce(checkScroll, 100));

        this.elements.backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;

        const animateCounter = (counter) => {
            const target = +counter.getAttribute('data-count');
            const increment = target / speed;
            let count = 0;

            const updateCount = () => {
                count += increment;
                if (count < target) {
                    counter.textContent = Math.ceil(count);
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = target + (target === 99 ? 'K' : '');
                }
            };
            updateCount();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    initSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.3 });

        skillItems.forEach(item => observer.observe(item));
    }

    observeSections() {
        const sections = document.querySelectorAll('.view-port');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.2 });
        
        sections.forEach(section => observer.observe(section));
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape key closes mobile menu
            if (e.key === 'Escape') {
                this.modules.navigation.closeMobileMenu();
            }
            
            // Ctrl/Cmd + K for quick navigation (future enhancement)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                // Could open a command palette here
            }
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PortfolioApp();
    console.log('%c✓ Portfolio System Online', 'color: #C5A059; font-size: 16px; font-family: monospace;');
});