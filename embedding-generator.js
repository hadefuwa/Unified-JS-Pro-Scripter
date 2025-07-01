// embedding-generator.js - Generate embeddings for all WinCC templates
const fs = require('fs');
const path = require('path');

// Simple text embedding using word frequency and TF-IDF approach
// This avoids external dependencies and works perfectly for our 54 templates
class SimpleEmbedder {
    constructor() {
        this.vocabulary = new Set();
        this.idf = new Map();
        this.documents = [];
    }

    // Preprocess text for embedding
    preprocessText(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')  // Remove punctuation
            .replace(/\s+/g, ' ')      // Normalize whitespace
            .trim()
            .split(' ')
            .filter(word => word.length > 2); // Remove short words
    }

    // Build vocabulary and calculate IDF scores
    buildVocabulary(documents) {
        console.log('📚 Building vocabulary from templates...');
        
        // Collect all unique words
        documents.forEach((doc, index) => {
            const words = this.preprocessText(doc.searchText);
            const uniqueWords = new Set(words);
            
            this.documents.push({
                id: doc.id,
                words: words,
                uniqueWords: uniqueWords
            });

            uniqueWords.forEach(word => {
                this.vocabulary.add(word);
            });
        });

        console.log(`📊 Vocabulary size: ${this.vocabulary.size} unique words`);

        // Calculate IDF (Inverse Document Frequency)
        this.vocabulary.forEach(word => {
            const docCount = this.documents.filter(doc => 
                doc.uniqueWords.has(word)
            ).length;
            
            this.idf.set(word, Math.log(documents.length / docCount));
        });

        console.log('✅ Vocabulary and IDF scores calculated');
    }

    // Generate embedding vector for a document
    generateEmbedding(text) {
        const words = this.preprocessText(text);
        const embedding = new Array(300).fill(0); // 300-dimensional vector
        
        // Calculate TF (Term Frequency)
        const termFreq = new Map();
        words.forEach(word => {
            termFreq.set(word, (termFreq.get(word) || 0) + 1);
        });

        // Create TF-IDF vector
        let vectorIndex = 0;
        const vocabArray = Array.from(this.vocabulary);
        
        for (let i = 0; i < Math.min(300, vocabArray.length); i++) {
            const word = vocabArray[i];
            const tf = (termFreq.get(word) || 0) / words.length;
            const idf = this.idf.get(word) || 0;
            embedding[i] = tf * idf;
        }

        // Add some domain-specific features for WinCC
        const winccFeatures = this.extractWinCCFeatures(text);
        
        // Replace last 10 dimensions with WinCC-specific features
        for (let i = 0; i < winccFeatures.length && i < 10; i++) {
            embedding[290 + i] = winccFeatures[i];
        }

        return embedding;
    }

