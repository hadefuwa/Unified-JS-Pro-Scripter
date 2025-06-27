// This file runs before the web page loads
// It's a secure bridge between the main process and the renderer process

// Import the contextBridge from Electron
const { contextBridge, ipcRenderer } = require('electron');

// This is where we can safely expose functions to the renderer process
// For now, we'll just log that the preload script loaded
console.log('Preload script loaded!');

// Example: How to safely expose functions to the renderer
// (We're not using this yet, but it's here for future use)
/*
contextBridge.exposeInMainWorld('electronAPI', {
    // Example function that could send messages to main process
    sendMessage: (message) => {
        ipcRenderer.send('message-from-renderer', message);
    },
    
    // Example function that could receive messages from main process
    onMessage: (callback) => {
        ipcRenderer.on('message-to-renderer', callback);
    }
});
*/

// For now, just make sure the preload script works
window.addEventListener('DOMContentLoaded', function() {
    console.log('Preload: DOM loaded');
}); 