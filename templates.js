// Dynamic Template Management System for WinCC Unified JavaScript
// This system loads templates from templates.json and manages custom templates

// Use the console logger exposed by preload.js
// Check if it's already defined in window to avoid duplicate declarations
const templateLogger = {
    log: console.log,
    error: console.error
};

class TemplateManager {
    constructor() {
        templateLogger.log('Initializing TemplateManager...');
        this.templates = new Map();
        this.categories = new Map();
        templateLogger.log('Starting template loading process...');
        
        // Initialize with basic templates first
        this.loadBasicTemplates();
        this.loadCustomTemplates();
        
        // Then load from file
        this.loadTemplatesFromFile().then(success => {
            if (success) {
                templateLogger.log('Template loading from file completed');
                // Reload custom templates after official templates are loaded to ensure they're not lost
                templateLogger.log('Reloading custom templates to ensure they are preserved...');
                this.loadCustomTemplates();
            } else {
                templateLogger.error('Template loading from file failed');
            }
        });
        
        templateLogger.log('TemplateManager constructor finished');
    }

    // Load templates from templates.json file
    async loadTemplatesFromFile() {
        try {
            templateLogger.log('Starting to load templates from templates.json...');
            
            // Use the Electron API to load the file (now async)
            if (window.electronAPI && typeof window.electronAPI.loadTemplatesFile === 'function') {
                const templates = await window.electronAPI.loadTemplatesFile();
                
                if (templates && templates.length > 0) {
                    templateLogger.log(`Found ${templates.length} templates in JSON file`);
                    
                    // Add all templates from JSON file
                    for (const template of templates) {
                        templateLogger.log(`Adding template: ${template.id} - ${template.title}`);
                        this.addTemplate(template);
                    }
                    
                    templateLogger.log(`Successfully loaded ${templates.length} templates from templates.json`);
                    templateLogger.log('Current template count:', this.templates.size);
                    templateLogger.log('Current categories:', Array.from(this.categories.keys()));
                    
                    // Trigger re-render in renderer if available
                    if (typeof window !== 'undefined' && window.triggerTemplateReload) {
                        templateLogger.log('Triggering template reload in renderer...');
                        window.triggerTemplateReload();
                    }
                    
                    return true;
                } else {
                    throw new Error('No templates found or empty array returned');
                }
            } else {
                throw new Error('electronAPI not available or loadTemplatesFile is not a function');
            }
        } catch (error) {
            templateLogger.error('Error loading templates from file:', error);
            templateLogger.error('Error details:', error.message, error.stack);
            
            // Fall back to basic templates if file loading fails
            templateLogger.log('Falling back to basic templates...');
            this.loadBasicTemplates();
            return false;
        }
    }

    // Fallback basic templates if JSON file fails to load
    loadBasicTemplates() {
        templateLogger.log('Loading fallback basic templates...');
        const basicTemplates = [
            {
                id: 'tag-read-basic',
                title: 'Read Tag Value (Basic)',
                category: 'Tag Operations',
                description: 'Basic tag reading with error handling',
                isCustom: false,
                code: `// Basic Tag Read
function readTag(tagName) {
    try {
        var value = Tags(tagName).Read();
        HMIRuntime.Trace("Read " + tagName + ": " + value);
        return value;
    } catch (error) {
        HMIRuntime.Trace("Error reading tag: " + error.message);
        return null;
    }
}`
            },
            {
                id: 'tag-write-basic',
                title: 'Write Tag Value (Basic)',
                category: 'Tag Operations', 
                description: 'Basic tag writing with error handling',
                isCustom: false,
                code: `// Basic Tag Write
function writeTag(tagName, value) {
    try {
        Tags(tagName).Write(value);
        HMIRuntime.Trace("Wrote " + tagName + ": " + value);
        return true;
    } catch (error) {
        HMIRuntime.Trace("Error writing tag: " + error.message);
        return false;
    }
}`
            }
        ];

        for (const template of basicTemplates) {
            templateLogger.log('Adding basic template:', template.id);
            this.addTemplate(template);
        }
        templateLogger.log('Loaded', basicTemplates.length, 'basic templates as fallback');
    }

    // Load custom templates from localStorage
    loadCustomTemplates() {
        try {
            templateLogger.log('Attempting to load custom templates from localStorage...');
            const saved = localStorage.getItem('wincc-custom-templates');
            templateLogger.log('localStorage data retrieved:', saved ? `${saved.length} characters` : 'null/empty');
            
            if (saved) {
                const customTemplates = JSON.parse(saved);
                templateLogger.log(`Found ${customTemplates.length} custom templates in localStorage`);
                
                let loadedCount = 0;
                for (const template of customTemplates) {
                    if (template && template.id && template.title && template.code) {
                        // Ensure it's marked as custom
                        template.isCustom = true;
                        this.addTemplate(template);
                        loadedCount++;
                        templateLogger.log(`Added custom template: ${template.id} - ${template.title}`);
                    } else {
                        templateLogger.error('Invalid custom template found:', template);
                    }
                }
                templateLogger.log(`Successfully loaded ${loadedCount} custom templates from localStorage`);
                
                // Trigger UI update if available
                if (typeof window !== 'undefined' && window.triggerTemplateReload) {
                    templateLogger.log('Triggering UI reload after custom templates loaded...');
                    setTimeout(() => window.triggerTemplateReload(), 100);
                }
            } else {
                templateLogger.log('No custom templates found in localStorage');
            }
        } catch (error) {
            templateLogger.error('Error loading custom templates:', error);
            templateLogger.error('Error details:', error.message);
        }
    }

