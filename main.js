// This is the main process - it creates and controls application windows
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

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

// This function creates the main application window
function createWindow() {
  // Create a new browser window
  mainWindow = new BrowserWindow({
    width: 1200,           // Window width
    height: 800,           // Window height
    webPreferences: {
      nodeIntegration: false,    // Security: Don't allow Node.js in renderer
      contextIsolation: true,    // Security: Isolate contexts
      preload: path.join(__dirname, 'preload.js'),  // Load our preload script
      webSecurity: true,         // Keep security enabled
      backgroundThrottling: false // Disable background throttling
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

  // Load our HTML file into the window
  mainWindow.loadFile('index.html');

  // Simplified loading - no fade effect to prevent GPU issues
  mainWindow.once('ready-to-show', function() {
    // Wait a bit longer to ensure everything is loaded
    setTimeout(function() {
      mainWindow.show();
    }, 200);
  });

  // Alternative: Use did-finish-load event for more reliable loading
  mainWindow.webContents.once('did-finish-load', function() {
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
  });

  // Developer tools are disabled for production
  // Uncomment the line below if you need to debug:
  // mainWindow.webContents.openDevTools();

  // Clean up when window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Remove the default menu completely for cleaner look
Menu.setApplicationMenu(null);

// This runs when Electron is ready to create windows
app.whenReady().then(function() {
  createWindow();
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', function () {
  // On macOS, apps usually stay active until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create window when app icon is clicked (macOS behavior)
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
}); 