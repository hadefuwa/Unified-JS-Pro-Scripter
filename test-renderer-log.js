// Test script for renderer process console logging
// Include this script in your HTML to test the console logger

(function() {
    // Check if consoleLogger is available
    if (window.consoleLogger) {
        console.log('Standard console.log message (before using consoleLogger)');
        
        // Get the console logger
        const consoleLogger = window.consoleLogger;
        
        // Test basic logging
        consoleLogger.log('🧪 TEST: consoleLogger.log is working!');
        consoleLogger.error('🧪 TEST: consoleLogger.error is working!');
        consoleLogger.warning('🧪 TEST: consoleLogger.warning is working!');
        consoleLogger.debug('🧪 TEST: consoleLogger.debug is working!');
        
        // Test with different data types
        consoleLogger.log('String:', 'Hello World');
        consoleLogger.log('Number:', 123.456);
        consoleLogger.log('Boolean:', true);
        consoleLogger.log('Array:', [1, 2, 3, 'test']);
        consoleLogger.log('Object:', { name: 'Test Object', value: 42 });
        
        // Test error handling
        try {
            // Cause an error
            const obj = null;
            obj.nonExistentMethod();
        } catch (error) {
            consoleLogger.error('Caught an error:', error);
            consoleLogger.error('Error name:', error.name);
            consoleLogger.error('Error message:', error.message);
        }
        
        // Test the test function if available
        if (typeof consoleLogger.test === 'function') {
            consoleLogger.test('Custom test message from renderer');
        }
        
        consoleLogger.log('✅ Console logger test completed in renderer process');
    } else {
        console.error('❌ consoleLogger is not available in window object!');
        console.log('Make sure the preload script is properly configured.');
    }
})(); 