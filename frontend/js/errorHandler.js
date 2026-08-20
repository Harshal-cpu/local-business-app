// Global Error Handler
class ErrorBoundary {
    constructor() {
        this.init();
    }

    init() {
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason);
            event.preventDefault();
        });

        // Catch global errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error);
        });
    }

    handleError(error) {
        const errorMessage = error?.message || 'An unexpected error occurred';
        
        // Log to console
        console.error('Error caught by boundary:', error);

        // Show user-friendly message
        if (typeof toast !== 'undefined') {
            toast.error(errorMessage);
        } else {
            alert(`Error: ${errorMessage}`);
        }

        // In production, send to error tracking service
        // this.sendToErrorTracking(error);
    }

    sendToErrorTracking(error) {
        // Implement error tracking (e.g., Sentry, LogRocket)
        // fetch('/api/log-error', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         message: error.message,
        //         stack: error.stack,
        //         timestamp: new Date().toISOString()
        //     })
        // });
    }
}

// Initialize error boundary
const errorBoundary = new ErrorBoundary();

// Async error wrapper
async function safeAsync(fn, fallback) {
    try {
        return await fn();
    } catch (error) {
        console.error('Async error:', error);
        errorBoundary.handleError(error);
        return fallback;
    }
}
