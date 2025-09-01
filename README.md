# 🌊 SankeyStone

**A Chrome Extension for Creating Beautiful Sankey Diagrams**

SankeyStone is a lightweight Chrome extension that visualizes data flow using interactive Sankey diagrams. Whether you're analyzing website traffic, user journeys, or any flow-based data, SankeyStone makes it easy to create stunning visualizations directly in your browser.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![SVG](https://img.shields.io/badge/Graphics-SVG-FF9900?logo=svg&logoColor=white)

## ✨ Features

- 📊 **Interactive Sankey Diagrams**: Generate beautiful flow visualizations with hover effects
- 🤖 **AI-Powered Analysis**: Use Claude AI to automatically analyze web pages and generate meaningful Sankey diagrams
- 🎨 **15 Color Themes**: Choose from a variety of beautiful color schemes including Ocean Depths, Neon Nights, and Cosmic Aurora
- 💾 **Export Functionality**: Download diagrams as PNG images for presentations and reports
- 🔧 **LLM Configuration**: Secure local storage of API keys with built-in testing functionality
- 🐛 **Debug Tools**: Built-in LLM debug console for troubleshooting API calls
- 🔄 **Dynamic Data**: Extract data from web pages or use built-in sample data
- ⚡ **Fast Rendering**: Pure JavaScript implementation with SVG graphics
- 🌐 **Web Integration**: Extracts Sankey data from HTML tables or JSON on any webpage
- 🔄 **Real-time Updates**: Regenerate diagrams with new random data

## 📸 Screenshots

*Coming soon - add screenshots of the extension in action*

## 🚀 Installation

### From Chrome Web Store
*Coming soon - will be published to the Chrome Web Store*

### Manual Installation (Developer Mode)

1. **Download the Extension**:
   ```bash
   git clone https://github.com/Kurlan/SankeyStone.git
   cd SankeyStone
   ```

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `SankeyStone` directory

3. **Start Using**:
   - Click the SankeyStone icon in your browser toolbar
   - The extension will generate a sample Sankey diagram
   - Click "Regenerate Diagram" for new random data

## 📖 Usage

### Basic Usage

1. **Click the Extension Icon**: Open the SankeyStone popup
2. **View Sample Data**: See a traffic flow diagram with random data
3. **Choose Color Themes**: Select from 15 beautiful color schemes
4. **Download Diagrams**: Export as PNG images using the download button
5. **Hover for Details**: Hover over links and nodes to see values

### 🤖 AI-Powered Analysis Setup

**NEW!** SankeyStone now includes Claude AI integration for automatic diagram generation:

