# 🌊 SankeyStone

**A Chrome Extension for Creating Beautiful Sankey Diagrams**

SankeyStone is a lightweight Chrome extension that visualizes data flow using interactive Sankey diagrams. Whether you're analyzing website traffic, user journeys, or any flow-based data, SankeyStone makes it easy to create stunning visualizations directly in your browser.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![SVG](https://img.shields.io/badge/Graphics-SVG-FF9900?logo=svg&logoColor=white)

## ✨ Features

- 📊 **Interactive Sankey Diagrams**: Generate beautiful flow visualizations with hover effects
- 🔄 **Dynamic Data**: Extract data from web pages or use built-in sample data
- 🎨 **Colorful Visualization**: Automatically colored nodes and links for better readability
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
3. **Regenerate**: Click "Regenerate Diagram" for new sample data
4. **Hover for Details**: Hover over links and nodes to see values

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
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Main diagram generation logic
├── content.js            # Web page data extraction
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Key Components

- **Popup Interface** (`popup.js`): Generates and renders Sankey diagrams using vanilla JavaScript and SVG
- **Content Script** (`content.js`): Extracts structured data from web pages
- **Data Processing**: Handles both JSON and HTML table data formats
- **Layout Algorithm**: Custom Sankey layout calculation for optimal visualization

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

- **`popup.js`**: Modify diagram generation, styling, or layout
- **`popup.css`**: Update visual styling
- **`content.js`**: Change data extraction logic
- **`manifest.json`**: Update permissions or extension metadata

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Ideas for Contributions

- 📊 Add more sample data templates
- 🎨 Improve visual styling and color schemes
- ⚡ Optimize performance for large datasets
- 📱 Add responsive design for different screen sizes
- 🔍 Add data filtering and search capabilities
- 📤 Add export functionality (PNG, SVG, JSON)
- 🌐 Support for more data extraction formats

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

- [ ] Publish to Chrome Web Store
- [ ] Add export functionality (PNG, SVG)
- [ ] Implement custom color themes
- [ ] Add animation transitions
- [ ] Support for larger datasets
- [ ] Firefox extension port
- [ ] Integration with popular analytics platforms

---

**Made with ❤️ for data visualization enthusiasts**

*Star ⭐ this repository if you find it helpful!*
