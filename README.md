# 🚀 **Unified JS Pro Scripter**

> **AI-Powered WinCC Unified JavaScript Code Generator**

Transform your WinCC Unified development with AI-powered code generation that stays strictly within Siemens patterns and best practices.

[![Version](https://img.shields.io/badge/version-2.0.0--dev-blue.svg)](https://github.com/hadefuwa/Unified-JS-Pro-Scripter)
[![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)](https://github.com/hadefuwa/Unified-JS-Pro-Scripter)
[![License](https://img.shields.io/badge/license-Unlicense-green.svg)](./LICENSE)

---

## 🎯 **What is This?**

**Unified JS Pro Scripter** is an AI-powered desktop application that generates WinCC Unified JavaScript code based on your natural language requests. It uses **local AI models** via LM Studio to ensure your code stays private and follows Siemens best practices.

### **Key Features**
- 🤖 **AI Code Generation** - Natural language to WinCC JavaScript
- 🔒 **Fully Local** - No internet required, your code stays private
- 📚 **Siemens-Compliant** - Only generates code following WinCC patterns
- ⚡ **Lightweight RAG** - Instant responses using JSON embeddings
- 🎨 **Professional UI** - Built with Electron.js for desktop experience

---

## 🔄 **Evolution: From Template Browser to AI Scripter**

### **Version 1.0** - Template Browser
- ✅ 54 pre-built WinCC JavaScript templates
- ✅ Search, filter, and browse functionality
- ✅ Template management (add, edit, delete)
- ✅ Professional Electron.js application

### **Version 2.0** - AI Scripter (Current Development)
- 🚀 **AI-powered code generation** using local LLMs
- 🚀 **Natural language prompts** → WinCC JavaScript
- 🚀 **RAG implementation** with existing templates as knowledge base
- 🚀 **Maintains all existing features** while adding AI capabilities

---

## 🛠️ **How It Works**

### **1. AI Architecture**
```
User Prompt → Embedding → Similarity Search → Context + Prompt → LM Studio → WinCC Code
```

### **2. Example Workflow**
```
Input:  "Write code to read a temperature tag and log it"
AI:     Finds relevant templates from 54 examples
Output: Professional WinCC JavaScript with error handling
```

### **3. Strict Boundaries**
- ✅ **Only WinCC functions** - No web JavaScript
- ✅ **Siemens patterns** - Based on official examples
- ✅ **Error handling** - Always includes try-catch blocks
- ✅ **Logging** - Uses HMIRuntime.Trace() consistently

---

## 🚀 **Quick Start**

### **Prerequisites**
1. **Windows 10/11** (Electron.js desktop app)
2. **LM Studio** installed and running
3. **Local LLM model** (Recommended: DeepSeek Coder 6.7B)

### **Installation**
```bash
# Clone the repository
git clone https://github.com/hadefuwa/Unified-JS-Pro-Scripter.git
cd Unified-JS-Pro-Scripter

# Install dependencies (minimal - only 2 packages!)
npm install

# Run the application
npm start
```

### **Setup LM Studio**
1. Download and install [LM Studio](https://lmstudio.ai/)
2. Load a code-generation model (DeepSeek Coder recommended)
3. Start the local server at `http://localhost:1234`
4. Open Unified JS Pro Scripter and start generating code!

---

## 📊 **Technical Implementation**

### **Simplified RAG Architecture**
```javascript
// embeddings.json - All knowledge in one lightweight file
{
  "templates": [
    {
      "id": "tag-read-basic",
      "title": "Read Tag Value",
      "code": "// WinCC JavaScript code...",
      "description": "Safely reads values from WinCC tags"
    }
  ],
  "embeddings": [
    [0.1, 0.2, 0.3, ...], // Pre-computed vector
    // ... 54 total embeddings
  ]
}
```

### **Why This Approach?**
- ✅ **No Vector Database** - Simple JSON file (~50KB)
- ✅ **In-Memory Search** - Lightning fast similarity calculation
- ✅ **Zero Dependencies** - Just Axios for API calls
- ✅ **Easy to Debug** - Inspect embeddings directly
- ✅ **Beginner-Friendly** - One file contains all AI logic

---

## 🎯 **Development Status**

### **Current Phase: Foundation & Planning**
- ✅ Project architecture designed
- ✅ Repository setup complete
- ✅ Development plan finalized
- 🔄 **Next**: LM Studio integration testing

### **Roadmap**
| Phase | Description | Timeline |
|-------|-------------|----------|
| **Phase 1** | LM Studio Connection & Testing | Day 1-2 |
| **Phase 2** | Simple RAG Implementation | Day 3-5 |
| **Phase 3** | Electron UI Integration | Day 6-7 |
| **Phase 4** | Polish & Testing | Day 8-10 |
| **Phase 5** | Release Preparation | Day 11-14 |

**🎯 Target Release: 2 weeks from start**

---

## 🔧 **For Developers**

### **Project Structure**
```
Unified-JS-Pro-Scripter/
├── ai-core.js                 # All AI logic (one file!)
├── embeddings.json            # Pre-computed embeddings
├── embedding-generator.js     # Generate embeddings script
├── templates/                 # Original template system
├── main.js                    # Electron main process
├── renderer.js                # UI logic + AI integration
└── index.html                 # Application interface
```

### **Key Technologies**
- **Electron.js** - Desktop application framework
- **LM Studio** - Local LLM serving
- **JSON Embeddings** - Lightweight vector storage
- **Vanilla JavaScript** - Beginner-friendly, no frameworks

---

## 📚 **Why WinCC Developers Need This**

### **Current Pain Points**
- ❌ **Repetitive coding** - Same patterns over and over
- ❌ **Documentation hunting** - Searching for syntax examples
- ❌ **Boilerplate overhead** - Error handling, logging setup
- ❌ **Learning curve** - WinCC-specific JavaScript patterns

### **How This Helps**
- ✅ **Instant code generation** - Natural language to code
- ✅ **Consistent patterns** - Always follows Siemens best practices
- ✅ **Built-in error handling** - Professional code every time
- ✅ **Local and private** - Your code never leaves your machine

---

## 🤝 **Contributing**

This project is open-source and welcomes contributions! Whether you're a WinCC expert or AI enthusiast:

1. **Fork the repository**
2. **Create a feature branch**
3. **Add your improvements**
4. **Submit a pull request**

### **Areas for Contribution**
- 🔍 **More WinCC templates** - Expand the knowledge base
- 🎨 **UI improvements** - Better user experience
- 🧠 **Prompt engineering** - Better AI responses
- 📚 **Documentation** - Setup guides and tutorials

---

## 📞 **Support & Community**

- **Issues**: [GitHub Issues](https://github.com/hadefuwa/Unified-JS-Pro-Scripter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hadefuwa/Unified-JS-Pro-Scripter/discussions)
- **Original Project**: [Unified JS Pro](https://github.com/hadefuwa/Unified-JS-Pro)

---

## 📄 **License**

This project is released under the **Unlicense** - meaning it's in the public domain. Use it, modify it, distribute it freely!

---

## 🙏 **Acknowledgments**

- **Siemens** - For WinCC Unified platform
- **LM Studio** - For local LLM serving
- **Original Templates** - Based on official Siemens documentation
- **Open Source Community** - For the tools that make this possible

---

<div align="center">

**⭐ Star this repository if you find it useful!**

Made with ❤️ for the industrial automation community

</div> 