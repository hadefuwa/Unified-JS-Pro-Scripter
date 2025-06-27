# Unified JS Pro - Technical Documentation

## Overview

**Unified JS Pro** is an Electron-based desktop application designed specifically for Siemens WinCC Unified JavaScript development. It provides a comprehensive template library, syntax highlighting, and custom template management system to streamline HMI programming workflows.

## Tech Stack

### Core Technologies
- **Electron.js** - Cross-platform desktop application framework
- **Node.js** - JavaScript runtime environment
- **HTML5/CSS3** - User interface markup and styling
- **Vanilla JavaScript** - Application logic (ES6+)

### External Libraries
- **Prism.js** - JavaScript syntax highlighting
  - Version: 1.29.0
  - Theme: `prism-tomorrow` (dark theme)
  - Components: Core + JavaScript language support

### Development Tools
- **npm** - Package management
- **Git** - Version control (recommended)

## Project Structure

```
new app/
├── main.js                 # Electron main process
├── index.html             # Application UI
├── renderer.js            # Renderer process logic
├── templates.js           # Template management system
├── preload.js            # Preload script for security
├── package.json          # Dependencies and scripts
├── package-lock.json     # Locked dependency versions
├── assets/               # Application assets
│   ├── favicon2.png      # Application icon
│   └── ...
└── README.md             # Basic project information
```

## Architecture

### Electron Architecture
The application follows standard Electron architecture patterns:

1. **Main Process** (`main.js`)
   - Creates application windows
   - Manages application lifecycle
   - Handles system-level operations
   - Implements security configurations

2. **Renderer Process** (`renderer.js`)
   - Handles UI interactions
   - Manages template operations
   - Implements search and filtering
   - Controls syntax highlighting

3. **Preload Script** (`preload.js`)
   - Provides secure communication bridge
   - Exposes limited APIs to renderer

### Core Components

#### 1. Template Management System (`templates.js`)

**TemplateManager Class**
```javascript
class TemplateManager {
    constructor()           // Initialize with default templates
    loadDefaultTemplates()  // Load 25+ Siemens templates
    loadCustomTemplates()   // Load user templates from localStorage
    saveCustomTemplates()   // Persist custom templates
    addTemplate(template)   // Add new template
    removeTemplate(id)      // Delete custom template
    getTemplate(id)         // Retrieve specific template
    // ... additional methods
}
```

**Template Object Structure**
```javascript
{
    id: 'unique-identifier',
    title: 'Template Name',
    category: 'Category Name',
    description: 'Detailed description',
    isCustom: boolean,
    code: 'JavaScript code content',
    createdAt: 'ISO timestamp' // For custom templates
}
```

#### 2. UI Management (`renderer.js`)

**Key Functions**
- `renderCategories()` - Dynamic template section rendering
- `renderTemplateSection()` - Section-specific rendering
- `loadTemplate()` - Template loading with syntax highlighting
- `setupScrollSync()` - Synchronized scrolling between elements
- Modal management for template CRUD operations

#### 3. Syntax Highlighting Integration

**Implementation**
- Dual-layer approach: transparent textarea over highlighted `<pre>` element
- Real-time highlighting using Prism.js
- Synchronized scrolling between layers
- Custom color scheme for WinCC JavaScript

## Key Features Implementation

### 1. Template Organization

**Two-Section Architecture**
- **User Created Templates** (Priority section - appears first)
- **Official Siemens Templates** (Reference section)

**Category System**
- Dynamic category generation
- Collapsible sections and categories
- Template counters at multiple levels

### 2. Search and Filtering

**Multi-field Search**
```javascript
const filteredTemplates = templates.filter(template => {
    if (!searchTerm) return true;
    return template.title.toLowerCase().includes(searchTerm) ||
           template.description.toLowerCase().includes(searchTerm) ||
           template.code.toLowerCase().includes(searchTerm);
});
```

### 3. Data Persistence

**localStorage Implementation**
- Custom templates stored as JSON
- Automatic save on template modifications
- Error handling for storage failures

### 4. Import/Export System