    // Save custom templates to localStorage
    saveCustomTemplates() {
        try {
            const customTemplates = Array.from(this.templates.values())
                .filter(template => template.isCustom);
            localStorage.setItem('wincc-custom-templates', JSON.stringify(customTemplates));
            return true;
        } catch (error) {
            templateLogger.error('Error saving custom templates:', error);
            return false;
        }
    }

    // Add a new template
    addTemplate(template) {
        if (!template.id || !template.title || !template.code) {
            throw new Error('Template must have id, title, and code');
        }

        this.templates.set(template.id, template);
        
        // Remove from old category if it exists
        for (const [categoryName, categoryTemplates] of this.categories.entries()) {
            const index = categoryTemplates.findIndex(t => t.id === template.id);
            if (index > -1) {
                categoryTemplates.splice(index, 1);
            }
        }
        
        // Add to new category
        const category = template.category || 'User';
        if (!this.categories.has(category)) {
            this.categories.set(category, []);
        }
        
        const categoryTemplates = this.categories.get(category);
        if (!categoryTemplates.find(t => t.id === template.id)) {
            categoryTemplates.push(template);
        }

        // Save if it's a custom template
        if (template.isCustom) {
            this.saveCustomTemplates();
        }
    }

    // Remove a template
    removeTemplate(templateId) {
        const template = this.templates.get(templateId);
        if (!template) return false;

        // Don't allow removing default templates
        if (!template.isCustom) {
            throw new Error('Cannot remove default templates');
        }

        this.templates.delete(templateId);
        
        // Remove from category
        const categoryTemplates = this.categories.get(template.category);
        if (categoryTemplates) {
            const index = categoryTemplates.findIndex(t => t.id === templateId);
            if (index > -1) {
                categoryTemplates.splice(index, 1);
            }
        }

        this.saveCustomTemplates();
        return true;
    }

    // Get template by ID
    getTemplate(templateId) {
        return this.templates.get(templateId);
    }

    // Get all templates in a category
    getTemplatesByCategory(category) {
        return this.categories.get(category) || [];
    }

    // Get all categories
    getCategories() {
        return Array.from(this.categories.keys());
    }

    // Get all templates
    getAllTemplates() {
        return Array.from(this.templates.values());
    }

    // Create a new custom template
    createCustomTemplate(title, description, category, code) {
        const id = 'custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const template = {
            id: id,
            title: title,
            category: category || 'User',
            description: description || 'User template',
            isCustom: true,
            code: code,
            createdAt: new Date().toISOString()
        };

        this.addTemplate(template);
        return template;
    }

    // Export templates to JSON
    exportTemplates() {
        return JSON.stringify(this.getAllTemplates(), null, 2);
    }

    // Import templates from JSON
    importTemplates(jsonData) {
        try {
            const templates = JSON.parse(jsonData);
            let imported = 0;
            
            for (const template of templates) {
                if (template.id && template.title && template.code) {
                    // Preserve original isCustom value, or mark as custom if not specified
                    if (template.isCustom === undefined || template.isCustom === null) {
                        template.isCustom = true;
                    }
                    // If template already has isCustom property, keep it as is
                    this.addTemplate(template);
                    imported++;
                }
            }
            
            return imported;
        } catch (error) {
            throw new Error('Invalid template data: ' + error.message);
        }
    }

    // Force reload custom templates (for debugging)
    forceReloadCustomTemplates() {
        templateLogger.log('Force reloading custom templates...');
        
        // Remove existing custom templates
        const existingCustom = Array.from(this.templates.values()).filter(t => t.isCustom);
        existingCustom.forEach(template => {
            this.templates.delete(template.id);
            // Also remove from categories
            const categoryTemplates = this.categories.get(template.category);
            if (categoryTemplates) {
                const index = categoryTemplates.findIndex(t => t.id === template.id);
                if (index > -1) {
                    categoryTemplates.splice(index, 1);
                }
            }
        });
        
        // Reload from localStorage
        this.loadCustomTemplates();
        
        // Trigger UI update
        if (typeof window !== 'undefined' && window.triggerTemplateReload) {
            window.triggerTemplateReload();
        }
        
        return this.getAllTemplates().filter(t => t.isCustom).length;
    }
}

// Create global template manager instance
const templateManager = new TemplateManager();

// Backward compatibility - expose templates in the old format
const WinCCTemplates = {};
templateManager.getAllTemplates().forEach(template => {
    WinCCTemplates[template.id] = template;
});

// Export the template manager
window.templateManager = templateManager;

// Add global debugging functions
window.reloadCustomTemplates = function() {
    console.log('Manually reloading custom templates...');
    const count = templateManager.forceReloadCustomTemplates();
    console.log(`Reloaded ${count} custom templates`);
    return count;
};

window.checkLocalStorage = function() {
    const saved = localStorage.getItem('wincc-custom-templates');
    if (saved) {
        const templates = JSON.parse(saved);
        console.log(`Found ${templates.length} templates in localStorage:`, templates);
        return templates;
    } else {
        console.log('No custom templates found in localStorage');
        return [];
    }
};
