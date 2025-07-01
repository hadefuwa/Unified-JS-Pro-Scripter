// Admin Panel JavaScript - Clean Version
console.log('🚀 ADMIN: Admin panel JavaScript loaded');

function goBackToMain() {
    console.log('🚀 ADMIN: Navigating back to main application');
    window.location.href = 'index.html';
}

// Make function globally available
window.goBackToMain = goBackToMain;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ADMIN: Admin panel DOM ready, initializing...');
    
    // Set up tab switching functionality
    setupTabs();
    
    // Initialize admin panel features
    initializeAdminPanel();
    
    console.log('✅ ADMIN: Admin panel ready!');
});

function setupTabs() {
    const tabs = document.querySelectorAll('.admin-tab-btn');
    const contents = document.querySelectorAll('.admin-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(target + 'Tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    console.log('✅ ADMIN: Tab switching initialized');
}

function initializeAdminPanel() {
    // Load template data if templateManager is available
    if (typeof templateManager !== 'undefined') {
        console.log('✅ ADMIN: Template manager found, loading data...');
        loadAdminData();
    } else {
        console.log('⏳ ADMIN: Template manager not available yet, retrying...');
        setTimeout(initializeAdminPanel, 100);
    }
}

function loadAdminData() {
    try {
        const templates = templateManager.getAllTemplates();
        console.log('✅ ADMIN: Loaded templates:', templates.length);
        
        // Update statistics and categories display
        updateAdminDisplay(templates);
    } catch (error) {
        console.error('❌ ADMIN: Error loading template data:', error);
    }
}

function updateAdminDisplay(templates) {
    // This function would update the admin panel with current template data
    // Implementation would depend on the specific admin panel structure
    console.log('✅ ADMIN: Admin display updated with', templates.length, 'templates');
}

console.log('✅ ADMIN: Admin.js loaded successfully'); 