// Toast Notification System
class Toast {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        if (!document.querySelector('.toast-container')) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.toast-container');
        }
    }

    show(message, type = 'info', duration = 3000) {
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;

        this.container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    success(message, duration) {
        this.show(message, 'success', duration);
    }

    error(message, duration) {
        this.show(message, 'error', duration);
    }

    info(message, duration) {
        this.show(message, 'info', duration);
    }
}

const toast = new Toast();

// Loading Spinner
function showLoading(message = 'Loading...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="spinner spinner-large"></div>
            <div class="loading-text">${message}</div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.remove();
}

// Button loading state
function setButtonLoading(button, loading = true) {
    if (loading) {
        button.dataset.originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<span class="spinner"></span> Loading...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}
