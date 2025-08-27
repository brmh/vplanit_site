// App State Management
let currentScreen = 'home-screen';
let screenHistory = [];

// DOM Elements
const screens = document.querySelectorAll('.screen');
const headerTitle = document.getElementById('header-title');
const navItems = document.querySelectorAll('.nav-item');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupBudgetSlider();
});

// Initialize app
function initializeApp() {
    showScreen('home-screen');
    updateNavigation();
}

// Setup event listeners
function setupEventListeners() {
    // Budget slider
    const budgetSlider = document.getElementById('budget-slider');
    if (budgetSlider) {
        budgetSlider.addEventListener('input', updateBudgetDisplay);
    }

    // Search functionality
    const searchInputs = document.querySelectorAll('.search-bar input');
    searchInputs.forEach(input => {
        input.addEventListener('input', handleSearch);
    });

    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    // Vendor category clicks
    const vendorCategories = document.querySelectorAll('.vendor-category');
    vendorCategories.forEach(category => {
        category.addEventListener('click', handleVendorCategoryClick);
    });

    // Event item interactions
    const eventItems = document.querySelectorAll('.event-item');
    eventItems.forEach(item => {
        const editBtn = item.querySelector('.edit-btn');
        const addBtn = item.querySelector('.add-btn');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => handleEventEdit(item));
        }
        
        if (addBtn) {
            addBtn.addEventListener('click', () => handleEventAdd(item));
        }
    });

    // Guest item interactions
    const guestItems = document.querySelectorAll('.guest-item');
    guestItems.forEach(item => {
        const menuBtn = item.querySelector('.menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => handleGuestMenu(item));
        }
    });

    // Vendor payment interactions
    const vendorPayments = document.querySelectorAll('.vendor-payment');
    vendorPayments.forEach(payment => {
        payment.addEventListener('click', () => handleVendorPaymentClick(payment));
    });
}

