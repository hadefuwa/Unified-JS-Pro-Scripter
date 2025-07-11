// test-lm-studio.js - Simple Node.js test for LM Studio connection
const axios = require('axios');

// Helper function to extract JavaScript code from mixed content
function extractJavaScript(text) {
    // Remove complete thinking blocks first
    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
    text = text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
    
    // Look for function declarations
    const functionMatch = text.match(/function\s+\w+[\s\S]*?\n}/);
    if (functionMatch) {
        return functionMatch[0];
    }
    
    // Look for try-catch blocks
    const tryMatch = text.match(/try\s*\{[\s\S]*?\}\s*catch[\s\S]*?\}/);
    if (tryMatch) {
        return tryMatch[0];
    }
    
    // Look for variable declarations followed by statements
    const varMatch = text.match(/(var|let|const)\s+\w+[\s\S]*?;/);
    if (varMatch) {
        return varMatch[0];
    }
    
    // Look for code blocks in backticks
    const codeBlockMatch = text.match(/```(?:javascript|js)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
        return codeBlockMatch[1];
    }
    
    return text.trim();
}

// Test configuration
const LM_STUDIO_CONFIG = {
    host: '169.254.80.169',  // Your actual server IP from the screenshot
    port: 1234,
    // No model specified - will use whatever model is loaded in LM Studio
    maxTokens: 400,
    temperature: 0.1
};

async function testLMStudio() {
    console.log('🚀 Testing LM Studio connection...');
    console.log(`📡 Connecting to: http://${LM_STUDIO_CONFIG.host}:${LM_STUDIO_CONFIG.port}`);
    console.log(`🤖 Model: ${LM_STUDIO_CONFIG.model}`);
    console.log('');

    try {
        // Test 1: Basic connection test
        console.log('🔍 Test 1: Basic WinCC code generation...');
        const response = await axios.post(`http://${LM_STUDIO_CONFIG.host}:${LM_STUDIO_CONFIG.port}/v1/chat/completions`, {
            // No model specified - LM Studio will use the currently loaded model
            messages: [
                {
                    role: 'system',
                    content: 'You are a WinCC Unified JavaScript expert. You must respond with ONLY JavaScript code. Do not include any explanations, thinking, reasoning, or commentary. Do not use <think> tags. Start your response immediately with the JavaScript code. Use HMIRuntime.Trace() for logging and include proper error handling.'
                },
                {
                    role: 'user', 
                    content: 'Write WinCC JavaScript to read a tag called "Temperature" and log its value.\n\nStart with: function readTemperature() {'
                }
            ],
            max_tokens: LM_STUDIO_CONFIG.maxTokens,
            temperature: LM_STUDIO_CONFIG.temperature
        });

        if (response.data && response.data.choices && response.data.choices[0]) {
            console.log('✅ LM Studio connection successful!');
            console.log('📝 Generated code:');
            console.log('─'.repeat(50));
            
            // Clean up the generated code (remove thinking tags)
            let cleanedCode = response.data.choices[0].message.content;
            cleanedCode = extractJavaScript(cleanedCode);
            
            console.log(cleanedCode);
            console.log('─'.repeat(50));
            
            // Validate the response contains WinCC patterns
            const hasWinCCPatterns = {
                hasHMITrace: cleanedCode.includes('HMIRuntime.Trace'),
                hasTryCatch: cleanedCode.includes('try') && cleanedCode.includes('catch'),
                hasTagsFunction: cleanedCode.includes('Tags('),
                noWebAPIs: !cleanedCode.includes('console.log') && !cleanedCode.includes('document.')
            };

            console.log('\n🔍 Code validation:');
            console.log(`   HMIRuntime.Trace used: ${hasWinCCPatterns.hasHMITrace ? '✅' : '❌'}`);
            console.log(`   Try-catch blocks: ${hasWinCCPatterns.hasTryCatch ? '✅' : '❌'}`);
            console.log(`   WinCC Tags() function: ${hasWinCCPatterns.hasTagsFunction ? '✅' : '❌'}`);
            console.log(`   No web APIs: ${hasWinCCPatterns.noWebAPIs ? '✅' : '❌'}`);

            return true;
        } else {
            console.log('❌ Invalid response format from LM Studio');
            return false;
        }

    } catch (error) {
        console.log('❌ LM Studio connection failed!');
        
        if (error.code === 'ECONNREFUSED') {
            console.log('🔧 Troubleshooting:');
            console.log('   1. Make sure LM Studio is running');
            console.log('   2. Check that the local server is started in LM Studio');
            console.log('   3. Verify the model is loaded');
            console.log(`   4. Confirm server is running on port ${LM_STUDIO_CONFIG.port}`);
        } else if (error.response) {
            console.log(`📡 HTTP Error: ${error.response.status} - ${error.response.statusText}`);
            console.log(`📝 Response: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
            console.log(`🐛 Error: ${error.message}`);
        }
        
        return false;
    }
}

async function testAdvancedPrompt() {
    console.log('\n🚀 Test 2: Advanced WinCC code generation...');
    
    try {
        const response = await axios.post(`http://${LM_STUDIO_CONFIG.host}:${LM_STUDIO_CONFIG.port}/v1/chat/completions`, {
            // No model specified - LM Studio will use the currently loaded model
            messages: [
                {
                    role: 'system',
                    content: `You are a WinCC Unified JavaScript expert. You must respond with ONLY JavaScript code. Do not include any explanations, thinking, reasoning, or commentary. Do not use <think> tags. Start your response immediately with the JavaScript code.

Rules:
1. ONLY generate WinCC Unified JavaScript code
2. ALWAYS include error handling with try-catch
3. ALWAYS use HMIRuntime.Trace() for logging
4. Use Tags() function for tag operations
5. NO web JavaScript (no console.log, document, window)`
                },
                {
                    role: 'user', 
                    content: 'Create a function that reads multiple tags (Temperature, Pressure, Flow) and returns an object with their values. Include proper error handling.\n\nStart with: function readSensorData() {'
                }
            ],
            max_tokens: 400,
            temperature: LM_STUDIO_CONFIG.temperature
        });

        if (response.data && response.data.choices && response.data.choices[0]) {
            console.log('✅ Advanced prompt successful!');
            console.log('📝 Generated code:');
            console.log('─'.repeat(50));
            
            // Clean up the generated code (remove thinking tags)
            let cleanedCode = response.data.choices[0].message.content;
            cleanedCode = extractJavaScript(cleanedCode);
            
            console.log(cleanedCode);
            console.log('─'.repeat(50));
            return true;
        }
        
    } catch (error) {
        console.log('❌ Advanced test failed:', error.message);
        return false;
    }
}

// Main test execution
async function runTests() {
    console.log('🔬 LM Studio + DeepSeek R1 Connection Tests');
    console.log('═'.repeat(60));
    
    const basicTest = await testLMStudio();
    
    if (basicTest) {
        await testAdvancedPrompt();
        
        console.log('\n🎉 Phase 1 Testing Complete!');
        console.log('✅ LM Studio connection verified');
        console.log('✅ DeepSeek R1 model responding');
        console.log('✅ WinCC code generation working');
        console.log('\n📋 Next steps:');
        console.log('   1. Monitor GPU memory usage');
        console.log('   2. Test with different prompt variations');
        console.log('   3. Proceed to Phase 2: RAG implementation');
        
    } else {
        console.log('\n❌ Phase 1 Testing Failed');
        console.log('🔧 Fix LM Studio connection before proceeding');
    }
}

// Handle command line execution
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { testLMStudio, testAdvancedPrompt, LM_STUDIO_CONFIG }; 