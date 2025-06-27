// Enhanced Template Browser with Custom Template Support
// This handles the dynamic template system and user interactions

// Use the console logger exposed by preload.js if available
const rendererLogger = window.consoleLogger || {
    log: console.log,
    error: console.error,
    warning: console.warn,
    debug: console.debug
};

document.addEventListener('DOMContentLoaded', function() {
    
    // Get DOM elements
    const categoriesContainer = document.getElementById('categoriesContainer');
    const codeDisplay = document.getElementById('codeDisplay');
    const copyBtn = document.getElementById('copyBtn');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const statusText = document.getElementById('statusText');
    const copyFeedback = document.getElementById('copyFeedback');
    const descriptionTitle = document.getElementById('descriptionTitle');
    const descriptionText = document.getElementById('descriptionText');
    const templateCount = document.getElementById('templateCount');
    const searchBox = document.getElementById('searchBox');
    
    // Header buttons
    const addTemplateBtn = document.getElementById('addTemplateBtn');
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');
    const adminBtn = document.getElementById('adminBtn');
    
    // Modal elements
    const templateModal = document.getElementById('templateModal');
    const modalTitle = document.getElementById('modalTitle');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');
    const templateTitle = document.getElementById('templateTitle');
    const templateCategory = document.getElementById('templateCategory');
    const templateDescription = document.getElementById('templateDescription');
    const templateCode = document.getElementById('templateCode');
    
    // Admin modal elements
    const adminModal = document.getElementById('adminModal');
    const closeAdminModal = document.getElementById('closeAdminModal');
    const cancelAdminBtn = document.getElementById('cancelAdminBtn');
    const saveAdminBtn = document.getElementById('saveAdminBtn');
    
    let currentTemplate = null;
    let editingTemplate = null;
    let searchTerm = '';
    let adminSettings = {
        debugMode: false,
        autoSave: true,
        maxTemplates: 50,
        customCategories: []
    };
    
    rendererLogger.log('Unified JS Pro - Enhanced Template Browser loaded');
    
    // Add global function to trigger template reload
    window.triggerTemplateReload = function() {
        rendererLogger.log('Template reload triggered - re-rendering categories...');
        renderCategories();
        updateTemplateCount();
    };
    
    // Initialize the app
    init();
    
    function init() {
        renderCategories();
        updateTemplateCount();
        
        // Load first template if available
        const firstTemplate = templateManager.getAllTemplates()[0];
        if (firstTemplate) {
            loadTemplate(firstTemplate.id);
        }
        
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Search functionality
        searchBox.addEventListener('input', function() {
            searchTerm = this.value.toLowerCase();
            renderCategories();
        });
        
        // Header buttons
        addTemplateBtn.addEventListener('click', openAddTemplateModal);
        importBtn.addEventListener('click', importTemplates);
        exportBtn.addEventListener('click', exportTemplates);
        adminBtn.addEventListener('click', openAdminModal);
        
        // Code area buttons
        copyBtn.addEventListener('click', copyCode);
        selectAllBtn.addEventListener('click', selectAllCode);
        editBtn.addEventListener('click', editCurrentTemplate);
        deleteBtn.addEventListener('click', deleteCurrentTemplate);
        
        // Modal events
        closeModal.addEventListener('click', closeTemplateModal);
        cancelBtn.addEventListener('click', closeTemplateModal);
        saveTemplateBtn.addEventListener('click', saveTemplate);
        
        // Admin modal events
        closeAdminModal.addEventListener('click', closeAdminModalFunc);
        cancelAdminBtn.addEventListener('click', closeAdminModalFunc);
        saveAdminBtn.addEventListener('click', saveAdminSettings);
        
        // Close modal when clicking outside
        templateModal.addEventListener('click', function(e) {
            if (e.target === templateModal) {
                closeTemplateModal();
            }
        });
        
        adminModal.addEventListener('click', function(e) {
            if (e.target === adminModal) {
                closeAdminModalFunc();
            }
        });
        
        // Admin tab switching
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                switchAdminTab(this.getAttribute('data-tab'));
            });
        });
    }
    
    function renderCategories() {
        categoriesContainer.innerHTML = '';
        
        // Separate official and custom templates
        const allTemplates = templateManager.getAllTemplates();
        const officialTemplates = allTemplates.filter(t => !t.isCustom);
        const customTemplates = allTemplates.filter(t => t.isCustom);
        
        rendererLogger.log('Rendering categories - Custom templates:', customTemplates.length, 'Official templates:', officialTemplates.length);
        
        // Render Custom Templates section first (more important for daily use)
        if (customTemplates.length > 0) {
            renderTemplateSection('User Created Templates', customTemplates, 'custom-section');
        }
        
        // Render Official Siemens Templates section
        if (officialTemplates.length > 0) {
            renderTemplateSection('Official Siemens Templates', officialTemplates, 'siemens-section');
        }
        
        updateTemplateCount();
    }
    
    function renderTemplateSection(sectionTitle, templates, sectionClass) {
        // Create main section
        const sectionDiv = document.createElement('div');
        sectionDiv.className = `template-section ${sectionClass}`;
        
        // Section header
        const sectionHeaderDiv = document.createElement('div');
        sectionHeaderDiv.className = 'section-header';
        sectionHeaderDiv.innerHTML = `
            <span class="section-title">${sectionTitle}</span>
            <span class="section-count">(${templates.length})</span>
            <span class="section-toggle">▼</span>
        `;
        
        // Toggle section collapse
        sectionHeaderDiv.addEventListener('click', function() {
            sectionDiv.classList.toggle('collapsed');
        });
        
        sectionDiv.appendChild(sectionHeaderDiv);
        
        // Group templates by category within this section
        const categoriesInSection = {};
        templates.forEach(template => {
            const category = template.category || 'Uncategorized';
            if (!categoriesInSection[category]) {
                categoriesInSection[category] = [];
            }
            categoriesInSection[category].push(template);
        });
        
        // Render categories within this section
        Object.keys(categoriesInSection).forEach(categoryName => {
            const categoryTemplates = categoriesInSection[categoryName];
            
            // Filter templates based on search
            const filteredTemplates = categoryTemplates.filter(template => {
                if (!searchTerm) return true;
                return template.title.toLowerCase().includes(searchTerm) ||
                       template.description.toLowerCase().includes(searchTerm) ||
                       template.code.toLowerCase().includes(searchTerm);
            });
            
            if (filteredTemplates.length === 0) return;
            
            // Create category element
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            
            // Category header
            const headerDiv = document.createElement('div');
            headerDiv.className = 'category-header';
            headerDiv.innerHTML = `
                ${categoryName}
                <span class="category-count">(${filteredTemplates.length})</span>
                <span class="category-toggle">▼</span>
            `;
            
            // Toggle category collapse
            headerDiv.addEventListener('click', function() {
                categoryDiv.classList.toggle('collapsed');
            });
            
            categoryDiv.appendChild(headerDiv);
            
            // Template container
            const templatesDiv = document.createElement('div');
            templatesDiv.className = 'category-templates';
            
            // Add templates
            filteredTemplates.forEach(template => {
                const templateDiv = document.createElement('div');
                templateDiv.className = 'template-item';
                templateDiv.setAttribute('data-template', template.id);
                
                if (currentTemplate === template.id) {
                    templateDiv.classList.add('active');
                }
                
                templateDiv.innerHTML = `
                    <div class="template-title">${template.title}</div>
                    <div class="template-desc">${template.description}</div>
                    ${template.isCustom ? (template.category === 'User' ? '<div class="template-badge custom">USER</div>' : '<div class="template-badge custom">CUSTOM</div>') : '<div class="template-badge official">SIEMENS</div>'}
                `;
                
                templateDiv.addEventListener('click', function() {
                    loadTemplate(template.id);
                });
                
                templatesDiv.appendChild(templateDiv);
            });
            
            categoryDiv.appendChild(templatesDiv);
            sectionDiv.appendChild(categoryDiv);
        });
        
        categoriesContainer.appendChild(sectionDiv);
    }
    
    function loadTemplate(templateId) {
        const template = templateManager.getTemplate(templateId);
        if (!template) return;
        
        // Update active state
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const templateElement = document.querySelector(`[data-template="${templateId}"]`);
        if (templateElement) {
            templateElement.classList.add('active');
        }
        
        // Load template content
        currentTemplate = templateId;
        codeDisplay.value = template.code;
        
        descriptionTitle.textContent = template.title;
        descriptionText.textContent = template.description;
        
        // Show/hide edit/delete buttons for custom templates
        if (template.isCustom) {
            editBtn.style.display = 'inline-block';
            deleteBtn.style.display = 'inline-block';
        } else {
            editBtn.style.display = 'none';
            deleteBtn.style.display = 'none';
        }
        
        updateStatus('Template loaded: ' + template.title);
        rendererLogger.log('Loaded:', template.title);
    }
    
    function copyCode() {
        const code = codeDisplay.value;
        
        if (code.trim() === '') {
            alert('No code to copy!');
            return;
        }
        
        try {
            codeDisplay.select();
            document.execCommand('copy');
            
            showCopyFeedback();
            updateStatus('Code copied! (' + code.length + ' characters)');
            
            copyBtn.style.transform = 'scale(0.95)';
            setTimeout(function() {
                copyBtn.style.transform = 'scale(1)';
            }, 150);
            
        } catch (error) {
            alert('Failed to copy code');
        }
    }
    
    function selectAllCode() {
        codeDisplay.select();
        updateStatus('All code selected - Press Ctrl+C to copy');
    }
    
    function showCopyFeedback() {
        copyFeedback.classList.add('show');
        setTimeout(function() {
            copyFeedback.classList.remove('show');
        }, 2000);
    }
    
    function updateStatus(message) {
        statusText.textContent = message;
    }
    
    function updateTemplateCount() {
        const allTemplates = templateManager.getAllTemplates();
        const totalTemplates = allTemplates.length;
        const customTemplates = allTemplates.filter(t => t.isCustom).length;
        const officialTemplates = allTemplates.filter(t => !t.isCustom).length;
        
        if (customTemplates > 0) {
            templateCount.textContent = `${totalTemplates} total (${officialTemplates} Siemens + ${customTemplates} User)`;
        } else {
            templateCount.textContent = `${totalTemplates} Siemens templates`;
        }
    }
    
    // Modal functions
    function openAddTemplateModal() {
        editingTemplate = null;
        modalTitle.textContent = 'Add New Template';
        clearModalForm();
        populateCategoryDropdown();
        templateModal.style.display = 'block';
        templateTitle.focus();
    }
    
    function editCurrentTemplate() {
        if (!currentTemplate) return;
        
        const template = templateManager.getTemplate(currentTemplate);
        if (!template || !template.isCustom) return;
        
        editingTemplate = template;
        modalTitle.textContent = 'Edit Template';
        
        populateCategoryDropdown();
        
        templateTitle.value = template.title;
        templateCategory.value = template.category;
        templateDescription.value = template.description;
        templateCode.value = template.code;
        
        templateModal.style.display = 'block';
        templateTitle.focus();
    }
    
    function deleteCurrentTemplate() {
        if (!currentTemplate) return;
        
        const template = templateManager.getTemplate(currentTemplate);
        if (!template || !template.isCustom) return;
        
        if (confirm(`Are you sure you want to delete "${template.title}"?`)) {
            try {
                templateManager.removeTemplate(currentTemplate);
                renderCategories();
                
                // Load first available template
                const firstTemplate = templateManager.getAllTemplates()[0];
                if (firstTemplate) {
                    loadTemplate(firstTemplate.id);
                } else {
                    currentTemplate = null;
                    codeDisplay.value = '';
                    descriptionTitle.textContent = 'No templates';
                    descriptionText.textContent = 'All templates have been deleted.';
                }
                
                updateStatus('Template deleted successfully');
            } catch (error) {
                alert('Error deleting template: ' + error.message);
            }
        }
    }
    
    function closeTemplateModal() {
        templateModal.style.display = 'none';
        clearModalForm();
        editingTemplate = null;
    }
    
    function clearModalForm() {
        templateTitle.value = '';
        templateCategory.value = 'User';
        templateDescription.value = '';
        templateCode.value = '';
    }
    
    function populateCategoryDropdown() {
        const allTemplates = templateManager.getAllTemplates();
        const categories = [...new Set(allTemplates.map(t => t.category))].sort();
        
        // Clear existing options
        templateCategory.innerHTML = '';
        
        // Add all available categories
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            templateCategory.appendChild(option);
        });
        
        // Add default categories that might not exist yet
        const defaultCategories = ['User', 'Custom', 'Tag Operations', 'Screen Navigation', 'Alarm Management', 'Recipe Management', 'Utilities'];
        defaultCategories.forEach(category => {
            if (!categories.includes(category)) {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                templateCategory.appendChild(option);
            }
        });
    }
    
    function saveTemplate() {
        const title = templateTitle.value.trim();
        const category = templateCategory.value;
        const description = templateDescription.value.trim();
        const code = templateCode.value.trim();
        
        if (!title || !code) {
            alert('Please fill in the title and code fields.');
            return;
        }
        
        try {
            if (editingTemplate) {
                // Update existing template
                editingTemplate.title = title;
                editingTemplate.category = category;
                editingTemplate.description = description;
                editingTemplate.code = code;
                
                templateManager.addTemplate(editingTemplate);
                updateStatus('Template updated successfully');
            } else {
                // Create new template
                const newTemplate = templateManager.createCustomTemplate(title, description, category, code);
                updateStatus('Template created successfully');
                currentTemplate = newTemplate.id;
            }
            
            renderCategories();
            closeTemplateModal();
            
            // Load the saved template
            if (currentTemplate) {
                loadTemplate(currentTemplate);
            }
            
        } catch (error) {
            alert('Error saving template: ' + error.message);
        }
    }
    
    function exportTemplates() {
        try {
            const data = templateManager.exportTemplates();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'wincc-templates-' + new Date().toISOString().split('T')[0] + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            updateStatus('Templates exported successfully');
        } catch (error) {
            alert('Error exporting templates: ' + error.message);
        }
    }
    
    function importTemplates() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const imported = templateManager.importTemplates(e.target.result);
                    renderCategories();
                    updateStatus(`Successfully imported ${imported} templates`);
                } catch (error) {
                    alert('Error importing templates: ' + error.message);
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    // Admin Functions
    function openAdminModal() {
        loadAdminSettings();
        adminModal.style.display = 'block';
        switchAdminTab('categories');
        updateAdminStatistics();
        loadCategoryList();
    }
    
    function closeAdminModalFunc() {
        adminModal.style.display = 'none';
    }
    
    function switchAdminTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.admin-tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(tabName + 'Tab').classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Load specific tab data
        if (tabName === 'statistics') {
            updateAdminStatistics();
        } else if (tabName === 'categories') {
            loadCategoryList();
        }
    }
    
    function loadCategoryList() {
        const categoryList = document.getElementById('categoryList');
        const allTemplates = templateManager.getAllTemplates();
        
        // Get all unique categories
        const categories = [...new Set(allTemplates.map(t => t.category))].sort();
        
        categoryList.innerHTML = '';
        
        categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-admin-item';
            categoryItem.innerHTML = `
                <input type="text" class="category-name-edit" value="${category}" data-original="${category}">
                <div class="category-admin-actions">
                    <button class="category-admin-btn" onclick="saveCategoryName(this)">Save</button>
                    <button class="category-admin-btn delete" onclick="deleteCategory('${category}')">Delete</button>
                </div>
            `;
            categoryList.appendChild(categoryItem);
        });
        
        // Add new category functionality
        const addCategoryBtn = document.getElementById('addCategoryBtn');
        const newCategoryInput = document.getElementById('newCategoryName');
        
        addCategoryBtn.onclick = function() {
            const newName = newCategoryInput.value.trim();
            if (newName && !categories.includes(newName)) {
                adminSettings.customCategories.push(newName);
                saveAdminSettings();
                loadCategoryList();
                newCategoryInput.value = '';
                updateStatus('Category "' + newName + '" added successfully');
            } else if (categories.includes(newName)) {
                alert('Category already exists!');
            } else {
                alert('Please enter a category name');
            }
        };
    }
    
    function saveCategoryName(button) {
        const input = button.parentElement.parentElement.querySelector('.category-name-edit');
        const originalName = input.getAttribute('data-original');
        const newName = input.value.trim();
        
        if (newName && newName !== originalName) {
            // Update all templates with this category
            const allTemplates = templateManager.getAllTemplates();
            let updated = 0;
            
            allTemplates.forEach(template => {
                if (template.category === originalName) {
                    template.category = newName;
                    templateManager.addTemplate(template);
                    updated++;
                }
            });
            
            // Force save custom templates to localStorage
            templateManager.saveCustomTemplates();
            
            updateStatus(`Updated ${updated} templates from "${originalName}" to "${newName}"`);
            renderCategories();
            loadCategoryList();
        }
    }
    
    function deleteCategory(categoryName) {
        const allTemplates = templateManager.getAllTemplates();
        const templatesInCategory = allTemplates.filter(t => t.category === categoryName);
        
        if (templatesInCategory.length > 0) {
            const confirmMessage = `This will delete ${templatesInCategory.length} templates in "${categoryName}". Are you sure?`;
            if (confirm(confirmMessage)) {
                // Delete all templates in this category
                templatesInCategory.forEach(template => {
                    if (template.isCustom) {
                        templateManager.removeTemplate(template.id);
                    }
                });
                
                updateStatus(`Deleted category "${categoryName}" and ${templatesInCategory.length} templates`);
                renderCategories();
                loadCategoryList();
            }
        } else {
            updateStatus(`Category "${categoryName}" is empty and cannot be deleted`);
        }
    }
    
    function updateAdminStatistics() {
        const allTemplates = templateManager.getAllTemplates();
        const customTemplates = allTemplates.filter(t => t.isCustom);
        const categories = [...new Set(allTemplates.map(t => t.category))];
        
        document.getElementById('totalTemplates').textContent = allTemplates.length;
        document.getElementById('customTemplates').textContent = customTemplates.length;
        document.getElementById('totalCategories').textContent = categories.length;
        
        // Get app launches from localStorage
        const launches = localStorage.getItem('appLaunches') || '0';
        document.getElementById('appLaunches').textContent = launches;
    }
    
    function loadAdminSettings() {
        const saved = localStorage.getItem('adminSettings');
        if (saved) {
            adminSettings = { ...adminSettings, ...JSON.parse(saved) };
        }
        
        // Load settings into form
        document.getElementById('enableDebugMode').checked = adminSettings.debugMode;
        document.getElementById('autoSaveTemplates').checked = adminSettings.autoSave;
        document.getElementById('maxTemplates').value = adminSettings.maxTemplates;
    }
    
    function saveAdminSettings() {
        // Get values from form
        adminSettings.debugMode = document.getElementById('enableDebugMode').checked;
        adminSettings.autoSave = document.getElementById('autoSaveTemplates').checked;
        adminSettings.maxTemplates = parseInt(document.getElementById('maxTemplates').value);
        
        // Save to localStorage
        localStorage.setItem('adminSettings', JSON.stringify(adminSettings));
        
        updateStatus('Admin settings saved successfully');
        closeAdminModalFunc();
    }
    
    // Add maintenance functions
    document.getElementById('clearCustomTemplatesBtn').addEventListener('click', function() {
        if (confirm('This will permanently delete ALL custom templates. Are you sure?')) {
            const allTemplates = templateManager.getAllTemplates();
            const customTemplates = allTemplates.filter(t => t.isCustom);
            
            customTemplates.forEach(template => {
                templateManager.removeTemplate(template.id);
            });
            
            renderCategories();
            updateStatus(`Deleted ${customTemplates.length} custom templates`);
            updateAdminStatistics();
        }
    });
    
    document.getElementById('resetSettingsBtn').addEventListener('click', function() {
        if (confirm('This will reset all settings to default values. Are you sure?')) {
            localStorage.removeItem('adminSettings');
            localStorage.removeItem('appLaunches');
            adminSettings = {
                debugMode: false,
                autoSave: true,
                maxTemplates: 50,
                customCategories: []
            };
            loadAdminSettings();
            updateStatus('Settings reset to defaults');
        }
    });
    
    document.getElementById('exportConfigBtn').addEventListener('click', function() {
        const config = {
            settings: adminSettings,
            customTemplates: templateManager.getAllTemplates().filter(t => t.isCustom),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'unified-js-pro-config-' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        updateStatus('Configuration exported successfully');
    });
    
    document.getElementById('importConfigBtn').addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const config = JSON.parse(e.target.result);
                    
                    if (config.settings) {
                        adminSettings = { ...adminSettings, ...config.settings };
                        localStorage.setItem('adminSettings', JSON.stringify(adminSettings));
                    }
                    
                    if (config.customTemplates && Array.isArray(config.customTemplates)) {
                        config.customTemplates.forEach(template => {
                            templateManager.addTemplate(template);
                        });
                    }
                    
                    loadAdminSettings();
                    renderCategories();
                    updateStatus(`Configuration imported successfully from ${config.timestamp || 'unknown date'}`);
                    
                } catch (error) {
                    alert('Error importing configuration: ' + error.message);
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    });
    
    // Track app launches
    const launches = parseInt(localStorage.getItem('appLaunches') || '0') + 1;
    localStorage.setItem('appLaunches', launches.toString());
    
    // Make admin functions globally accessible
    window.saveCategoryName = saveCategoryName;
    window.deleteCategory = deleteCategory;
    
    rendererLogger.log('Enhanced Template Browser Ready! You can now add custom templates.');
}); 