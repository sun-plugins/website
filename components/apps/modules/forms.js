/**
 * Form Handler Module
 * Manages contact form submission and validation
 */

export class FormHandler {
    constructor() {
        this.form = document.querySelector('.imperial-form');
        this.submitBtn = this.form?.querySelector('.submit-btn');
        this.messageEl = document.getElementById('form-message');
        
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.initRealTimeValidation();
    }

    initRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Update field state
        field.classList.toggle('error', !isValid);
        
        // Show/hide error message
        this.updateFieldError(field, errorMessage);

        return isValid;
    }

    updateFieldError(field, message) {
        let errorEl = field.parentElement.querySelector('.field-error');
        
        if (message) {
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'field-error';
                errorEl.style.cssText = 'color: var(--error); font-size: 0.8rem; margin-top: 0.5rem; display: block; font-family: var(--font-tech);';
                field.parentElement.appendChild(errorEl);
            }
            errorEl.textContent = message;
        } else if (errorEl) {
            errorEl.remove();
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm()) {
            this.showMessage('Please fix the errors above', 'error');
            return;
        }

        // Disable submit button
        this.submitBtn.disabled = true;
        this.submitBtn.classList.add('loading');
        this.messageEl.className = 'form-message';
        this.messageEl.textContent = '';

        try {
            const formData = new FormData(this.form);
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.showMessage('✓ Message transmitted successfully! We\'ll respond soon.', 'success');
                this.form.reset();
                this.clearAllErrors();
                
                // Track success (analytics hook)
                this.trackFormSubmission('success');
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('✗ Transmission failed. Please try again or contact directly.', 'error');
            
            // Track error (analytics hook)
            this.trackFormSubmission('error');
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('loading');
        }
    }

    showMessage(text, type) {
        this.messageEl.className = `form-message ${type}`;
        this.messageEl.textContent = text;
        
        // Announce to screen readers
        this.messageEl.setAttribute('role', type === 'error' ? 'alert' : 'status');
        this.messageEl.setAttribute('aria-live', 'polite');
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.messageEl.className = 'form-message';
                this.messageEl.textContent = '';
            }, 5000);
        }
    }

    clearAllErrors() {
        const errorEls = this.form.querySelectorAll('.field-error');
        errorEls.forEach(el => el.remove());
        
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }

    trackFormSubmission(status) {
        // Hook for analytics tracking
        if (window.gtag) {
            window.gtag('event', 'form_submission', {
                'event_category': 'Contact',
                'event_label': status,
                'value': status === 'success' ? 1 : 0
            });
        }
        
        // Custom event for other tracking systems
        window.dispatchEvent(new CustomEvent('formSubmitted', {
            detail: { status }
        }));
    }

    // Public method to programmatically submit form
    submit() {
        this.form.dispatchEvent(new Event('submit'));
    }

    // Public method to reset form
    reset() {
        this.form.reset();
        this.clearAllErrors();
        this.messageEl.className = 'form-message';
        this.messageEl.textContent = '';
    }
}