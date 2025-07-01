// This file runs before the web page loads
// It's a secure bridge between the main process and the renderer process

// Import the contextBridge from Electron
const { contextBridge, ipcRenderer } = require('electron');

// Simple console logger for preload context
function log(...args) {
    console.log(...args);
    try {
        if (process.stdout) {
            process.stdout.write('[PRELOAD] ' + args.join(' ') + '\n');
        }
    } catch (e) {
        console.error('Error redirecting log:', e);
    }
}

function logError(...args) {
    console.error(...args);
    try {
        if (process.stderr) {
            process.stderr.write('[PRELOAD ERROR] ' + args.join(' ') + '\n');
        }
    } catch (e) {
        console.error('Error redirecting error:', e);
    }
}

// This is where we can safely expose functions to the renderer process
log('Preload script loaded!');

// Expose our logger functions to the renderer process
contextBridge.exposeInMainWorld('consoleLogger', {
    log: (...args) => console.log(...args),
    error: (...args) => console.error(...args),
    warning: (...args) => console.warn(...args),
    debug: (...args) => console.debug(...args),
    test: (message) => {
        console.log('Test from renderer:', message || 'No message provided');
        return true;
    }
});

// Expose functions to access templates.json safely via IPC
contextBridge.exposeInMainWorld('electronAPI', {
    // Load templates from file (via main process)
    loadTemplatesFile: async () => {
        try {
            log('Requesting templates from main process...');
            const templates = await ipcRenderer.invoke('load-templates');
            log(`Received ${templates.length} templates from main process`);
            return templates;
        } catch (error) {
            logError('Error loading templates via IPC:', error);
            return [];
        }
    },
    
    // Save templates to file (via main process)
    saveTemplatesFile: async (templates) => {
        try {
            log(`Sending ${templates.length} templates to main process for saving`);
            const result = await ipcRenderer.invoke('save-templates', templates);
            log('Templates save result:', result);
            return result;
        } catch (error) {
            logError('Error saving templates via IPC:', error);
            return false;
        }
    },
    
    // AI Code Generation functions
    ai: {
        // Initialize AI system
        initialize: async () => {
            try {
                log('Initializing AI system via main process...');
                const result = await ipcRenderer.invoke('ai-initialize');
                log('AI initialization result:', result);
                return result;
            } catch (error) {
                logError('Error initializing AI via IPC:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Generate code using AI
        generateCode: async (prompt) => {
            try {
                log('Requesting code generation from AI...');
                const result = await ipcRenderer.invoke('ai-generate-code', prompt);
                log('AI code generation completed');
                return result;
            } catch (error) {
                logError('Error generating code via IPC:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Get AI system status
        getStatus: async () => {
            try {
                const status = await ipcRenderer.invoke('ai-get-status');
                return status;
            } catch (error) {
                logError('Error getting AI status via IPC:', error);
                return { initialized: false, error: error.message };
            }
        }
    }
});

// For now, just make sure the preload script works
window.addEventListener('DOMContentLoaded', function() {
    log('DOM loaded in renderer process');
}); 