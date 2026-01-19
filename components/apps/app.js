const PROJECT_DATA = [
    {
        id: "p1",
        name: "PlayerProfile",
        stack: "Java 21 • Database Support • PacketEvents • Luckperms ",
        desc: "Advanced multi-profile management system for Minecraft Paper servers (1.21.4+). Supports multiple profiles per player with seamless switching.",
        link: "https://github.com/sun-mc-dev/PlayerProfile",
        jarlink: "https://www.spigotmc.org/resources/playerprofile.131872/"
    },
    {
        id: "p2",
        name: "Smite",
        stack: "PacketEvents • Database Support • Math Optimizations • Java 21",
        desc: "A high-performance, packet-based ability system for Paper 1.21.11 servers with a flexible Cell-based API, persistent SQLite storage, and optimized math calculations.",
        link: "https://github.com/sun-mc-dev/Smite",
        jarlink: "#"
    },
    {
        id: "p3",
        name: "SunCrates (soon)",
        stack: "Paper API • Java 21 • PacketEvents • Async Operations, GUI Framework",
        desc: "A modern crate plugin for Paper servers (1.21.4+) featuring animated GUIs, async operations, and packet-level optimizations for lag-free gameplay.",
        link: "#",
        jarlink: "#"
    }
];

class PortfolioApp {
    constructor() {
        this.loader = document.querySelector('#boot-sequence');
        this.grid = document.querySelector('#project-grid');
        this.typingCodeElement = document.getElementById('typewriter-code');
        this.cursorDot = document.getElementById('cursor-dot');
        this.cursorRing = document.getElementById('cursor-ring');

        this.mouseX = 0;
        this.mouseY = 0;
        this.ringX = 0;
        this.ringY = 0;

        this.init();
    }

    async init() {
        this.initCursor();
        await this.simulateBoot();
        this.renderProjects();
        this.initConstellation();
        this.initTypewriter();
        this.observeSections();
    }

    initCursor() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.cursorDot.style.left = `${this.mouseX}px`;
            this.cursorDot.style.top = `${this.mouseY}px`;
        });

        const handleHover = (isHovering) => {
            if (isHovering) document.body.classList.add('hovering');
            else document.body.classList.remove('hovering');
        };

        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('.hover-target, a, button, input, textarea') ||
                e.target.closest('.hover-target')) {
                handleHover(true);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.matches('.hover-target, a, button, input, textarea') ||
                e.target.closest('.hover-target')) {
                handleHover(false);
            }
        });

        const animateRing = () => {
            this.ringX += (this.mouseX - this.ringX) * 0.15;
            this.ringY += (this.mouseY - this.ringY) * 0.15;
            this.cursorRing.style.left = `${this.ringX}px`;
            this.cursorRing.style.top = `${this.ringY}px`;
            requestAnimationFrame(animateRing);
        };
        animateRing();
    }

    simulateBoot() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.loader.classList.add('loading-complete');
                resolve();
            }, 1500);
        });
    }

    renderProjects() {
        this.grid.innerHTML = '';
        PROJECT_DATA.forEach((proj, i) => {
            const html = `
                <article class="holo-card hover-target" style="animation-delay: ${i * 150}ms">
                    <span class="card-tech">${proj.stack}</span>
                    <h4 class="card-title">${proj.name}</h4>
                    <p class="card-desc">${proj.desc}</p>
                    <a href="${proj.link}" class="card-link hover-target">INSPECT SOURCE <i class="fa-solid fa-arrow-right"></i></a>
                    <a href="${proj.jarlink}" class="card-link hover-target">Download JAR <i class="fa-solid fa-arrow-right"></i></a>
                </article>
            `;
            this.grid.insertAdjacentHTML('beforeend', html);
        });
    }

    initConstellation() {
        const canvas = document.getElementById('constellation-canvas');
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = document.documentElement.scrollHeight;
            canvas.width = width;
            canvas.height = height;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.fillStyle = 'rgba(197, 160, 89, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < 70; i++) particles.push(new Particle());
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
                particles.forEach(p2 => {
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.strokeStyle = `rgba(197, 160, 89, ${1 - dist / 150})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        initParticles();
        animate();
    }

    initTypewriter() {
        const codeString = `
<span class="kw">package</span> me.sunmc.core;

<span class="kw">public record</span> <span class="cl">Config</span>(String mode) {
    <span class="kw">public void</span> <span class="fn">init</span>() {
        <span class="kw">var</span> logger = <span class="cl">Logger</span>.getLogger(<span class="cl">Config.class</span>);
        <span class="kw">switch</span> (mode) {
            <span class="kw">case</span> <span class="str">"INDUSTRIAL"</span> -> logger.info(<span class="str">"Optimization: MAX"</span>);
            <span class="kw">case</span> <span class="str">"CUTE"</span>     -> logger.info(<span class="str">"Pink Mode: ON"</span>);
        }
    }
}`;
        this.typingCodeElement.innerHTML = codeString;
        this.typingCodeElement.style.opacity = 0;
        const obs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.typingCodeElement.style.transition = 'opacity 2s ease';
                this.typingCodeElement.style.opacity = 1;
            }
        });
        obs.observe(this.typingCodeElement);
    }

    observeSections() {
        const sections = document.querySelectorAll('.view-port');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('in-view');
            });
        }, { threshold: 0.2 });
        sections.forEach(s => observer.observe(s));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new PortfolioApp();
});