    // Extract WinCC-specific features
    extractWinCCFeatures(text) {
        const features = [];
        const lowerText = text.toLowerCase();

        // Feature 1: Tag operations
        features.push(
            (lowerText.match(/tags?\(/gi) || []).length / 10
        );

        // Feature 2: Error handling
        features.push(
            ((lowerText.match(/try|catch|error/gi) || []).length) / 5
        );

        // Feature 3: HMI Runtime functions
        features.push(
            (lowerText.match(/hmiruntime/gi) || []).length / 5
        );

        // Feature 4: Screen operations
        features.push(
            (lowerText.match(/screen|navigate|switch/gi) || []).length / 5
        );

        // Feature 5: Alarm operations
        features.push(
            (lowerText.match(/alarm|alert|warning/gi) || []).length / 5
        );

        // Feature 6: Data operations
        features.push(
            (lowerText.match(/data|log|record|save/gi) || []).length / 5
        );

        // Feature 7: Array operations
        features.push(
            (lowerText.match(/array|sort|filter|map/gi) || []).length / 5
        );

        // Feature 8: String operations
        features.push(
            (lowerText.match(/string|text|format|parse/gi) || []).length / 5
        );

        // Feature 9: Time operations
        features.push(
            (lowerText.match(/time|date|schedule|timer/gi) || []).length / 5
        );

        // Feature 10: Math operations
        features.push(
            (lowerText.match(/math|calculate|sum|average/gi) || []).length / 5
        );

        return features;
    }
}

async function generateEmbeddings() {
    console.log('🚀 Starting embedding generation for WinCC templates...');
    console.log('═'.repeat(60));

    try {
        // Load existing templates
        console.log('📁 Loading templates from templates.json...');
        const templatesPath = path.join(__dirname, 'templates.json');
        
        if (!fs.existsSync(templatesPath)) {
            throw new Error('templates.json not found! Make sure you\'re in the project directory.');
        }

        const templatesFile = JSON.parse(fs.readFileSync(templatesPath, 'utf-8'));
        const templatesData = templatesFile.templates || templatesFile; // Handle both structures
        console.log(`📊 Loaded ${templatesData.length} templates`);

        // Prepare documents for embedding
        const documents = templatesData.map(template => ({
            id: template.id,
            title: template.title,
            category: template.category,
            description: template.description,
            code: template.code,
            // Combine all text for embedding
            searchText: `${template.title} ${template.category} ${template.description} ${template.code}`
        }));

        // Initialize embedder and build vocabulary
        const embedder = new SimpleEmbedder();
        embedder.buildVocabulary(documents);

        // Generate embeddings for all templates
        console.log('🧠 Generating embeddings for each template...');
        const embeddings = [];
        const templatesForEmbedding = [];

        documents.forEach((doc, index) => {
            const embedding = embedder.generateEmbedding(doc.searchText);
            embeddings.push(embedding);
            
            // Store template data (without the full search text)
            templatesForEmbedding.push({
                id: doc.id,
                title: doc.title,
                category: doc.category,
                description: doc.description,
                code: doc.code
            });

            if ((index + 1) % 10 === 0) {
                console.log(`   Processed ${index + 1}/${documents.length} templates`);
            }
        });

        // Create the embeddings JSON structure
        const embeddingsData = {
            metadata: {
                version: "1.0",
                model: "simple-tfidf-wincc",
                dimensions: 300,
                total_templates: templatesForEmbedding.length,
                created: new Date().toISOString(),
                description: "Lightweight TF-IDF embeddings optimized for WinCC JavaScript templates"
            },
            templates: templatesForEmbedding,
            embeddings: embeddings
        };

        // Save embeddings to file
        const outputPath = path.join(__dirname, 'embeddings.json');
        fs.writeFileSync(outputPath, JSON.stringify(embeddingsData, null, 2));
        
        const fileSizeKB = Math.round(fs.statSync(outputPath).size / 1024);
        
        console.log('✅ Embeddings generated successfully!');
        console.log(`📁 Saved to: embeddings.json`);
        console.log(`📊 File size: ${fileSizeKB} KB`);
        console.log(`🧠 ${templatesForEmbedding.length} templates embedded`);
        console.log(`📐 Vector dimensions: 300`);
        
        // Generate some stats
        console.log('\n📈 Template categories:');
        const categories = {};
        templatesForEmbedding.forEach(template => {
            categories[template.category] = (categories[template.category] || 0) + 1;
        });
        
        Object.entries(categories)
            .sort(([,a], [,b]) => b - a)
            .forEach(([category, count]) => {
                console.log(`   ${category}: ${count} templates`);
            });

        console.log('\n🎉 Phase 2 Step 1 Complete!');
        console.log('📋 Next: Create ai-core.js with RAG implementation');
        
        return true;

    } catch (error) {
        console.error('❌ Error generating embeddings:', error.message);
        console.error('🔧 Make sure you\'re in the correct directory with templates.json');
        return false;
    }
}

// Run if called directly
if (require.main === module) {
    generateEmbeddings();
}

module.exports = { generateEmbeddings, SimpleEmbedder }; 