// check-server.js - Quick LM Studio server diagnostic
const axios = require('axios');

async function checkServer() {
    console.log('🔍 LM Studio Server Diagnostic');
    console.log('═'.repeat(40));
    
    try {
        // Check if server is running
        console.log('📡 Checking server at http://localhost:1234...');
        const response = await axios.get('http://localhost:1234/v1/models', {
            timeout: 5000
        });
        
        console.log('✅ Server is running!');
        console.log(`📊 Response status: ${response.status}`);
        
        if (response.data && response.data.data) {
            console.log('🤖 Available models:');
            response.data.data.forEach((model, index) => {
                console.log(`   ${index + 1}. ${model.id}`);
            });
        }
        
        console.log('\n🎉 LM Studio server is ready!');
        console.log('▶️  Now run: node test-lm-studio.js');
        
    } catch (error) {
        console.log('❌ Server not accessible');
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n🚨 PROBLEM: LM Studio local server is not running');
            console.log('\n🔧 SOLUTION:');
            console.log('   1. Open LM Studio');
            console.log('   2. Look for "Local Server" or "Developer" tab');
            console.log('   3. Click "Start Server" button');
            console.log('   4. Verify it shows "Server running on http://localhost:1234"');
            console.log('\n📚 See: docs/LM-STUDIO-SETUP.md for detailed instructions');
            
        } else if (error.code === 'ETIMEDOUT') {
            console.log('\n🚨 PROBLEM: Server is slow to respond');
            console.log('\n🔧 SOLUTION:');
            console.log('   1. Check if model is still loading');
            console.log('   2. Wait for model to fully load');
            console.log('   3. Close other GPU-intensive applications');
            
        } else {
            console.log(`\n🐛 Error: ${error.message}`);
            console.log('📚 See: docs/LM-STUDIO-SETUP.md for troubleshooting');
        }
    }
}

if (require.main === module) {
    checkServer();
} 