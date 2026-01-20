/**
 * Constellation Canvas Renderer Module
 * Renders animated particle constellation background
 */

import { prefersReducedMotion } from './utils.js';

export class ConstellationRenderer {
    constructor(isTouchDevice = false) {
        this.canvas = document.getElementById('constellation-canvas');
        if (!this.canvas || prefersReducedMotion()) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.lastTime = 0;
        this.fps = 30;
        this.interval = 1000 / this.fps;
        this.isTouchDevice = isTouchDevice;
        this.particleCount = isTouchDevice ? 40 : 70;
        
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate(0);
        
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
        
        // Pause animation when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = document.documentElement.scrollHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.width, this.height));
        }
    }

    animate(currentTime) {
        this.animationId = requestAnimationFrame((time) => this.animate(time));
        
        const deltaTime = currentTime - this.lastTime;
        if (deltaTime < this.interval) return;
        
        this.lastTime = currentTime - (deltaTime % this.interval);

        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.width, this.height);
            particle.draw(this.ctx);
        });
        
        // Draw connections
        this.drawConnections();
    }

    drawConnections() {
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.3;
                    this.ctx.strokeStyle = `rgba(197, 160, 89, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            });
        });
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.animationId) {
            this.animate(0);
        }
    }

    destroy() {
        this.pause();
        window.removeEventListener('resize', this.resize);
    }
}

class Particle {
    constructor(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
    }

    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        // Keep particles within bounds
        this.x = Math.max(0, Math.min(width, this.x));
        this.y = Math.max(0, Math.min(height, this.y));
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(197, 160, 89, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}