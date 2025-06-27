// Test script for terminal logging in Electron
const { 
    log, 
    logError, 
    logWarning, 
    logDebug, 
    testTerminalLog 
} = require('./console-logger.js');

// Basic console logging
console.log('Standard console.log message');
console.error('Standard console.error message');

// Test our custom logging functions
log('This is a test message from log()');
logError('This is a test error message from logError()');
logWarning('This is a test warning message from logWarning()');
logDebug('This is a test debug message from logDebug()');

// Run the test function
testTerminalLog('Custom test message');

// Test with different data types
log('String:', 'Hello World');
log('Number:', 123.456);
log('Boolean:', true);
log('Array:', [1, 2, 3, 'test']);
log('Object:', { name: 'Test Object', value: 42 });
log('Null:', null);
log('Undefined:', undefined);

// Test with multiple arguments
log('Multiple', 'arguments', 'in', 'one', 'call');

// Demonstrate error logging
try {
    // Cause an error
    const obj = null;
    obj.nonExistentMethod();
} catch (error) {
    logError('Caught an error:', error);
    logError('Error name:', error.name);
    logError('Error message:', error.message);
    logError('Stack trace:', error.stack);
}

console.log('Test script completed'); 