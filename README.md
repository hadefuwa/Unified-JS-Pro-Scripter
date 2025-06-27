# Unified JS Pro

**A Professional Siemens WinCC Unified JavaScript Template Manager**

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)
[![Electron](https://img.shields.io/badge/Electron-Latest-47848F.svg)](https://electronjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🚀 Overview

Unified JS Pro is a comprehensive desktop application built specifically for Siemens WinCC Unified JavaScript development. It provides a rich template library, advanced code management, and professional development tools to streamline HMI programming workflows.

![Unified JS Pro Screenshot](https://via.placeholder.com/800x500/1976d2/ffffff?text=Unified+JS+Pro+Screenshot)

## ✨ Features

### 🎯 **Core Functionality**
- **25+ Professional Templates** - Complete WinCC Unified JavaScript library
- **Smart Organization** - User templates prioritized, official Siemens templates organized
- **Syntax Highlighting** - Beautiful JavaScript code highlighting with Prism.js
- **Template Management** - Create, edit, delete, and organize custom templates
- **Search & Filter** - Powerful search across templates, descriptions, and code
- **Import/Export** - Share template collections via JSON files

### 💼 **Professional Features**
- **Two-Section Architecture** - User Created Templates + Official Siemens Templates
- **Category Organization** - Tag Operations, Screen Navigation, Alarm Management, etc.
- **Template Badges** - Clear visual distinction between custom and official templates
- **Copy & Paste Ready** - One-click code copying for TIA Portal
- **Persistent Storage** - Custom templates saved locally
- **Error Handling** - Comprehensive error handling and user feedback

### 🎨 **User Experience**
- **Modern UI** - Professional Siemens-style interface
- **Dark Theme** - Easy-on-eyes code display
- **Responsive Design** - Optimized for various screen sizes
- **Keyboard Shortcuts** - Efficient navigation and operations
- **Status Feedback** - Real-time operation status and feedback

## 🛠️ Tech Stack

- **Electron.js** - Cross-platform desktop application framework
- **Node.js** - JavaScript runtime environment
- **HTML5/CSS3** - Modern web technologies
- **Vanilla JavaScript** - ES6+ features
- **Prism.js** - Syntax highlighting
- **localStorage** - Client-side data persistence

## 📦 Installation

### Prerequisites
- Node.js >= 14.0.0
- npm >= 6.0.0

### Quick Start
```bash
# Clone the repository
git clone https://github.com/hadefuwa/Unified-JS-Pro.git

# Navigate to project directory
cd Unified-JS-Pro

# Install dependencies
npm install

# Start the application
npm start
```

## 🎯 Template Categories

### **Tag Operations**
- Read Tag Value
- Write Tag Value
- Subscribe to Tag Changes
- Bulk Tag Operations

### **Screen Navigation**
- Navigate to Screen
- Close Screen/Popup
- Show Modal Dialogs

### **Alarm Management**
- Acknowledge Alarms
- Filter Alarms by Priority/Category

### **Recipe Management**
- Load Recipe Data
- Save Recipe Parameters

### **Advanced Features**
- User Management & Authentication
- Trend & Archive Data Access
- Communication & OPC Integration
- Event Handling & Graphics
- Reports & Printing
- System Functions & Monitoring
- Batch Operations & Production

## 🚀 Usage

1. **Browse Templates** - Explore the comprehensive template library
2. **Search & Filter** - Find specific templates quickly
3. **View Code** - See syntax-highlighted JavaScript code
4. **Copy Code** - One-click copying to clipboard
5. **Create Custom** - Add your own project-specific templates
6. **Import/Export** - Share templates with team members

## 📁 Project Structure

```
Unified-JS-Pro/
├── main.js                    # Electron main process
├── index.html                 # Application UI
├── renderer.js                # UI logic and interactions
├── templates.js               # Template management system
├── preload.js                 # Security preload script
├── package.json               # Dependencies and scripts
├── assets/                    # Application assets
│   └── favicon2.png          # Application icon
├── TECHNICAL_DOCUMENTATION.md # Developer documentation
├── FUTURE_ROADMAP.md         # Enhancement roadmap
└── README.md                 # This file
```

## 🔧 Development

### Development Mode
```bash
npm start
```

### Adding New Templates
Templates are managed through the `TemplateManager` class in `templates.js`. You can:
- Add templates through the UI
- Import template collections
- Modify the default template library

### Customization
- **Themes**: Modify CSS in `index.html`
- **Templates**: Add to the default collection in `templates.js`
- **Features**: Extend functionality in `renderer.js`

## 📚 Documentation

- **[Technical Documentation](TECHNICAL_DOCUMENTATION.md)** - Complete developer guide
- **[Future Roadmap](FUTURE_ROADMAP.md)** - Planned enhancements and features

## 🤝 Contributing

We welcome contributions! Please feel free to:
- Submit bug reports
- Suggest new features
- Add new WinCC templates
- Improve documentation
- Submit pull requests

## 🎯 Use Cases

- **HMI Development** - Streamline WinCC Unified JavaScript coding
- **Team Collaboration** - Share templates across development teams
- **Learning Resource** - Comprehensive examples for WinCC development
- **Code Standardization** - Consistent coding patterns and best practices
- **Productivity Tool** - Reduce development time with ready-to-use templates

## 🔒 Security

- Context isolation enabled
- Node integration disabled in renderer
- Secure preload script implementation
- Protected default templates
- Input validation and sanitization

## 📈 Performance

- Efficient template management
- Optimized rendering for large template sets
- Memory-conscious design
- Fast search and filtering
- Minimal startup time

## 🌟 Future Enhancements

See our [Future Roadmap](FUTURE_ROADMAP.md) for planned features including:
- Code validation and linting
- TIA Portal integration
- Team collaboration features
- AI-powered code assistance
- Enterprise features

## 📄 License

This project is released into the public domain under the [Unlicense](LICENSE).

## 👨‍💻 Author

**Hamed Adefuwa**
- GitHub: [@hadefuwa](https://github.com/hadefuwa)

## 🙏 Acknowledgments

- Siemens for WinCC Unified platform
- Electron.js community
- Prism.js for syntax highlighting
- Open source community

---

**Made with ❤️ for the WinCC Unified development community** 