// Screen Navigation
function showScreen(screenId) {
    // Hide all screens
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        
        // Update header title
        updateHeaderTitle(screenId);
        
        // Update navigation
        updateNavigation();
        
        // Add to history
        addToHistory(screenId);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

// Update header title based on screen
function updateHeaderTitle(screenId) {
    const titles = {
        'home-screen': 'Home',
        'events-screen': 'Add Events',
        'budget-screen': 'Budget & Guests',
        'wedding-events-screen': 'Wedding Events',
        'event-detail-screen': 'Event Details',
        'vendors-screen': 'Add Vendors',
        'guests-screen': 'Guests',
        'budget-detail-screen': 'Budget'
    };
    
    headerTitle.textContent = titles[screenId] || 'VPlanit';
}

// Update navigation state
function updateNavigation() {
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // Find and activate the correct nav item
    const activeNavItem = document.querySelector(`[onclick*="${currentScreen}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

// Navigation history
function addToHistory(screenId) {
    if (screenHistory[screenHistory.length - 1] !== screenId) {
        screenHistory.push(screenId);
    }
}

function goBack() {
    if (screenHistory.length > 1) {
        screenHistory.pop(); // Remove current screen
        const previousScreen = screenHistory[screenHistory.length - 1];
        showScreen(previousScreen);
    } else {
        showScreen('home-screen');
    }
}

// Toggle menu
function toggleMenu() {
    // Implement menu functionality
    console.log('Menu toggled');
}

// Budget slider functionality
function setupBudgetSlider() {
    const budgetSlider = document.getElementById('budget-slider');
    if (budgetSlider) {
        budgetSlider.addEventListener('input', updateBudgetDisplay);
    }
}

function updateBudgetDisplay() {
    const budgetSlider = document.getElementById('budget-slider');
    const budgetAmount = document.querySelector('.budget-amount');
    
    if (budgetSlider && budgetAmount) {
        const value = parseInt(budgetSlider.value);
        const formattedValue = formatCurrency(value);
        budgetAmount.textContent = formattedValue;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const searchContainer = event.target.closest('.screen');
    
    if (!searchContainer) return;
    
    // Implement search logic based on screen type
    if (searchContainer.id === 'guests-screen') {
        searchGuests(searchTerm);
    } else if (searchContainer.id === 'budget-detail-screen') {
        searchVendors(searchTerm);
    }
}

function searchGuests(searchTerm) {
    const guestItems = document.querySelectorAll('.guest-item');
    
    guestItems.forEach(item => {
        const guestName = item.querySelector('.guest-name').textContent.toLowerCase();
        const guestRelation = item.querySelector('.guest-relation').textContent.toLowerCase();
        
        if (guestName.includes(searchTerm) || guestRelation.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function searchVendors(searchTerm) {
    const vendorPayments = document.querySelectorAll('.vendor-payment');
    
    vendorPayments.forEach(item => {
        const vendorName = item.querySelector('.vendor-name').textContent.toLowerCase();
        const vendorCategory = item.querySelector('.vendor-category').textContent.toLowerCase();
        
        if (vendorName.includes(searchTerm) || vendorCategory.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Form handling
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Implement form submission logic
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    console.log('Form submitted:', data);
    
    // Show success message or navigate to next screen
    showSuccessMessage('Form submitted successfully!');
}

// Event interactions
function handleEventEdit(eventItem) {
    const eventName = eventItem.querySelector('.event-name').textContent;
    console.log('Editing event:', eventName);
    
    // Navigate to event detail screen
    showScreen('event-detail-screen');
}

function handleEventAdd(eventItem) {
    const eventName = eventItem.querySelector('.event-name').textContent;
    console.log('Adding event:', eventName);
    
    // Update event status
    const statusElement = eventItem.querySelector('.event-status');
    if (statusElement) {
        statusElement.textContent = 'Scheduled';
        statusElement.className = 'event-status scheduled';
    }
    
    // Change button from add to edit
    const addBtn = eventItem.querySelector('.add-btn');
    if (addBtn) {
        addBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 1-2-2v-7" stroke="currentColor" stroke-width="2"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
        addBtn.className = 'edit-btn';
        addBtn.addEventListener('click', () => handleEventEdit(eventItem));
    }
    
    showSuccessMessage(`${eventName} has been scheduled!`);
}

// Vendor interactions
function handleVendorCategoryClick(event) {
    const vendorName = event.currentTarget.querySelector('.vendor-name').textContent;
    console.log('Selected vendor category:', vendorName);
    
    // Navigate to vendor selection or show vendor list
    showSuccessMessage(`Opening ${vendorName} selection...`);
}

// Guest interactions
function handleGuestMenu(guestItem) {
    const guestName = guestItem.querySelector('.guest-name').textContent;
    console.log('Opening menu for guest:', guestName);
    
    // Show guest options menu
    showGuestMenu(guestName);
}

// Vendor payment interactions
function handleVendorPaymentClick(vendorPayment) {
    const vendorName = vendorPayment.querySelector('.vendor-name').textContent;
    console.log('Opening vendor payment details:', vendorName);
    
    // Navigate to vendor payment detail screen
    showSuccessMessage(`Opening payment details for ${vendorName}...`);
}

// Utility functions
function showSuccessMessage(message) {
    // Create and show a temporary success message
    const messageElement = document.createElement('div');
    messageElement.className = 'success-message';
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #28a745;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    `;
    
    document.body.appendChild(messageElement);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 3000);
}

function showGuestMenu(guestName) {
    // Create a simple guest menu
    const menuElement = document.createElement('div');
    menuElement.className = 'guest-menu';
    menuElement.innerHTML = `
        <div class="menu-header">
            <h4>${guestName}</h4>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="menu-options">
            <button onclick="editGuest('${guestName}')">Edit Guest</button>
            <button onclick="removeGuest('${guestName}')">Remove Guest</button>
            <button onclick="sendInvitation('${guestName}')">Send Invitation</button>
        </div>
    `;
    
    menuElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        min-width: 250px;
        overflow: hidden;
    `;
    
    document.body.appendChild(menuElement);
}

// Guest menu actions
function editGuest(guestName) {
    console.log('Editing guest:', guestName);
    showSuccessMessage(`Editing ${guestName}...`);
    document.querySelector('.guest-menu').remove();
}

function removeGuest(guestName) {
    console.log('Removing guest:', guestName);
    showSuccessMessage(`${guestName} removed from guest list`);
    document.querySelector('.guest-menu').remove();
}

function sendInvitation(guestName) {
    console.log('Sending invitation to:', guestName);
    showSuccessMessage(`Invitation sent to ${guestName}`);
    document.querySelector('.guest-menu').remove();
}

// Budget management
function updateBudget(amount) {
    const budgetAmount = document.querySelector('.budget-amount');
    if (budgetAmount) {
        budgetAmount.textContent = formatCurrency(amount);
    }
}

// Guest count management
function updateGuestCount(count) {
    const guestField = document.querySelector('.guest-field');
    if (guestField) {
        guestField.value = count;
    }
}

// Toggle functionality
function toggleAutoCalculate() {
    const toggle = document.querySelector('.toggle input');
    if (toggle) {
        toggle.checked = !toggle.checked;
        const isEnabled = toggle.checked;
        showSuccessMessage(`Auto-calculate GST and deposits ${isEnabled ? 'enabled' : 'disabled'}`);
    }
}

// Add task functionality
function addTask() {
    const taskName = prompt('Enter task name:');
    if (taskName) {
        const timelineList = document.querySelector('.timeline-list');
        if (timelineList) {
            const newTask = document.createElement('div');
            newTask.className = 'timeline-item';
            newTask.innerHTML = `
                <span class="time">New Task</span>
                <span class="task">${taskName}</span>
            `;
            timelineList.appendChild(newTask);
            showSuccessMessage(`Task "${taskName}" added successfully!`);
        }
    }
}

// Add vendor functionality
function addVendor() {
    const vendorName = prompt('Enter vendor name:');
    const vendorRole = prompt('Enter vendor role:');
    
    if (vendorName && vendorRole) {
        const vendorList = document.querySelector('.vendor-list');
        if (vendorList) {
            const newVendor = document.createElement('div');
            newVendor.className = 'vendor-item';
            newVendor.innerHTML = `
                <div class="vendor-info">
                    <span class="vendor-name">${vendorName}</span>
                    <span class="vendor-role">${vendorRole}</span>
                </div>
                <button class="menu-btn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="1.5"/>
                        <circle cx="10" cy="6" r="1.5"/>
                        <circle cx="10" cy="14" r="1.5"/>
                    </svg>
                </button>
            `;
            vendorList.appendChild(newVendor);
            showSuccessMessage(`Vendor "${vendorName}" added successfully!`);
        }
    }
}

// Add caterer functionality
function addCaterer() {
    const catererName = prompt('Enter caterer name:');
    if (catererName) {
        const catererItem = document.querySelector('.caterer-item');
        if (catererItem) {
            const nameElement = catererItem.querySelector('.caterer-name');
            nameElement.textContent = catererName;
            showSuccessMessage(`Caterer "${catererName}" added successfully!`);
        }
    }
}

// Export functions for global access
window.showScreen = showScreen;
window.goBack = goBack;
window.toggleMenu = toggleMenu;
window.addTask = addTask;
window.addVendor = addVendor;
window.addCaterer = addCaterer;
window.editGuest = editGuest;
window.removeGuest = removeGuest;
window.sendInvitation = sendInvitation;
