// This is the main process - it creates and controls application windows
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Import our console logger
const { log, logError, logWarning, logDebug } = require('./console-logger');

// Import AI core functionality
const { WinCCAIScripter } = require('./ai-core.js');

// Set up direct file logging for debugging
const logFile = path.join(__dirname, 'app-debug.log');
fs.writeFileSync(logFile, `--- App Debug Log Started ${new Date().toISOString()} ---\n`, 'utf8');

function logToFile(message) {
  try {
    fs.appendFileSync(logFile, message + '\n', 'utf8');
  } catch (err) {
    logError('Error writing to log file:', err);
  }
}

// Log startup information
log('Starting WinCC Unified JS Pro application');
log('App directory:', __dirname);
log('Node version:', process.version);
log('Electron version:', process.versions.electron);
log('Platform:', process.platform);

// Override console methods to also log to file
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.log = (...args) => {
  originalConsoleLog(...args);
  logToFile(`[LOG] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')}`);
};

console.error = (...args) => {
  originalConsoleError(...args);
  logToFile(`[ERROR] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')}`);
};

console.warn = (...args) => {
  originalConsoleWarn(...args);
  logToFile(`[WARN] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')}`);
};

// Fix GPU errors and prevent flashing
app.disableHardwareAcceleration(); // Disable hardware acceleration to prevent GPU errors

// Add command line switches to prevent GPU issues
app.commandLine.appendSwitch('--disable-gpu-vsync');
app.commandLine.appendSwitch('--disable-gpu-sandbox');
app.commandLine.appendSwitch('--disable-software-rasterizer');
app.commandLine.appendSwitch('--disable-background-timer-throttling');
app.commandLine.appendSwitch('--disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('--disable-renderer-backgrounding');

// Keep a reference to the window object
let mainWindow;

// AI Scripter instance for main process
let aiScripter = null;
let aiInitialized = false;

// This function creates the main application window
function createWindow() {
  log('Creating main application window');
  
  // Create a new browser window
  mainWindow = new BrowserWindow({
    width: 1200,           // Window width
    height: 800,           // Window height
    webPreferences: {
      nodeIntegration: false,    // Security: Don't allow Node.js in renderer
      contextIsolation: true,    // Security: Isolate contexts
      preload: path.join(__dirname, 'preload.js'),  // Load our preload script
      webSecurity: true,         // Keep security enabled
      backgroundThrottling: false, // Disable background throttling
      devTools: true             // Explicitly enable DevTools
    },
    // Remove the default menu bar completely
    autoHideMenuBar: true,     // Hide menu bar (can be shown with Alt key)
    
    // Anti-flash settings
    show: false,               // Don't show until ready
    backgroundColor: '#667eea', // Match your app's gradient start color
    titleBarStyle: 'default',  // Keep standard title bar
    
    // Additional settings to prevent flashing
    paintWhenInitiallyHidden: false,
    
    // App icon for the window
    icon: path.join(__dirname, 'assets', 'favicon2.png')
  });

  log('Loading HTML file');
  // Load our HTML file into the window
  mainWindow.loadFile('index.html');

  // Simplified loading - no fade effect to prevent GPU issues
  mainWindow.once('ready-to-show', function() {
    log('Window ready to show');
    // Wait a bit longer to ensure everything is loaded
    setTimeout(function() {
      mainWindow.show();
      log('Window shown');
    }, 200);
  });

  // Alternative: Use did-finish-load event for more reliable loading
  mainWindow.webContents.once('did-finish-load', function() {
    log('Content finished loading');
    if (!mainWindow.isVisible()) {
      mainWindow.show();
      log('Window shown (after content load)');
    }
  });

  // Developer tools available with Ctrl+Shift+I (but not opened automatically)
  // You can now press Ctrl+Shift+I to open DevTools for debugging
  log('DevTools available with Ctrl+Shift+I');

  // Add keyboard shortcut for DevTools
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.shift && input.key.toLowerCase() === 'i') {
      log('DevTools keyboard shortcut triggered');
      if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools();
        log('DevTools closed');
      } else {
        mainWindow.webContents.openDevTools();
        log('DevTools opened');
      }
    }
  });

  // Clean up when window is closed
  mainWindow.on('closed', function () {
    log('Window closed');
    mainWindow = null;
  });
}