1. **Configure API Key**:
   - Click the ⚙️ settings button in the extension popup
   - Enter your Anthropic Claude API key
   - Test the connection and save settings
   - Get your API key from [Anthropic Console](https://console.anthropic.com/)

2. **Enable Auto-Analysis**:
   - Check "Auto-analyze Sankey diagrams with LLM"
   - Save your settings

3. **Generate AI Diagrams**:
   - Navigate to any web page with data (tables, statistics, processes)
   - Click "🔄 Refresh from Page" in the extension
   - Claude will analyze the entire page content and create a meaningful Sankey diagram
   - View debug logs using the "🔍 LLM Debug Logs" toggle

### Using with Web Page Data

SankeyStone can extract data from specially formatted web pages:

#### Method 1: JSON Data
Add a script tag with id `sankey-data` containing your Sankey data:

```html
<script id="sankey-data" type="application/json">
{
  "nodes": [
    {"id": 0, "name": "Source A", "layer": 0},
    {"id": 1, "name": "Target B", "layer": 1}
  ],
  "links": [
    {"source": 0, "target": 1, "value": 100}
  ]
}
</script>
```

#### Method 2: HTML Tables
Create tables with `data-sankey-layer` attributes:

```html
<table data-sankey-layer="0">
  <tbody>
    <tr data-node-id="0">
      <td>Search Engines</td>
      <td>5,000</td>
    </tr>
  </tbody>
</table>

<table data-sankey-layer="1">
  <tbody>
    <tr data-node-id="1">
      <td>Landing Page</td>
      <td>3,000</td>
    </tr>
  </tbody>
</table>
```

## 🏗️ Architecture

### File Structure
```
SankeyStone/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface with dual view system
├── popup.css             # Main popup styling
├── popup.js              # Core diagram generation and UI logic
├── llm.js                # LLM integration module (Claude API)
├── content.js            # Web page data extraction
├── setup.html            # Standalone setup page (legacy)
├── setup.css             # Setup page styling (legacy)
├── setup.js              # Setup page logic (legacy)
├── test-page.html        # Test page for development
├── test_page.html        # Additional test page
├── icon16.png            # Extension icons (16x16)
├── icon32.png            # Extension icons (32x32)
├── icon48.png            # Extension icons (48x48)
├── icon128.png           # Extension icons (128x128)
└── README.md             # Project documentation
```

### Key Components

- **Main Interface** (`popup.html`/`popup.js`): Dual-view system with main diagram view and integrated setup view
- **LLM Integration** (`llm.js`): Claude API integration for AI-powered diagram generation from page content
- **Content Script** (`content.js`): Extracts structured data from web pages including full page content for LLM analysis
- **Setup System**: Built-in configuration interface for LLM API keys with secure local storage
- **Color Themes**: 15 predefined color schemes for diagram customization
- **Export System**: PNG download functionality with proper file naming
- **Debug Tools**: Built-in LLM debugging console with request/response logging
- **Data Processing**: Handles JSON, HTML table data, and AI-generated diagram data
- **Layout Algorithm**: Custom Sankey layout calculation with hover interactions

## 🎨 Sample Data Structure

The extension demonstrates a typical website traffic flow:

```javascript
{
  "nodes": [
    {"id": 0, "name": "Search Engines", "layer": 0},
    {"id": 1, "name": "Social Media", "layer": 0},
    {"id": 2, "name": "Direct", "layer": 0},
    {"id": 3, "name": "Landing Page", "layer": 1},
    {"id": 4, "name": "Product Page", "layer": 1},
    {"id": 5, "name": "About Page", "layer": 1},
    {"id": 6, "name": "Conversion", "layer": 2},
    {"id": 7, "name": "Bounce", "layer": 2}
  ],
  "links": [
    {"source": 0, "target": 3, "value": 1500},
    {"source": 0, "target": 4, "value": 2500},
    {"source": 1, "target": 3, "value": 800},
    // ... more links
  ]
}
```

## 🔧 Development

### Prerequisites
- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Kurlan/SankeyStone.git
   cd SankeyStone
   ```

2. **Load in developer mode** (see Installation instructions above)

3. **Make changes** to the code

4. **Reload the extension**:
   - Go to `chrome://extensions/`
   - Click the refresh icon on the SankeyStone extension

### Key Files to Modify

- **`popup.js`**: Core diagram generation, UI logic, color themes, and export functionality
- **`popup.css`**: Visual styling for main interface and setup views
- **`llm.js`**: LLM integration, Claude API calls, and AI analysis logic
- **`content.js`**: Web page data extraction and page content analysis
- **`manifest.json`**: Extension permissions, configuration, and metadata

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Ideas for Contributions

- 🤖 **LLM Enhancements**: Add support for OpenAI, Google AI, or other LLM providers
- 📊 **Data Templates**: Create more sample data templates for different industries
- 🎨 **Visual Improvements**: Design new color themes or improve existing ones
- 📥 **Export Formats**: Add SVG, JSON, or PDF export capabilities
- 🔍 **Search & Filter**: Add data filtering and search capabilities within diagrams
- ⚡ **Performance**: Optimize rendering for very large datasets (1000+ nodes)
- 📱 **Responsive Design**: Improve mobile and small screen compatibility
- 🌐 **Data Sources**: Support for CSV files, APIs, or database connections
- 📊 **Analytics**: Add diagram statistics and flow analysis features
- 🎆 **Animations**: Implement smooth transitions and interactive animations

## 🐛 Issues & Support

If you encounter any issues or have suggestions:

1. Check existing [Issues](https://github.com/Kurlan/SankeyStone/issues)
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Screenshots if applicable
   - Browser version and OS

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for simple, accessible data visualization tools
- Built with vanilla JavaScript for maximum compatibility
- Uses SVG for crisp, scalable graphics

## 📊 Roadmap

### ✅ Completed Features
- [x] **AI Integration**: Claude API integration with full page analysis
- [x] **Color Themes**: 15 beautiful predefined color schemes
- [x] **PNG Export**: Download diagrams as high-quality PNG images
- [x] **Debug Tools**: Comprehensive LLM debugging console
- [x] **Secure Setup**: Local API key storage with testing functionality

### 🚀 Coming Next
- [ ] **Chrome Web Store**: Publish extension for easy installation
- [ ] **Multi-LLM Support**: Add OpenAI, Google AI, and other providers
- [ ] **SVG Export**: Vector graphics export for scalable diagrams
- [ ] **Enhanced Analytics**: Page analysis insights and confidence scoring
- [ ] **Custom Themes**: User-defined color palette creation
- [ ] **Animation Engine**: Smooth transitions and interactive effects

### 🌌 Future Vision
- [ ] **Firefox Extension**: Cross-browser compatibility
- [ ] **Enterprise Features**: Batch processing and API integrations
- [ ] **Advanced Layouts**: Tree, circular, and hierarchical diagram types
- [ ] **Collaboration Tools**: Share and embed diagrams
- [ ] **Data Connectors**: Direct integration with analytics platforms

---

**Made with ❤️ for data visualization enthusiasts**

*Star ⭐ this repository if you find it helpful!*
