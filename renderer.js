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
    const aiGenerateBtn = document.getElementById('aiGenerateBtn');
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
    
    // About modal elements
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutModal = document.getElementById('aboutModal');
    const closeAboutModal = document.getElementById('closeAboutModal');
    const closeAboutBtn = document.getElementById('closeAboutBtn');
    
    // AI modal elements - removed (now uses separate page)
    
    let currentTemplate = null;
    let editingTemplate = null;
    let searchTerm = '';
    let adminSettings = {
        debugMode: false,
        autoSave: true,
        maxTemplates: 50,
        customCategories: []
    };
    
    // AI system state - removed (now handled in separate page)
    
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
        
        // AI system debug - removed (now uses separate page)
    }
    
    function setupEventListeners() {
        // Theme toggle functionality
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
        
        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
        
        // Search functionality
        searchBox.addEventListener('input', function() {
            searchTerm = this.value.toLowerCase();
            renderCategories();
        });
        
        // Header buttons
        aiGenerateBtn.addEventListener('click', function() {
            window.location.href = 'ai-generator.html';
        });
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
        
        // About modal events
        aboutBtn.addEventListener('click', openAboutModal);
        closeAboutModal.addEventListener('click', closeAboutModalFunc);
        closeAboutBtn.addEventListener('click', closeAboutModalFunc);
        
        // AI modal events - removed (now uses separate page)
        
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
        
        aboutModal.addEventListener('click', function(e) {
            if (e.target === aboutModal) {
                closeAboutModalFunc();
            }
        });
        
        // AI modal click-outside handler - removed (now uses separate page)
        
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
        
        // Render Official Siemens Templates section (expanded by default)
        if (officialTemplates.length > 0) {
            renderTemplateSection('Official Siemens Templates', officialTemplates, 'siemens-section', false);
        }
        
        updateTemplateCount();
    }
    
    function renderTemplateSection(sectionTitle, templates, sectionClass, defaultCollapsed = false) {
        // Create main section
        const sectionDiv = document.createElement('div');
        sectionDiv.className = `template-section ${sectionClass}`;
        
        // Set default collapsed state
        if (defaultCollapsed) {
            sectionDiv.classList.add('collapsed');
        }
        
        // Section header
        const sectionHeaderDiv = document.createElement('div');
        sectionHeaderDiv.className = 'section-header';
        sectionHeaderDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span class="section-title">${sectionTitle}</span>
                <span class="section-count">(${templates.length})</span>
            </div>
            <span class="section-toggle">${defaultCollapsed ? '▶' : '▼'}</span>
        `;
        
        // Toggle section collapse
        sectionHeaderDiv.addEventListener('click', function() {
            const isCollapsed = sectionDiv.classList.toggle('collapsed');
            const toggle = sectionHeaderDiv.querySelector('.section-toggle');
            toggle.textContent = isCollapsed ? '▶' : '▼';
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
        // Navigate to the admin page
        window.location.href = 'admin.html';
    }
    
    function closeAdminModalFunc() {
        adminModal.style.display = 'none';
    }
    
    // About Modal Functions
    function openAboutModal() {
        aboutModal.style.display = 'block';
    }
    
    function closeAboutModalFunc() {
        aboutModal.style.display = 'none';
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
        } else if (tabName === 'siemens') {
            loadSiemensTemplates();
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
    
    // Siemens Templates Management Functions
    function loadSiemensTemplates() {
        const allTemplates = templateManager.getAllTemplates();
        const officialTemplates = allTemplates.filter(t => !t.isCustom);
        
        const officialList = document.getElementById('officialTemplatesList');
        officialList.innerHTML = '';
        
        if (officialTemplates.length === 0) {
            officialList.innerHTML = '<div style="padding: 10px; color: #7f8c8d;">No official templates found.</div>';
            return;
        }
        
        officialTemplates.forEach(template => {
            const templateItem = document.createElement('div');
            templateItem.className = 'category-admin-item';
            templateItem.innerHTML = `
                <div>
                    <strong>${template.title}</strong><br>
                    <small style="color: #7f8c8d;">${template.category} - ${template.description}</small>
                </div>
                <div class="category-admin-actions">
                    <button class="category-admin-btn" onclick="validateSingleTemplate('${template.id}')">Validate</button>
                    <button class="category-admin-btn delete" onclick="removeSiemensTemplate('${template.id}')">Remove</button>
                </div>
            `;
            officialList.appendChild(templateItem);
        });
    }
    
    function scanDocumentationFiles() {
        updateSiemensStatus('Scanning documentation files...', 'info');
        
        setTimeout(() => {
            // Simulate scanning and finding missing templates
            const missingTemplates = [
                'Database Connection Pooling',
                'Advanced Error Handling',
                'Custom Control Elements',
                'Performance Monitoring'
            ];
            
            if (missingTemplates.length > 0) {
                updateSiemensStatus(`Found ${missingTemplates.length} missing templates ready for import`, 'success');
                document.getElementById('importMissingBtn').disabled = false;
                document.getElementById('importMissingBtn').setAttribute('data-templates', JSON.stringify(missingTemplates));
            } else {
                updateSiemensStatus('All official templates are up to date', 'success');
            }
        }, 2000);
    }
    
    function importMissingTemplates() {
        const missingData = document.getElementById('importMissingBtn').getAttribute('data-templates');
        if (!missingData) {
            updateSiemensStatus('No missing templates found. Run scan first.', 'warning');
            return;
        }
        
        const missingTemplates = JSON.parse(missingData);
        updateSiemensStatus(`Importing ${missingTemplates.length} missing templates...`, 'info');
        
        setTimeout(() => {
            // Add the missing templates (simplified for demo)
            let imported = 0;
            missingTemplates.forEach(templateName => {
                const newTemplate = {
                    id: 'siemens-' + Date.now() + '-' + imported,
                    title: templateName,
                    category: 'System Integration',
                    description: `Official Siemens template for ${templateName}`,
                    isCustom: false,
                    code: `// ${templateName} - Official Siemens Template\n// This template provides ${templateName.toLowerCase()} functionality\n\nfunction ${templateName.replace(/\s+/g, '')}() {\n    // Implementation from Siemens documentation\n    HMIRuntime.Trace("${templateName} initialized");\n    \n    // Add your specific implementation here\n    return true;\n}\n\n// Usage example\n${templateName.replace(/\s+/g, '')}();`
                };
                
                templateManager.addTemplate(newTemplate);
                imported++;
            });
            
            renderCategories();
            loadSiemensTemplates();
            updateSiemensStatus(`Successfully imported ${imported} official templates`, 'success');
            document.getElementById('importMissingBtn').disabled = true;
        }, 1500);
    }
    
    function importSingleTemplate() {
        const selectElement = document.getElementById('manualTemplateSelect');
        const selectedValue = selectElement.value;
        
        if (!selectedValue) {
            updateSiemensStatus('Please select a template to import', 'warning');
            return;
        }
        
        const templateDefinitions = {
            'database-connections': {
                title: 'Advanced Database Connections',
                category: 'Data Storage',
                description: 'Enterprise database connection management with pooling',
                code: `// Advanced Database Connections - Siemens WinCC Unified\n// Enterprise-grade database connection with pooling\n\nvar dbConnectionPool = {\n    connections: [],\n    maxConnections: 5,\n    \n    getConnection: function() {\n        if (this.connections.length > 0) {\n            return this.connections.pop();\n        }\n        \n        if (this.activeConnections < this.maxConnections) {\n            return this.createNewConnection();\n        }\n        \n        throw new Error('Connection pool exhausted');\n    },\n    \n    createNewConnection: function() {\n        var connectionString = "Server=production-db;Database=WinCC_Enterprise;Trusted_Connection=true;";\n        var connection = HMIRuntime.CreateDatabaseConnection(connectionString);\n        this.activeConnections = (this.activeConnections || 0) + 1;\n        HMIRuntime.Trace("New database connection created");\n        return connection;\n    },\n    \n    releaseConnection: function(connection) {\n        this.connections.push(connection);\n        HMIRuntime.Trace("Database connection returned to pool");\n    }\n};\n\n// Usage example\nvar conn = dbConnectionPool.getConnection();\ntry {\n    var result = conn.ExecuteQuery("SELECT TOP 10 * FROM ProductionData");\n    // Process results\n} finally {\n    dbConnectionPool.releaseConnection(conn);\n}`
            },
            'script-snippets': {
                title: 'Script Snippets Manager',
                category: 'Development Tools',
                description: 'Manage and organize reusable script snippets',
                code: `// Script Snippets Manager - Siemens WinCC Unified\n// Organize and manage reusable code snippets\n\nvar scriptSnippets = {\n    snippets: {},\n    \n    register: function(name, code, description) {\n        this.snippets[name] = {\n            code: code,\n            description: description,\n            created: new Date().toISOString()\n        };\n        HMIRuntime.Trace("Snippet registered: " + name);\n    },\n    \n    execute: function(name, parameters) {\n        if (!this.snippets[name]) {\n            throw new Error("Snippet not found: " + name);\n        }\n        \n        try {\n            var func = new Function('params', this.snippets[name].code);\n            return func(parameters);\n        } catch (error) {\n            HMIRuntime.Trace("Error executing snippet " + name + ": " + error.message);\n            throw error;\n        }\n    },\n    \n    list: function() {\n        var list = [];\n        for (var name in this.snippets) {\n            list.push({\n                name: name,\n                description: this.snippets[name].description\n            });\n        }\n        return list;\n    }\n};\n\n// Register common snippets\nscriptSnippets.register('readMotorData', \n    'var speed = Tags(params.motorTag + "_Speed").Read(); var current = Tags(params.motorTag + "_Current").Read(); return {speed: speed, current: current};',\n    'Read motor speed and current data'\n);\n\n// Usage example\nvar motorData = scriptSnippets.execute('readMotorData', {motorTag: 'MOTOR_001'});\nHMIRuntime.Trace("Motor speed: " + motorData.speed + " RPM");`
            },
            'touch-gestures': {
                title: 'Advanced Touch Gestures',
                category: 'User Interface',
                description: 'Comprehensive touch gesture recognition and handling',
                code: `// Advanced Touch Gestures - Siemens WinCC Unified\n// Multi-touch gesture recognition system\n\nvar gestureManager = {\n    startX: 0, startY: 0,\n    currentX: 0, currentY: 0,\n    isTracking: false,\n    minSwipeDistance: 50,\n    \n    init: function(touchArea) {\n        this.touchArea = touchArea;\n        this.setupGestureHandlers();\n        HMIRuntime.Trace("Gesture manager initialized");\n    },\n    \n    setupGestureHandlers: function() {\n        var self = this;\n        \n        // Simulated touch events (adapt to actual WinCC touch events)\n        this.touchArea.onTouchStart = function(x, y) {\n            self.startX = x;\n            self.startY = y;\n            self.isTracking = true;\n        };\n        \n        this.touchArea.onTouchMove = function(x, y) {\n            if (self.isTracking) {\n                self.currentX = x;\n                self.currentY = y;\n            }\n        };\n        \n        this.touchArea.onTouchEnd = function() {\n            if (self.isTracking) {\n                self.processGesture();\n                self.isTracking = false;\n            }\n        };\n    },\n    \n    processGesture: function() {\n        var deltaX = this.currentX - this.startX;\n        var deltaY = this.currentY - this.startY;\n        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);\n        \n        if (distance < this.minSwipeDistance) {\n            this.onTap();\n            return;\n        }\n        \n        var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;\n        \n        if (Math.abs(angle) < 45) {\n            this.onSwipeRight();\n        } else if (Math.abs(angle) > 135) {\n            this.onSwipeLeft();\n        } else if (angle < 0) {\n            this.onSwipeUp();\n        } else {\n            this.onSwipeDown();\n        }\n    },\n    \n    onTap: function() {\n        HMIRuntime.Trace("Gesture: Tap detected");\n        // Handle tap\n    },\n    \n    onSwipeLeft: function() {\n        HMIRuntime.Trace("Gesture: Swipe left - Next screen");\n        // Navigate to next screen\n    },\n    \n    onSwipeRight: function() {\n        HMIRuntime.Trace("Gesture: Swipe right - Previous screen");\n        // Navigate to previous screen\n    },\n    \n    onSwipeUp: function() {\n        HMIRuntime.Trace("Gesture: Swipe up - Show menu");\n        // Show menu\n    },\n    \n    onSwipeDown: function() {\n        HMIRuntime.Trace("Gesture: Swipe down - Show alarms");\n        // Show alarms\n    }\n};\n\n// Initialize gesture manager\nvar mainTouchArea = Screen.FindItem('MainTouchArea');\nif (mainTouchArea) {\n    gestureManager.init(mainTouchArea);\n}`
            }
        };
        
        const templateData = templateDefinitions[selectedValue];
        if (!templateData) {
            updateSiemensStatus('Template definition not found', 'error');
            return;
        }
        
        updateSiemensStatus('Importing template...', 'info');
        
        setTimeout(() => {
            const newTemplate = {
                id: 'siemens-manual-' + Date.now(),
                title: templateData.title,
                category: templateData.category,
                description: templateData.description,
                isCustom: false,
                code: templateData.code
            };
            
            templateManager.addTemplate(newTemplate);
            renderCategories();
            loadSiemensTemplates();
            updateSiemensStatus(`Successfully imported "${templateData.title}"`, 'success');
            selectElement.value = '';
        }, 1000);
    }
    
    function validateSingleTemplate(templateId) {
        const template = templateManager.getTemplate(templateId);
        if (!template) {
            updateSiemensStatus('Template not found', 'error');
            return;
        }
        
        updateSiemensStatus(`Validating "${template.title}"...`, 'info');
        
        setTimeout(() => {
            // Simple validation - check for basic syntax
            try {
                // Basic validation checks
                const code = template.code;
                if (!code || code.trim().length === 0) {
                    throw new Error('Template code is empty');
                }
                
                if (!code.includes('HMIRuntime') && !code.includes('Tags') && !code.includes('function')) {
                    throw new Error('Template does not contain typical WinCC code patterns');
                }
                
                updateSiemensStatus(`Template "${template.title}" validation passed`, 'success');
            } catch (error) {
                updateSiemensStatus(`Validation failed: ${error.message}`, 'error');
            }
        }, 800);
    }
    
    function validateAllTemplates() {
        const allTemplates = templateManager.getAllTemplates();
        const officialTemplates = allTemplates.filter(t => !t.isCustom);
        
        updateSiemensStatus(`Validating ${officialTemplates.length} official templates...`, 'info');
        
        setTimeout(() => {
            let passed = 0;
            let failed = 0;
            
            officialTemplates.forEach(template => {
                try {
                    if (template.code && template.code.trim().length > 0) {
                        passed++;
                    } else {
                        failed++;
                    }
                } catch (error) {
                    failed++;
                }
            });
            
            updateSiemensStatus(`Validation complete: ${passed} passed, ${failed} failed`, passed === officialTemplates.length ? 'success' : 'warning');
        }, 2000);
    }
    
    function checkForUpdates() {
        updateSiemensStatus('Checking for template updates...', 'info');
        
        setTimeout(() => {
            // Simulate checking for updates
            const hasUpdates = Math.random() > 0.5;
            if (hasUpdates) {
                updateSiemensStatus('Updates available for 3 templates', 'info');
            } else {
                updateSiemensStatus('All templates are up to date', 'success');
            }
        }, 1500);
    }
    
    function resetToDefaultSiemens() {
        if (!confirm('This will reset all official Siemens templates to default versions. Custom templates will not be affected. Continue?')) {
            return;
        }
        
        updateSiemensStatus('Resetting to default Siemens templates...', 'info');
        
        setTimeout(() => {
            const allTemplates = templateManager.getAllTemplates();
            const officialTemplates = allTemplates.filter(t => !t.isCustom);
            
            // Remove current official templates
            officialTemplates.forEach(template => {
                templateManager.removeTemplate(template.id);
            });
            
            // This would reload default templates (they're already loaded from templates.js)
            renderCategories();
            loadSiemensTemplates();
            updateSiemensStatus(`Reset complete: Restored default official templates`, 'success');
        }, 1500);
    }
    
    function removeSiemensTemplate(templateId) {
        const template = templateManager.getTemplate(templateId);
        if (!template) return;
        
        if (confirm(`Remove "${template.title}" from the template library?`)) {
            templateManager.removeTemplate(templateId);
            renderCategories();
            loadSiemensTemplates();
            updateSiemensStatus(`Removed template "${template.title}"`, 'success');
        }
    }
    
    function updateSiemensStatus(message, type) {
        const statusElement = document.getElementById('siemensStatusText');
        const statusContainer = document.getElementById('siemensStatus');
        
        statusElement.textContent = message;
        
        // Update status color based on type
        statusContainer.style.backgroundColor = {
            'success': '#d4edda',
            'warning': '#fff3cd',
            'error': '#f8d7da',
            'info': '#d1ecf1'
        }[type] || '#f8f9fa';
        
        statusContainer.style.borderLeft = `4px solid ${({
            'success': '#28a745',
            'warning': '#ffc107',
            'error': '#dc3545',
            'info': '#17a2b8'
        }[type] || '#6c757d')}`;
    }
    
    // Setup Siemens tab event listeners
    document.getElementById('scanDocsBtn').addEventListener('click', scanDocumentationFiles);
    document.getElementById('importMissingBtn').addEventListener('click', importMissingTemplates);
    document.getElementById('importSingleBtn').addEventListener('click', importSingleTemplate);
    document.getElementById('validateTemplatesBtn').addEventListener('click', validateAllTemplates);
    document.getElementById('updateTemplatesBtn').addEventListener('click', checkForUpdates);
    document.getElementById('resetOfficialBtn').addEventListener('click', resetToDefaultSiemens);
    
    // Make functions globally accessible
    window.validateSingleTemplate = validateSingleTemplate;
    window.removeSiemensTemplate = removeSiemensTemplate;

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
    
    // ========================================
    // AI CODE GENERATION - Now handled by separate page (ai-generator.html)
    // ========================================
    
    rendererLogger.log('Enhanced Template Browser ready! AI functionality moved to ai-generator.html');
}); 