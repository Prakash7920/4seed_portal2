/**
 * Common JavaScript Utilities
 * Handles shared functionality across all pages
 */

// ========== Mobile Menu Toggle ==========
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });

        // Close menu on link click
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Intersection Observer for reveal animation
    observeElements();
});

// ========== Intersection Observer for Animations ==========
function observeElements() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// ========== Form Utilities ==========
const FormValidator = {
    /**
     * Validate email format
     */
    isValidEmail: function(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Validate mobile number (Indian format)
     */
    isValidMobile: function(mobile) {
        const regex = /^[6-9]\d{9}$/;
        return regex.test(mobile.replace(/\D/g, ''));
    },

    /**
     * Validate password strength
     */
    isStrongPassword: function(password) {
        // At least 8 characters, 1 uppercase, 1 number, 1 special character
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    },

    /**
     * Show error message
     */
    showError: function(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    },

    /**
     * Clear error message
     */
    clearError: function(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
};

// ========== API Utilities ==========
const APIClient = {
    baseURL: '/api', // Change to your API endpoint

    /**
     * Make GET request
     */
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthToken()
                }
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Make POST request
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthToken()
                },
                body: JSON.stringify(data)
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Make PUT request
     */
    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthToken()
                },
                body: JSON.stringify(data)
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Handle API response
     */
    async handleResponse(response) {
        if (!response.ok) {
            if (response.status === 401) {
                // Unauthorized - redirect to login
                window.location.href = '/login.html';
            }
            throw new Error(`API Error: ${response.statusText}`);
        }
        return await response.json();
    },

    /**
     * Get auth token from localStorage
     */
    getAuthToken() {
        return localStorage.getItem('authToken') || '';
    }
};

// ========== Notification System ==========
const Notification = {
    /**
     * Show notification message
     */
    show: function(message, type = 'info', duration = 3000) {
        const notificationDiv = document.getElementById('notification') || this.createNotificationContainer();
        notificationDiv.textContent = message;
        notificationDiv.className = `notification notification-${type}`;
        notificationDiv.style.display = 'block';

        if (duration > 0) {
            setTimeout(() => {
                notificationDiv.style.display = 'none';
            }, duration);
        }
    },

    /**
     * Show success notification
     */
    success: function(message, duration = 3000) {
        this.show(message, 'success', duration);
    },

    /**
     * Show error notification
     */
    error: function(message, duration = 3000) {
        this.show(message, 'error', duration);
    },

    /**
     * Show warning notification
     */
    warning: function(message, duration = 3000) {
        this.show(message, 'warning', duration);
    },

    /**
     * Create notification container if not exists
     */
    createNotificationContainer: function() {
        const div = document.createElement('div');
        div.id = 'notification';
        div.className = 'notification';
        document.body.appendChild(div);
        return div;
    }
};

// ========== Storage Utilities ==========
const Storage = {
    /**
     * Save data to localStorage
     */
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage Error:', error);
        }
    },

    /**
     * Get data from localStorage
     */
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage Error:', error);
            return null;
        }
    },

    /**
     * Remove data from localStorage
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage Error:', error);
        }
    },

    /**
     * Clear all data from localStorage
     */
    clear: function() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Storage Error:', error);
        }
    }
};

// ========== Utility Functions ==========

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

/**
 * Format date
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

/**
 * Generate random ID
 */
function generateId(prefix = '') {
    return prefix + Math.random().toString(36).substr(2, 9).toUpperCase();
}

/**
 * Sanitize HTML string (prevent XSS)
 */
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!Storage.get('authToken');
}

/**
 * Logout user
 */
function logout() {
    Storage.clear();
    window.location.href = '/login.html';
}

// Export for use in other files
window.FormValidator = FormValidator;
window.APIClient = APIClient;
window.Notification = Notification;
window.Storage = Storage;