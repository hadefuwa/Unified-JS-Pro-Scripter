// Console Logger for Electron apps
// Provides terminal logging capabilities for both renderer and main processes

// Detect environment (main process or renderer)
const isRenderer = (typeof window !== 'undefined' && window.process && window.process.type === 'renderer');
const isMainProcess = (typeof process !== 'undefined' && !isRenderer);

// Set up direct console logging to terminal (only in main process)
let terminalLog = null;
if (isMainProcess) {
    const nodeConsole = require('console');
    terminalLog = new nodeConsole.Console(process.stdout, process.stderr);
}

/**
 * Log to both terminal and browser console
 * @param {...any} args - Arguments to log
 */
function log(...args) {
    if (terminalLog) {
        terminalLog.log('[APP]', ...args);
    }
    console.log(...args);
}

/**
 * Log errors to both terminal and browser console
 * @param {...any} args - Arguments to log
 */
function logError(...args) {
    if (terminalLog) {
        terminalLog.error('[APP ERROR]', ...args);
    }
    console.error(...args);
}

/**
 * Log warnings to both terminal and browser console
 * @param {...any} args - Arguments to log
 */
function logWarning(...args) {
    if (terminalLog) {
        terminalLog.warn('[APP WARNING]', ...args);
    }
    console.warn(...args);
}

/**
 * Log debug information to both terminal and browser console
 * @param {...any} args - Arguments to log
 */
function logDebug(...args) {
    if (terminalLog) {
        terminalLog.debug('[APP DEBUG]', ...args);
    }
    console.debug(...args);
}

/**
 * Test function to demonstrate terminal logging
 * @param {string} message - Optional test message
 * @returns {boolean} - Always returns true
 */
function testTerminalLog(message) {
    log('TEST:', message || 'Terminal logging is working!');
    log('System info:', {
        platform: isMainProcess ? process.platform : 'renderer',
        nodeVersion: isMainProcess ? process.version : 'N/A',
        electronVersion: isMainProcess && process.versions ? process.versions.electron : 'N/A',
        arch: isMainProcess ? process.arch : 'N/A',
        time: new Date().toISOString()
    });
    return true;
}

// Export the functions if in a Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        log,
        logError,
        logWarning,
        logDebug,
        testTerminalLog
    };
}

// Also expose to window in renderer process
if (typeof window !== 'undefined') {
    window.consoleLogger = {
        log,
        logError,
        logWarning,
        logDebug,
        testTerminalLog
    };
} 