// Remove the default menu completely for cleaner look
Menu.setApplicationMenu(null);

// Set up console message capture
function captureConsoleMessages() {
  // Listen for console messages from renderer process
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
      const levels = ['log', 'warning', 'error', 'info'];
      const levelName = levels[level] || 'log';
      const prefix = `[RENDERER ${levelName}]`;
      
      // Use appropriate log level
      switch (levelName) {
        case 'error':
          logError(`${prefix}: ${message}`);
          break;
        case 'warning':
          logWarning(`${prefix}: ${message}`);
          break;
        case 'info':
          logDebug(`${prefix}: ${message}`);
          break;
        default:
          log(`${prefix}: ${message}`);
      }
    });
    log('Console message capture enabled');
  }
}

// This runs when Electron is ready to create windows
app.whenReady().then(function() {
  log('Electron app ready');
  createWindow();
  
  // Wait a moment for the window to be created
  setTimeout(captureConsoleMessages, 1000);
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', function () {
  log('All windows closed');
  // On macOS, apps usually stay active until explicitly quit
  if (process.platform !== 'darwin') {
    log('Quitting application');
    app.quit();
  }
});

// Re-create window when app icon is clicked (macOS behavior)
app.on('activate', function () {
  log('App activated');
  if (mainWindow === null) {
    log('Recreating window on activate');
    createWindow();
  }
});

// IPC Handlers for file operations (safe to use fs in main process)
ipcMain.handle('load-templates', () => {
    try {
        const jsonPath = path.join(__dirname, 'templates.json');
        log(`Main process reading templates from: ${jsonPath}`);
        
        if (!fs.existsSync(jsonPath)) {
            logError('templates.json file not found in main process');
            return [];
        }
        
        const fileContent = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(fileContent);
        
        if (!data.templates || !Array.isArray(data.templates)) {
            logError('Invalid templates.json format in main process');
            return [];
        }
        
        log(`Main process successfully loaded ${data.templates.length} templates`);
        return data.templates;
    } catch (error) {
        logError('Main process error loading templates:', error);
        return [];
    }
});

ipcMain.handle('save-templates', (event, templates) => {
    try {
        const jsonPath = path.join(__dirname, 'templates.json');
        log(`Main process saving ${templates.length} templates to file`);
        
        const data = { templates: templates };
        const jsonContent = JSON.stringify(data, null, 2);
        
        fs.writeFileSync(jsonPath, jsonContent, 'utf8');
        log('Main process saved templates successfully');
        return true;
    } catch (error) {
        logError('Main process error saving templates:', error);
        return false;
    }
});

// ========================================
// AI IPC HANDLERS
// ========================================

// Initialize AI system
ipcMain.handle('ai-initialize', async () => {
    try {
        if (aiInitialized) {
            log('AI already initialized');
            return { success: true, message: 'AI already initialized' };
        }
        
        log('Initializing AI WinCC Scripter in main process...');
        aiScripter = new WinCCAIScripter();
        
        const initialized = await aiScripter.initialize();
        if (initialized) {
            aiInitialized = true;
            log('AI Scripter initialized successfully in main process');
            return { success: true, message: 'AI system initialized successfully' };
        } else {
            throw new Error('Failed to initialize AI system');
        }
    } catch (error) {
        logError('Failed to initialize AI in main process:', error);
        return { success: false, error: error.message };
    }
});

// Generate code using AI
ipcMain.handle('ai-generate-code', async (event, prompt) => {
    try {
        if (!aiInitialized || !aiScripter) {
            throw new Error('AI system not initialized. Call ai-initialize first.');
        }
        
        log(`Generating code for prompt: "${prompt}"`);
        const result = await aiScripter.generateCode(prompt);
        
        if (result.success) {
            log('AI code generation successful');
        } else {
            logError('AI code generation failed:', result.error);
        }
        
        return result;
    } catch (error) {
        logError('AI code generation error in main process:', error);
        return { success: false, error: error.message };
    }
});

// Get AI system status
ipcMain.handle('ai-get-status', async () => {
    try {
        if (!aiScripter) {
            return { initialized: false, message: 'AI system not created' };
        }
        
        const status = aiScripter.getStatus();
        status.mainProcessInitialized = aiInitialized;
        return status;
    } catch (error) {
        logError('Error getting AI status in main process:', error);
        return { initialized: false, error: error.message };
    }
}); 