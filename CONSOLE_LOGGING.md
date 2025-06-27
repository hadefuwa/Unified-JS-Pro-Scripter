# Console Logging for WinCC Unified JS Pro

This document explains how to use the console logging functionality in the WinCC Unified JS Pro application.

## Overview

The console logging system provides a unified way to log messages from both the main process and renderer process to the terminal. This makes debugging easier by showing all application logs in one place.

## Features

- Log messages from both main and renderer processes
- Different log levels: log, error, warning, debug
- Automatic detection of process type (main or renderer)
- Emoji support for better visual organization
- System information logging for diagnostics

## Implementation Architecture

The console logging system is implemented across three main areas:

1. **Main Process** (main.js) - Uses the console-logger.js module directly
2. **Preload Script** (preload.js) - Implements its own simple logging and exposes logging functions to the renderer
3. **Renderer Process** (renderer.js, templates.js) - Uses the exposed logging functions from preload.js

### Main Process Implementation

In the main process, we use the console-logger.js module to log messages to the terminal:

```javascript
// In main.js
const { log, logError, logWarning, logDebug } = require('./console-logger');

log('Application starting...');
```

### Preload Script Implementation

The preload script implements its own simple logging functions and exposes them to the renderer process:

```javascript
// In preload.js
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

// Expose to renderer
contextBridge.exposeInMainWorld('consoleLogger', {
    log: (...args) => console.log(...args),
    error: (...args) => console.error(...args),
    warning: (...args) => console.warn(...args),
    debug: (...args) => console.debug(...args)
});
```

### Renderer Process Implementation

In the renderer process, we use the exposed logging functions from the preload script:

```javascript
// In renderer.js
const consoleLogger = window.consoleLogger || {
    log: console.log,
    error: console.error,
    warning: console.warn,
    debug: console.debug
};

consoleLogger.log('Renderer process loaded');
```

## How to Use

### In the Main Process

In main.js or other Node.js modules running in the main process:

```javascript
const { log, logError, logWarning, logDebug } = require('./console-logger');

// Regular log messages
log('This is a regular log message');

// Error messages
logError('This is an error message');

// Warning messages
logWarning('This is a warning message');

// Debug messages
logDebug('This is a debug message');
```

### In the Preload Script

In preload.js:

```javascript
// Use the built-in log functions
log('Preload script loaded');
logError('An error occurred in preload');
```

### In the Renderer Process

In renderer.js or other scripts running in the browser context:

```javascript
// Get the console logger from window
const consoleLogger = window.consoleLogger || {
    log: console.log,
    error: console.error,
    warning: console.warn,
    debug: console.debug
};

// Regular log messages
consoleLogger.log('This is a regular log message from renderer');

// Error messages
consoleLogger.error('This is an error message from renderer');

// Warning messages
consoleLogger.warning('This is a warning message from renderer');

// Debug messages
consoleLogger.debug('This is a debug message from renderer');
```

## Best Practices

- Use the appropriate log level for different types of messages
- Add emojis at the beginning of messages for better visual organization
- Include context information in log messages
- Use structured data (objects) for complex information
- Avoid excessive logging in production builds

## Emoji Guide

Using emojis in log messages helps with visual organization:

- 🚀 - Application startup/initialization
- ✅ - Success/completion
- ❌ - Error/failure
- ⚠️ - Warning
- 🔄 - Process/operation
- 📂 - File operations
- 🏗️ - Construction/initialization
- 🔧 - Configuration/settings
- 🎬 - UI events
- 🏁 - Completion/finish

## Testing

You can test the console logging functionality using the test-console.js script:

```
node test-console.js
```

This will run a series of tests showing different log levels and data types.

## Troubleshooting

If you encounter issues with the console logging system:

1. Make sure the preload script is properly loaded
2. Check that the contextBridge is exposing the consoleLogger object
3. Verify that the renderer process is accessing the consoleLogger object correctly
4. Check for any errors in the DevTools console

## Future Improvements

- Add log levels (debug, info, warn, error)
- Add log filtering options
- Add log file output
- Add log rotation
- Add log compression 