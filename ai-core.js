// ai-core.js - Complete AI system with RAG for WinCC JavaScript generation
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class WinCCAIScripter {
    constructor() {
        this.embeddings = null;
        this.isInitialized = false;
        
        // Configuration
        this.config = {
            lmStudio: {
                host: '169.254.80.169',  // Your LM Studio server IP
                port: 1234,
                // No model specified - will use whatever model is loaded in LM Studio
                maxTokens: 500,
                temperature: 0.1  // Low temperature for consistent code
            },
            rag: {
                maxRetrievedTemplates: 3,  // Number of similar templates to include
                similarityThreshold: 0.1,  // Minimum similarity score
                maxContextLength: 1500     // Maximum characters in context
            }
        };
    }

    // Initialize the system - load embeddings
    async initialize() {
        try {
            console.log('Initializing WinCC AI Scripter...');
            
            // Load embeddings
            const embeddingsPath = path.join(__dirname, 'embeddings.json');
            if (!fs.existsSync(embeddingsPath)) {
                throw new Error('embeddings.json not found! Run: node embedding-generator.js');
            }
            
            this.embeddings = JSON.parse(fs.readFileSync(embeddingsPath, 'utf-8'));
            console.log(`Loaded ${this.embeddings.templates.length} WinCC templates`);
            console.log(`Embedding dimensions: ${this.embeddings.metadata.dimensions}`);
            
            this.isInitialized = true;
            return true;
            
        } catch (error) {
            console.error('Failed to initialize AI Scripter:', error.message);
            return false;
        }
    }

    // Calculate cosine similarity between two vectors
    cosineSimilarity(vectorA, vectorB) {
        if (vectorA.length !== vectorB.length) {
            return 0;
        }
        
        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;
        
        for (let i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            magnitudeA += vectorA[i] * vectorA[i];
            magnitudeB += vectorB[i] * vectorB[i];
        }
        
        magnitudeA = Math.sqrt(magnitudeA);
        magnitudeB = Math.sqrt(magnitudeB);
        
        if (magnitudeA === 0 || magnitudeB === 0) {
            return 0;
        }
        
        return dotProduct / (magnitudeA * magnitudeB);
    }

    // Create a simple embedding for user query
    createQueryEmbedding(query) {
        const words = query
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .trim()
            .split(' ')
            .filter(word => word.length > 2);
        
        // Create simple bag-of-words embedding
        const embedding = new Array(300).fill(0);
        
        // Basic word matching with WinCC terms
        const winccTerms = {
            'tag': [1, 10, 20],
            'tags': [1, 10, 20],
            'read': [2, 11, 21],
            'write': [3, 12, 22],
            'alarm': [4, 13, 23],
            'screen': [5, 14, 24],
            'navigate': [5, 14, 24],
            'array': [6, 15, 25],
            'sort': [6, 15, 25],
            'string': [7, 16, 26],
            'math': [8, 17, 27],
            'date': [9, 18, 28],
            'time': [9, 18, 28],
            'error': [10, 19, 29],
            'log': [11, 20, 30],
            'temperature': [12, 21, 31],
            'motor': [13, 22, 32],
            'pump': [14, 23, 33],
            'valve': [15, 24, 34]
        };
        
        words.forEach(word => {
            if (winccTerms[word]) {
                winccTerms[word].forEach(index => {
                    if (index < 300) {
                        embedding[index] += 1;
                    }
                });
            }
        });
        
        // Add some randomness based on query length and content
        for (let i = 0; i < Math.min(words.length, 50); i++) {
            embedding[i] += 0.1;
        }
        
        return embedding;
    }

    // Find similar templates using RAG
    findSimilarTemplates(query) {
        if (!this.isInitialized) {
            throw new Error('AI Scripter not initialized. Call initialize() first.');
        }
        
        console.log(`Searching for templates similar to: "${query}"`);
        
        // Create embedding for user query
        const queryEmbedding = this.createQueryEmbedding(query);
        
        // Calculate similarity with all templates
        const similarities = this.embeddings.embeddings.map((templateEmbedding, index) => ({
            template: this.embeddings.templates[index],
            similarity: this.cosineSimilarity(queryEmbedding, templateEmbedding),
            index: index
        }));
        
        // Sort by similarity and get top matches
        const topMatches = similarities
            .filter(match => match.similarity >= this.config.rag.similarityThreshold)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, this.config.rag.maxRetrievedTemplates);
        
        console.log('Found similar templates:');
        topMatches.forEach((match, i) => {
            console.log(`   ${i + 1}. ${match.template.title} (${match.template.category}) - ${(match.similarity * 100).toFixed(1)}%`);
        });
        
        return topMatches;
    }

    // Build context from similar templates
    buildContext(similarTemplates) {
        let context = "Here are relevant WinCC JavaScript examples:\n\n";
        
        similarTemplates.forEach((match, index) => {
            const template = match.template;
            context += `Example ${index + 1}: ${template.title} (${template.category})\n`;
            context += `Description: ${template.description}\n`;
            context += `Code:\n${template.code}\n\n`;
        });
        
        // Trim context if too long
        if (context.length > this.config.rag.maxContextLength) {
            context = context.substring(0, this.config.rag.maxContextLength) + "...\n\n";
        }
        
        return context;
    }

    // Generate WinCC JavaScript using LM Studio
    async generateCode(userPrompt) {
        try {
            if (!this.isInitialized) {
                throw new Error('AI Scripter not initialized. Call initialize() first.');
            }
            
            console.log('Generating WinCC JavaScript code...');
            
            // Find similar templates using RAG
            const similarTemplates = this.findSimilarTemplates(userPrompt);
            
            if (similarTemplates.length === 0) {
                console.log('No similar templates found. Generating from base knowledge...');
            }
            
            // Build context from similar templates
            const context = this.buildContext(similarTemplates);
            
            // Create system prompt with strict WinCC guidelines
            const systemPrompt = `You are a Siemens WinCC Unified JavaScript expert. You must respond with ONLY JavaScript code. Do not include any explanations, thinking, reasoning, or commentary. Do not use <think> tags. Start your response immediately with the JavaScript code.

CRITICAL REQUIREMENTS:
1. Use Tags(tagName).Read() or Tags(tagName).Write(value) for tag operations
2. Use HMIRuntime.Trace() for all logging (NEVER console.log, console.warn, etc.)
3. Always include try-catch blocks for error handling
4. NO web APIs (no console, document, window, alert, etc.)
5. NO TIA Portal references (no tia.tags)
6. Use proper WinCC syntax exactly as shown in examples

${context}

Generate ONLY the JavaScript function code. No explanations, no markdown, just the code.`;

            // Create the full prompt
            const messages = [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ];
            
                         // Call LM Studio API
            const response = await axios.post(
                `http://${this.config.lmStudio.host}:${this.config.lmStudio.port}/v1/chat/completions`,
                {
                    // No model specified - LM Studio will use the currently loaded model
                    messages: messages,
                    max_tokens: this.config.lmStudio.maxTokens,
                    temperature: this.config.lmStudio.temperature
                }
            );
            
            if (response.data && response.data.choices && response.data.choices[0]) {
                let generatedCode = response.data.choices[0].message.content;
                
                // Remove thinking tags and reasoning (DeepSeek R1 specific)
                generatedCode = generatedCode.replace(/<think>[\s\S]*?<\/think>/gi, '');
                generatedCode = generatedCode.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
                
                // If there's still a <think> tag without closing, try to extract code after it
                if (generatedCode.includes('<think>')) {
                    const thinkIndex = generatedCode.indexOf('<think>');
                    // Look for code patterns after the thinking
                    const afterThinking = generatedCode.substring(thinkIndex);
                    const codePattern = /function\s+\w+|try\s*\{|var\s+\w+|\/\*[\s\S]*?\*\//;
                    const match = afterThinking.match(codePattern);
                    if (match) {
                        generatedCode = afterThinking.substring(match.index);
                    } else {
                        generatedCode = generatedCode.substring(0, thinkIndex);
                    }
                }
                
                // Clean up markdown formatting (remove ```javascript and ``` wrappers)
                generatedCode = generatedCode.replace(/^```javascript\s*\n?/i, '');
                generatedCode = generatedCode.replace(/^```js\s*\n?/i, '');
                generatedCode = generatedCode.replace(/^```\s*\n?/, '');
                generatedCode = generatedCode.replace(/\n?```\s*$/g, '');
                generatedCode = generatedCode.trim();
                
                // Validate the generated code
                const validation = this.validateWinCCCode(generatedCode);
                
                console.log('Code generated successfully!');
                console.log('Code validation:');
                console.log(`   HMIRuntime.Trace used: ${validation.hasHMITrace ? 'Yes' : 'No'}`);
                console.log(`   Try-catch blocks: ${validation.hasTryCatch ? 'Yes' : 'No'}`);
                console.log(`   No web APIs: ${validation.noWebAPIs ? 'Yes' : 'No'}`);
                
                return {
                    success: true,
                    code: generatedCode,
                    validation: validation,
                    similarTemplates: similarTemplates,
                    context: context
                };
                
            } else {
                throw new Error('Invalid response from LM Studio');
            }
            
        } catch (error) {
            console.error('Error generating code:', error.message);
            
            if (error.code === 'ECONNREFUSED') {
                console.error('Make sure LM Studio server is running on ' + this.config.lmStudio.host + ':' + this.config.lmStudio.port);
            }
            
            return {
                success: false,
                error: error.message,
                code: null
            };
        }
    }

    // Validate generated code follows WinCC patterns
    validateWinCCCode(code) {
        return {
            hasHMITrace: code.includes('HMIRuntime.Trace'),
            hasTryCatch: code.includes('try') && code.includes('catch'),
            hasTagsFunction: code.includes('Tags('),
            noWebAPIs: !code.includes('console.log') && !code.includes('document.') && !code.includes('window.'),
            hasErrorHandling: code.includes('error') || code.includes('Error'),
            hasComments: code.includes('//') || code.includes('/*')
        };
    }

    // Get system status
    getStatus() {
        return {
            initialized: this.isInitialized,
            templatesLoaded: this.embeddings ? this.embeddings.templates.length : 0,
            lmStudioHost: this.config.lmStudio.host,
            lmStudioPort: this.config.lmStudio.port,
            model: this.config.lmStudio.model
        };
    }
}

// Test function for standalone usage
async function testAIScripter() {
    console.log('Testing WinCC AI Scripter...');
    console.log('='.repeat(50));
    
    const ai = new WinCCAIScripter();
    
    // Initialize
    const initialized = await ai.initialize();
    if (!initialized) {
        console.log('Failed to initialize AI Scripter');
        return;
    }
    
    // Test queries
    const testQueries = [
        "Write code to read a temperature tag and log its value",
        "Create a function to sort an array of equipment names",
        "Write code to navigate between screens with error handling"
    ];
    
    for (const query of testQueries) {
        console.log(`\nTesting query: "${query}"`);
        console.log('-'.repeat(50));
        
        const result = await ai.generateCode(query);
        
        if (result.success) {
            console.log('Generated code:');
            console.log('-'.repeat(30));
            console.log(result.code);
            console.log('-'.repeat(30));
        } else {
            console.log('Failed:', result.error);
        }
        
        // Wait a bit between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\nAI Scripter testing complete!');
}

// Export for use in other modules
module.exports = { WinCCAIScripter };

// Run test if called directly
if (require.main === module) {
    testAIScripter().catch(console.error);
} 