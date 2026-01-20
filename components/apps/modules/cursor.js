/**
 * Custom Cursor Manager Module
 * Handles custom cursor animations and hover effects
 */

export class CursorManager {
    constructor(isTouchDevice = false) {
        this.isTouchDevice = isTouchDevice;
        
        if (!this.isTouchDevice) {
            this.cursorDot = document.getElementById('cursor-dot');
            this.cursorRing = document.getElementById('cursor-ring');
            this.mouseX = 0;
            this.mouseY = 0;
            this.ringX = 0;
            this.ringY = 0;
            
            this.init();
        }
    }

    init() {
        if (!this.cursorDot || !this.cursorRing) return;

        // Track mouse position
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Handle hover states
        document.addEventListener('mouseover', (e) => this.handleMouseOver(e));
        document.addEventListener('mouseout', (e) => this.handleMouseOut(e));
        
        // Start animation loop
        this.animateRing();
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => this.hideCursor());
        document.addEventListener('mouseenter', () => this.showCursor());
    }

    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // Update dot position immediately
        this.cursorDot.style.left = `${this.mouseX}px`;
        this.cursorDot.style.top = `${this.mouseY}px`;
    }

    handleMouseOver(e) {
        if (this.isHoverTarget(e.target)) {
            this.setHoverState(true);
        }
    }

    handleMouseOut(e) {
        if (this.isHoverTarget(e.target)) {
            this.setHoverState(false);
        }
    }

    isHoverTarget(element) {
        return element.matches('.hover-target, a, button, input, textarea') ||
               element.closest('.hover-target');
    }

    setHoverState(isHovering) {
        document.body.classList.toggle('hovering', isHovering);
    }

    animateRing() {
        // Smooth following animation for ring
        this.ringX += (this.mouseX - this.ringX) * 0.15;
        this.ringY += (this.mouseY - this.ringY) * 0.15;
        
        this.cursorRing.style.left = `${this.ringX}px`;
        this.cursorRing.style.top = `${this.ringY}px`;
        
        requestAnimationFrame(() => this.animateRing());
    }

    hideCursor() {
        if (this.cursorDot && this.cursorRing) {
            this.cursorDot.style.opacity = '0';
            this.cursorRing.style.opacity = '0';
        }
    }

    showCursor() {
        if (this.cursorDot && this.cursorRing) {
            this.cursorDot.style.opacity = '1';
            this.cursorRing.style.opacity = '1';
        }
    }

    destroy() {
        // Cleanup if needed
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseover', this.handleMouseOver);
        document.removeEventListener('mouseout', this.handleMouseOut);
    }
}