**JSON-based Template Exchange**
```javascript
// Export format
{
    "templates": [
        {
            "id": "template-id",
            "title": "Template Title",
            // ... full template object
        }
    ],
    "exportDate": "2024-12-27T00:00:00.000Z",
    "version": "1.0"
}
```

## Security Considerations

### Electron Security
- Context isolation enabled
- Node integration disabled in renderer
- Preload script for secure API exposure
- Hardware acceleration disabled (GPU compatibility)

### Content Security
- No external script execution
- Sanitized user input
- Protected default templates (cannot be modified/deleted)

## Performance Optimizations

### Rendering Performance
- Virtual scrolling considerations for large template sets
- Efficient DOM manipulation
- Minimal reflows during template switching

### Memory Management
- Template caching in memory
- Efficient event listener management
- Proper cleanup on application exit

## WinCC Unified JavaScript Integration

### Template Categories
1. **Tag Operations** - PLC communication
2. **Screen Navigation** - HMI screen management
3. **Alarm Management** - Alarm system integration
4. **Recipe Management** - Production recipe handling
5. **User Management** - Authentication and authorization
6. **Data Management** - Historical data and trends
7. **Communication** - OPC UA and external systems
8. **Event Handling** - Interactive HMI programming
9. **Graphics & Animation** - Visual element control
10. **Reports & Printing** - Document generation
11. **System Functions** - System monitoring and maintenance
12. **Production** - Batch processing workflows
13. **Utilities** - Common helper functions

### Code Standards
- Comprehensive error handling
- Diagnostic logging integration
- Siemens API compliance
- Production-ready patterns

## Development Setup

### Prerequisites
```bash
Node.js >= 14.0.0
npm >= 6.0.0
```

### Installation
```bash
npm install
```

### Development Commands
```bash
npm start          # Start application
npm run build      # Build for production (if configured)
npm test           # Run tests (if configured)
```

### Configuration Files

**package.json**
```json
{
    "name": "unified-js-pro",
    "version": "1.0.0",
    "main": "main.js",
    "scripts": {
        "start": "electron ."
    },
    "devDependencies": {
        "electron": "^latest"
    }
}
```

## Error Handling

### Application Level
- GPU fallback handling
- Storage failure recovery
- Template validation
- Import/export error management

### User Experience
- Non-blocking error notifications
- Graceful degradation
- Status feedback system

## Browser Compatibility
- Chromium-based (Electron runtime)
- Modern JavaScript features (ES6+)
- CSS Grid and Flexbox support

## Accessibility Considerations
- Keyboard navigation support
- High contrast color schemes
- Screen reader compatibility (basic)

## Testing Strategy

### Recommended Testing Approaches
1. **Unit Tests** - Template management functions
2. **Integration Tests** - UI component interactions
3. **End-to-End Tests** - Complete user workflows
4. **Performance Tests** - Large template set handling

### Test Framework Recommendations
- **Jest** - Unit testing
- **Playwright** - E2E testing
- **Electron Testing** - Application-specific testing

## Deployment

### Build Process
1. Template validation
2. Asset optimization
3. Electron packaging
4. Code signing (recommended)

### Distribution
- Standalone executable
- No external dependencies required
- Cross-platform compatibility (Windows, macOS, Linux)

## Troubleshooting

### Common Issues
1. **GPU Errors** - Already handled with fallback
2. **Storage Permissions** - localStorage access issues
3. **Network Dependencies** - CDN fallback considerations
4. **Template Corruption** - Validation and recovery

### Debug Mode
Enable Electron DevTools for debugging:
```javascript
// In main.js
webContents.openDevTools();
```

## Contributing Guidelines

### Code Style
- ES6+ JavaScript
- Consistent indentation (4 spaces)
- Descriptive variable names
- Comprehensive comments

### Template Contribution
- Follow WinCC Unified standards
- Include error handling
- Provide clear descriptions
- Test with actual WinCC environment

## License and Legal
- Check Siemens licensing for WinCC integration
- Electron.js MIT license compliance
- Third-party library attribution

---

**Last Updated:** December 27, 2024  
**Version:** 1.0.0  
**Maintainer:** Development Team 