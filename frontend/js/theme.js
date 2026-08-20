// Theme Management
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
}

// Load saved theme on page load
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

// Initialize theme when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}
