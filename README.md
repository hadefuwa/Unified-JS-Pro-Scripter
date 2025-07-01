# 🚀 **Unified JS Pro Scripter**

> **AI-Powered WinCC Unified JavaScript Template Generator & Code Assistant**

Professional desktop application for WinCC Unified development with AI-powered code generation, 70+ pre-built templates, and modern dashboard interface.

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/hadefuwa/Unified-JS-Pro-Scripter)
[![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)](https://github.com/hadefuwa/Unified-JS-Pro-Scripter)
[![License](https://img.shields.io/badge/license-Unlicense-green.svg)](./LICENSE)

---

## 🎯 **What is This?**

**Unified JS Pro Scripter** is a professional desktop application that revolutionizes WinCC Unified JavaScript development. Featuring **70+ professional Siemens templates**, **AI-powered code generation**, and a **modern dashboard interface** with light/dark themes.

### **✨ Key Features**
- 🤖 **AI Code Generation** - Natural language to WinCC JavaScript via LM Studio
- 📚 **70+ Professional Templates** - Comprehensive Siemens WinCC code library
- 🎨 **Modern Dashboard UI** - Clean, professional interface with light/dark themes
- 🔧 **Full Admin Panel** - Template management, category organization, statistics
- 📱 **Responsive Design** - Works perfectly on desktop and mobile layouts
- 🔒 **Fully Local** - No internet required, your code stays private
- ⚡ **Instant Search** - Find templates quickly with smart filtering
- 💾 **Import/Export** - Template and configuration management
- 🎯 **Collapsible Sections** - Organized template browsing experience

---

## 🏗️ **Application Structure**

### **Main Dashboard**
- **Template Browser** - 70 Siemens templates organized by category
- **Custom Templates** - User-created templates with full CRUD operations
- **Search & Filter** - Smart template discovery
- **Light/Dark Theme** - Professional appearance options
- **Copy & Paste** - One-click code copying for TIA Portal

### **AI Generator Page**
- **Natural Language Input** - Describe what you want to create
- **Context-Aware Generation** - AI uses existing templates as knowledge base
- **Professional Output** - Generated code follows Siemens best practices
- **Save & Export** - Add AI-generated code as custom templates

### **Admin Panel**
- **Template Statistics** - Overview of all templates and usage
- **Category Management** - Add, edit, delete custom categories
- **Maintenance Tools** - Clear data, reset settings, import/export
- **Configuration** - App settings and preferences

---

## 🎨 **Modern Design & UX**

### **Professional Dashboard**
- **Clean Flat Design** - Modern, minimal aesthetic
- **6px Border Radius** - Subtle, professional curves
- **Dashboard Layout** - Organized sections and clean typography
- **Consistent Branding** - Hamed Adefuwa attribution and YouTube channel links

### **Enhanced User Experience**
- **Collapsible Sections** - Siemens templates and User templates separately organized
- **Visual Hierarchy** - Clear template categorization with colored borders
- **Responsive Footer** - Professional attribution on every page
- **About Modal** - Comprehensive app information and developer profile

### **Template Organization**
- **User Templates First** - Custom templates prioritized and always visible
- **Siemens Templates** - 70 professional templates, expandable by default
- **Category Badges** - Visual distinction between template types
- **Search Integration** - Find templates across all categories instantly

---

## 🚀 **Quick Start**

### **Prerequisites**
- **Windows 10/11** (Electron.js desktop app)
- **Node.js** (for development)
- **LM Studio** (optional, for AI features)

### **Installation**
```bash
# Clone the repository
git clone https://github.com/hadefuwa/Unified-JS-Pro-Scripter.git
cd Unified-JS-Pro-Scripter

# Install dependencies
npm install

# Run the application
npm start
```

### **For AI Features (Optional)**
1. Download and install [LM Studio](https://lmstudio.ai/)
2. Load a code-generation model (DeepSeek Coder recommended)
3. Start the local server at `http://localhost:1234`
4. Use the AI Generator page for natural language code generation

---

## 📊 **Template Library**

### **70+ Professional Siemens Templates**
Organized across 13 categories:

| Category | Templates | Description |
|----------|-----------|-------------|
| **Tag Operations** | 8 templates | Read/write tags, bulk operations, UDT access |
| **JavaScript Basics** | 6 templates | Arrays, strings, math, date handling |
| **Screen Navigation** | 4 templates | Navigate screens, manage popups |
| **Alarm Management** | 3 templates | Acknowledge alarms, subscription handling |
| **Best Practices** | 8 templates | Error handling, logging, retry logic |
| **Screen Object Manipulation** | 6 templates | Find objects, change colors, show/hide |
| **File System Operations** | 4 templates | Create directories, read/write files |
| **Timer Functions** | 2 templates | SetInterval, SetTimeout implementations |
| **Language Operations** | 1 template | Runtime language management |
| **Screen Management** | 2 templates | Screen information, advanced manipulation |
| **Data Storage** | 2 templates | DataSet management operations |
| **User Interface** | 1 template | Alert dialogs and notifications |
| **System Integration** | 3 templates | External programs, database access |

### **Custom Template Features**
- **Full CRUD Operations** - Add, edit, delete custom templates
- **Category Assignment** - Organize templates in custom categories
- **Import/Export** - Share templates between installations
- **Search Integration** - Custom templates included in search results

---

## 🛠️ **AI Integration**

### **Local AI with LM Studio**
```
User Prompt → Embedding → Similarity Search → Context + Prompt → LM Studio → WinCC Code
```

### **Features**
- **Template-Based Context** - AI learns from 70+ existing templates
- **Siemens Compliance** - Generated code follows WinCC patterns
- **Error Handling** - Always includes proper try-catch blocks
- **Professional Output** - Production-ready JavaScript code

### **Example Workflow**
```
Input:  "Write code to read multiple temperature tags and log their values"
AI:     Analyzes prompt, finds relevant templates, generates context
Output: Professional WinCC JavaScript with error handling and logging
```

---

## 🎯 **Current Status - Production Ready**

### **✅ Completed Features**
- ✅ **Complete UI Redesign** - Modern dashboard with light/dark themes
- ✅ **70+ Professional Templates** - Comprehensive Siemens library
- ✅ **AI Code Generation** - LM Studio integration with RAG implementation
- ✅ **Full Admin Panel** - Template management and statistics
- ✅ **Professional Branding** - Developer attribution and YouTube channel
- ✅ **Responsive Design** - Desktop and mobile layouts
- ✅ **Import/Export System** - Template and configuration management
- ✅ **Search & Filter** - Smart template discovery
- ✅ **Custom Templates** - Full CRUD operations
- ✅ **Recovery Tools** - Template debugging and recovery utilities

### **🚀 Version 2.1.0 Highlights**
- Modern flat design with professional dashboard aesthetics
- Enhanced admin panel with full functionality
- Collapsible template sections for better organization
- Professional footer with developer attribution on all pages
- Year updated to 2025 across all interfaces
- Comprehensive About modal with app information

---

## 🔧 **Technical Architecture**

### **Core Technologies**
- **Electron.js** - Cross-platform desktop application
- **Vanilla JavaScript** - No frameworks, beginner-friendly
- **Local Storage** - Template and configuration persistence
- **LM Studio API** - Local AI model integration
- **JSON Embeddings** - Lightweight vector storage for RAG

### **Project Structure**
```
Unified-JS-Pro-Scripter/
├── index.html                 # Main dashboard interface
├── ai-generator.html          # AI code generation page
├── admin.html                 # Admin panel interface
├── main.js                    # Electron main process
├── renderer.js                # Main UI logic
├── templates.js               # Template management system
├── ai-core.js                 # AI integration logic
├── embeddings.json            # Pre-computed embeddings (70+ templates)
├── templates.json             # Template library data
└── assets/                    # Icons and static resources
```

---

## 👨‍💻 **Developer Information**

### **Created By**
**Hamed Adefuwa** - HMI/SCADA Developer & YouTube Educator

- 📺 **YouTube Channel**: [Industrial Automation Tutorials](https://www.youtube.com/c/HamedAdefuwa)
- 💼 **Specialization**: Industrial Automation, HMI/SCADA Development
- 🎯 **Mission**: Making industrial automation accessible through education

### **Professional Features**
- Comprehensive About modal with developer profile
- YouTube channel integration for educational content
- Professional attribution across all application pages
- Copyright 2025 with proper licensing information

---

## 📚 **Why WinCC Developers Love This**

### **Solves Real Problems**
- ❌ **Repetitive Coding** → ✅ **Template Library** - 70+ ready-to-use patterns
- ❌ **Documentation Hunting** → ✅ **Instant Search** - Find code examples instantly
- ❌ **AI Hallucination** → ✅ **Siemens Compliance** - Code based on official patterns
- ❌ **Setup Complexity** → ✅ **One-Click Install** - Run with npm start

### **Professional Benefits**
- 🚀 **10x Faster Development** - Copy-paste proven patterns
- 🎯 **Best Practices Built-in** - Error handling, logging, validation
- 📱 **Modern Interface** - Professional dashboard experience
- 🔧 **Local & Private** - No cloud dependency, your code stays secure

---

## 🤝 **Contributing**

This project welcomes contributions from the WinCC and industrial automation community!

### **How to Contribute**
1. **Fork the repository**
2. **Create a feature branch**
3. **Add your improvements**
4. **Submit a pull request**

### **Contribution Areas**
- 🔍 **More Templates** - Add WinCC JavaScript patterns
- 🎨 **UI Enhancements** - Improve user experience
- 🧠 **AI Improvements** - Better prompt engineering
- 📚 **Documentation** - Setup guides and tutorials
- 🐛 **Bug Reports** - Help improve stability

---

## 📞 **Support & Community**

- **🐛 Issues**: [GitHub Issues](https://github.com/hadefuwa/Unified-JS-Pro-Scripter/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/hadefuwa/Unified-JS-Pro-Scripter/discussions)
- **📺 Tutorials**: [Hamed's YouTube Channel](https://www.youtube.com/c/HamedAdefuwa)
- **📧 Contact**: Available through GitHub issues

---

## 📄 **License**

This project is released under the **Unlicense** - meaning it's in the public domain. Use it, modify it, distribute it freely!

---

## 🙏 **Acknowledgments**

- **Siemens** - For the WinCC Unified platform and comprehensive documentation
- **LM Studio** - For enabling local AI model serving
- **Industrial Automation Community** - For feedback and contributions
- **Open Source Community** - For the tools and libraries that make this possible

---

<div align="center">

**⭐ Star this repository if you find it useful!**

**🚀 Made with ❤️ by Hamed Adefuwa for the Industrial Automation Community**

📺 [Subscribe to my YouTube channel](https://www.youtube.com/c/HamedAdefuwa) for more automation tutorials!

</div> 