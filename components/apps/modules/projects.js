/**
 * Projects Manager Module
 * Handles project rendering and filtering
 */

export class ProjectsManager {
    constructor(projectData) {
        this.projectData = projectData;
        this.grid = document.querySelector('#project-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';
        
        this.init();
    }

    init() {
        if (!this.grid) return;
        
        this.renderProjects();
        this.initFilters();
    }

    renderProjects(filter = 'all') {
        this.grid.innerHTML = '';
        
        const filteredProjects = filter === 'all' 
            ? this.projectData 
            : this.projectData.filter(project => project.tags.includes(filter));

        if (filteredProjects.length === 0) {
            this.showEmptyState();
            return;
        }

        filteredProjects.forEach((project, index) => {
            const card = this.createProjectCard(project, index);
            this.grid.appendChild(card);
        });
    }

    createProjectCard(project, index) {
        const article = document.createElement('article');
        article.className = 'holo-card hover-target';
        article.style.animationDelay = `${index * 150}ms`;

        article.innerHTML = `
            <span class="card-tech">${this.escapeHtml(project.stack)}</span>
            <h4 class="card-title">${this.escapeHtml(project.name)}</h4>
            <p class="card-desc">${this.escapeHtml(project.desc)}</p>
            <div>
                ${this.createLink(project.link, 'INSPECT SOURCE')}
                ${this.createLink(project.jarlink, 'Download JAR')}
            </div>
        `;

        return article;
    }

    createLink(url, text) {
        if (url === '#') {
            return `
                <a href="${url}" class="card-link hover-target">
                    ${text} <i class="fa-solid fa-arrow-right"></i>
                </a>
            `;
        }
        
        return `
            <a href="${url}" class="card-link hover-target" target="_blank" rel="noopener noreferrer">
                ${text} <i class="fa-solid fa-arrow-right"></i>
            </a>
        `;
    }

    initFilters() {
        if (!this.filterButtons) return;

        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Get filter value and render
                const filter = button.getAttribute('data-filter');
                this.currentFilter = filter;
                this.renderProjects(filter);

                // Announce to screen readers
                this.announceFilterChange(filter);
            });
        });
    }

    showEmptyState() {
        this.grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--gold-dim); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-mute); font-family: var(--font-tech);">
                    No projects found for this filter.
                </p>
            </div>
        `;
    }

    announceFilterChange(filter) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Filtered to show ${filter} projects`;
        
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public method to add projects dynamically
    addProject(project) {
        this.projectData.push(project);
        if (this.currentFilter === 'all' || project.tags.includes(this.currentFilter)) {
            this.renderProjects(this.currentFilter);
        }
    }

    // Public method to remove project
    removeProject(projectId) {
        this.projectData = this.projectData.filter(p => p.id !== projectId);
        this.renderProjects(this.currentFilter);
    }

    // Public method to update project
    updateProject(projectId, updates) {
        const index = this.projectData.findIndex(p => p.id === projectId);
        if (index !== -1) {
            this.projectData[index] = { ...this.projectData[index], ...updates };
            this.renderProjects(this.currentFilter);
        }
    }
}