const API_BASE = 'http://localhost:5000/api';

// Login functionality
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect based on user role
            if (data.user.role === 'customer') {
                window.location.href = 'customer-dashboard.html';
            } else if (data.user.role === 'business_owner') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            showError(data.message || 'Login failed');
        }
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Cannot connect to server. Please check if the backend is running.');
        } else {
            showError('Login failed. Please try again.');
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
    }
}

// Signup functionality
async function handleSignup(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('userRole')?.value || 'business_owner';
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                fullName, 
                email, 
                password,
                role: role
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect based on role
            if (role === 'customer') {
                window.location.href = 'index.html';
            } else {
                window.location.href = 'join.html';
            }
        } else {
            showError(data.message || 'Registration failed');
        }
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Cannot connect to server. Please check if the backend is running.');
        } else {
            showError('Registration failed. Please try again.');
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
    }
}

// Business registration
async function handleBusinessRegistration(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'signup.html';
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';
    
    const formData = new FormData(event.target);
    const businessData = {
        name: formData.get('businessName'),
        email: formData.get('businessEmail'),
        phone: formData.get('businessPhone'),
        whatsapp: formData.get('whatsappNumber'),
        address: formData.get('businessAddress'),
        category: formData.get('businessType'),
        description: formData.get('businessDescription'),
        mapLink: formData.get('mapLink'),
        image: formData.get('businessImage')
    };
    
    // Add location coordinates if provided
    const lat = formData.get('latitude');
    const lng = formData.get('longitude');
    if (lat && lng) {
        businessData.location = {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
        };
    }
    
    try {
        const response = await fetch(`${API_BASE}/businesses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(businessData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess('Business registered successfully!');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            showError(data.message || 'Business registration failed');
        }
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Cannot connect to server. Please check if the backend is running.');
        } else {
            showError('Business registration failed. Please try again.');
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Complete Registration ✓';
    }
}

// Utility functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'background: #fee; color: #c33; padding: 10px; margin: 10px 0; border-radius: 5px; border: 1px solid #fcc;';
    
    const form = document.querySelector('form');
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.textContent = message;
    successDiv.style.cssText = 'background: #efe; color: #363; padding: 10px; margin: 10px 0; border-radius: 5px; border: 1px solid #cfc;';
    
    const form = document.querySelector('form');
    form.insertBefore(successDiv, form.firstChild);
}

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        return JSON.parse(user);
    }
    return null;
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
