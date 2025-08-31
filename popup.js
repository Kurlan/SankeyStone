// Base structure for the Sankey diagram
const baseStructure = {
    nodes: [
        { id: 0, name: "Search Engines", layer: 0 },
        { id: 1, name: "Social Media", layer: 0 },
        { id: 2, name: "Direct", layer: 0 },
        { id: 3, name: "Landing Page", layer: 1 },
        { id: 4, name: "Product Page", layer: 1 },
        { id: 5, name: "About Page", layer: 1 },
        { id: 6, name: "Conversion", layer: 2 },
        { id: 7, name: "Bounce", layer: 2 }
    ],
    linkStructure: [
        { source: 0, target: 3 }, // Search Engines -> Landing Page
        { source: 0, target: 4 }, // Search Engines -> Product Page
        { source: 1, target: 3 }, // Social Media -> Landing Page
        { source: 1, target: 5 }, // Social Media -> About Page
        { source: 2, target: 4 }, // Direct -> Product Page
        { source: 2, target: 5 }, // Direct -> About Page
        { source: 3, target: 6 }, // Landing Page -> Conversion
        { source: 3, target: 7 }, // Landing Page -> Bounce
        { source: 4, target: 6 }, // Product Page -> Conversion
        { source: 4, target: 7 }, // Product Page -> Bounce
        { source: 5, target: 6 }, // About Page -> Conversion
        { source: 5, target: 7 }  // About Page -> Bounce
    ]
};

// Generate random traffic values
function generateRandomData() {
    // Random base traffic amounts (500-5000)
    const baseTraffic = {
        searchEngines: Math.floor(Math.random() * 4500) + 500,
        socialMedia: Math.floor(Math.random() * 3000) + 300,
        direct: Math.floor(Math.random() * 2500) + 400
    };
    
    // Generate random distribution percentages
    function randomSplit(total, parts) {
        const randoms = Array(parts).fill().map(() => Math.random());
        const sum = randoms.reduce((a, b) => a + b, 0);
        return randoms.map(r => Math.floor((r / sum) * total));
    }
    
    // Distribute traffic from sources to pages
    const seToPages = randomSplit(baseTraffic.searchEngines, 2); // To Landing and Product
    const smToPages = randomSplit(baseTraffic.socialMedia, 2);   // To Landing and About
    const directToPages = randomSplit(baseTraffic.direct, 2);   // To Product and About
    
    // Calculate page totals
    const pageTraffic = {
        landing: seToPages[0] + smToPages[0],
        product: seToPages[1] + directToPages[0],
        about: smToPages[1] + directToPages[1]
    };
    
    // Generate conversion rates (5-25% conversion, rest bounce)
    const conversionRates = {
        landing: (Math.random() * 0.20 + 0.05), // 5-25%
        product: (Math.random() * 0.30 + 0.10), // 10-40%
        about: (Math.random() * 0.15 + 0.02)    // 2-17%
    };
    
    // Calculate conversions and bounces
    const outcomes = {
        landingConv: Math.floor(pageTraffic.landing * conversionRates.landing),
        landingBounce: pageTraffic.landing - Math.floor(pageTraffic.landing * conversionRates.landing),
        productConv: Math.floor(pageTraffic.product * conversionRates.product),
        productBounce: pageTraffic.product - Math.floor(pageTraffic.product * conversionRates.product),
        aboutConv: Math.floor(pageTraffic.about * conversionRates.about),
        aboutBounce: pageTraffic.about - Math.floor(pageTraffic.about * conversionRates.about)
    };
    
    // Create the data structure with random values
    return {
        nodes: [...baseStructure.nodes],
        links: [
            { source: 0, target: 3, value: seToPages[0] },      // SE -> Landing
            { source: 0, target: 4, value: seToPages[1] },      // SE -> Product
            { source: 1, target: 3, value: smToPages[0] },      // SM -> Landing
            { source: 1, target: 5, value: smToPages[1] },      // SM -> About
            { source: 2, target: 4, value: directToPages[0] },  // Direct -> Product
            { source: 2, target: 5, value: directToPages[1] },  // Direct -> About
            { source: 3, target: 6, value: outcomes.landingConv },   // Landing -> Conversion
            { source: 3, target: 7, value: outcomes.landingBounce }, // Landing -> Bounce
            { source: 4, target: 6, value: outcomes.productConv },   // Product -> Conversion
            { source: 4, target: 7, value: outcomes.productBounce }, // Product -> Bounce
            { source: 5, target: 6, value: outcomes.aboutConv },     // About -> Conversion
            { source: 5, target: 7, value: outcomes.aboutBounce }    // About -> Bounce
        ]
    };
}

// Initial data
let currentData = generateRandomData();

// Layer-based cohesive color themes
const colorThemes = {
    classic: {
        name: "Classic",
        layers: [
            ["#3498db", "#2980b9", "#1f618d"], // Blues for layer 0
            ["#e74c3c", "#c0392b", "#922b21"], // Reds for layer 1 
            ["#27ae60", "#229954", "#1e8449"]  // Greens for layer 2
        ]
    },
    ocean: {
        name: "Ocean Depths",
        layers: [
            ["#5dade2", "#3498db", "#2980b9"], // Light to dark blues
            ["#48c9b0", "#1abc9c", "#16a085"], // Teals
            ["#45b7a8", "#2ecc71", "#27ae60"]  // Ocean greens (brighter)
        ]
    },
    sunset: {
        name: "Sunset Gradient", 
        layers: [
            ["#f7dc6f", "#f4d03f", "#f1c40f"], // Golden yellows
            ["#f8c471", "#f39c12", "#e67e22"], // Oranges
            ["#e74c3c", "#c0392b", "#a93226"]  // Warm reds
        ]
    },
    forest: {
        name: "Forest Canopy",
        layers: [
            ["#a9dfbf", "#82e5aa", "#58d68d"], // Light greens
            ["#2ecc71", "#27ae60", "#229954"], // Medium greens
            ["#1e8449", "#186a3b", "#145a32"]  // Deep greens
        ]
    },
    vibrant: {
        name: "Vibrant",
        layers: [
            ["#ff6b6b", "#4ecdc4", "#45b7d1"], // Bright coral, teal, blue
            ["#96ceb4", "#ffeaa7", "#dda0dd"], // Mint, yellow, plum
            ["#fd79a8", "#fdcb6e", "#6c5ce7"]  // Pink, orange, purple
        ]
    },
    coral: {
        name: "Coral Reef",
        layers: [
            ["#ff7675", "#fd79a8", "#e84393"], // Coral pinks
            ["#00b894", "#00cec9", "#55a3ff"], // Turquoise blues
            ["#fdcb6e", "#e17055", "#d63031"]  // Warm corals
        ]
    },
    neon: {
        name: "Neon Nights",
        layers: [
            ["#00f5ff", "#1e90ff", "#0080ff"], // Electric blues
            ["#ff1493", "#ff69b4", "#ff6347"], // Hot pinks/oranges
            ["#00ff7f", "#32cd32", "#7fff00"]  // Electric greens
        ]
    },
    pastels: {
        name: "Soft Pastels",
        layers: [
            ["#ffeaa7", "#fab1a0", "#fd79a8"], // Soft yellows to pinks
            ["#81ecec", "#74b9ff", "#a29bfe"], // Soft cyans to purples
            ["#55a3ff", "#00b894", "#00cec9"]  // Soft blues to teals
        ]
    },
    cosmic: {
        name: "Cosmic Aurora",
        layers: [
            ["#a29bfe", "#6c5ce7", "#5f3dc4"], // Purple nebulas
            ["#fd79a8", "#e84393", "#d63031"], // Pink auroras
            ["#00cec9", "#00b894", "#55a3ff"]  // Cosmic blues
        ]
    },
    tropical: {
        name: "Tropical Paradise",
        layers: [
            ["#00cec9", "#55efc4", "#00b894"], // Tropical waters
            ["#ffeaa7", "#fdcb6e", "#e17055"], // Sunset oranges
            ["#fd79a8", "#e84393", "#74b9ff"]  // Tropical flowers
        ]
    },
    cyberpunk: {
        name: "Cyberpunk City",
        layers: [
            ["#ff0080", "#00ffff", "#8000ff"], // Hot pink, cyan, purple
            ["#ffff00", "#ff8000", "#00ff80"], // Electric yellow, orange, green
            ["#ff4080", "#80ff00", "#4080ff"]  // Bright magenta, lime, electric blue
        ]
    },
    sakura: {
        name: "Cherry Blossom",
        layers: [
            ["#ffb3d9", "#ff99cc", "#ff80bf"], // Soft pinks
            ["#ffccf2", "#e6b3ff", "#d999ff"], // Light purples
            ["#ccb3ff", "#b399ff", "#9980ff"]  // Lavender purples
        ]
    },
    retro: {
        name: "Retro Wave",
        layers: [
            ["#ff6b9d", "#c44569", "#f8b500"], // Retro pinks and gold
            ["#00d2d3", "#0fb9b1", "#009ffd"], // Retro teals and blues
            ["#7209b7", "#a663cc", "#4834d4"]  // Retro purples
        ]
    },
    mint: {
        name: "Mint Fresh",
        layers: [
            ["#55efc4", "#00b894", "#00cec9"], // Fresh mints
            ["#81ecec", "#74b9ff", "#0984e3"], // Cool blues
            ["#a29bfe", "#6c5ce7", "#fd79a8"]  // Soft purples and pink
        ]
    },
    golden: {
        name: "Golden Hour",
        layers: [
            ["#ffd700", "#ffb347", "#ff8c42"], // Golden yellows
            ["#ff6b35", "#f7931e", "#ffaa44"], // Warm oranges
            ["#ff5722", "#e91e63", "#9c27b0"]  // Sunset reds to purple
        ]
    }
};

// Current color theme index
let currentThemeIndex = 0;
const themeNames = Object.keys(colorThemes);

// Color utility functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function lighten(hex, percent) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    const factor = 1 + (percent / 100);
    return rgbToHex(
        Math.min(255, Math.floor(rgb.r * factor)),
        Math.min(255, Math.floor(rgb.g * factor)),
        Math.min(255, Math.floor(rgb.b * factor))
    );
}

function darken(hex, percent) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    const factor = 1 - (percent / 100);
    return rgbToHex(
        Math.floor(rgb.r * factor),
        Math.floor(rgb.g * factor),
        Math.floor(rgb.b * factor)
    );
}

// Current color theme
let currentTheme = colorThemes[themeNames[currentThemeIndex]];

// Get link color based on source node layer and position
function getLinkColor(sourceNode) {
    const layerColors = currentTheme.layers[sourceNode.layer] || currentTheme.layers[0];
    
    // Get position of node within its layer for color variation
    // Use currentData instead of baseStructure to work with actual extracted data
    const layerNodes = currentData.nodes.filter(n => n.layer === sourceNode.layer);
    const nodeIndex = layerNodes.findIndex(n => n.id === sourceNode.id);
    
    // Use node index to pick color from layer palette, fallback to node ID if not found
    const colorIndex = nodeIndex >= 0 ? nodeIndex : (sourceNode.id || 0);
    return layerColors[colorIndex % layerColors.length];
}

// Get node color (related but different from outbound link color)
function getNodeColor(node) {
    const linkColor = getLinkColor(node);
    
    // Convert to RGB to check brightness
    const rgb = hexToRgb(linkColor);
    if (!rgb) return linkColor;
    
    // Calculate brightness (0-255)
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    
    // If the link color is already dark, lighten the node instead of darkening
    if (brightness < 120) {
        return lighten(linkColor, 20);
    } else {
        // For lighter colors, darken slightly for contrast
        return darken(linkColor, 10);
    }
}

// Create SVG elements using vanilla JavaScript
function createSVGElement(tag, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.keys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key]);
    });
    return element;
}

// Calculate layout for Sankey diagram with proportional node heights
function calculateSankeyLayout(data) {
    const nodes = data.nodes.map(d => ({ ...d }));
    const links = data.links.map(d => ({ ...d }));
    
    // Calculate node values first
    nodes.forEach(node => {
        const incomingValue = links
            .filter(l => l.target === node.id)
            .reduce((sum, l) => sum + l.value, 0);
        const outgoingValue = links
            .filter(l => l.source === node.id)
            .reduce((sum, l) => sum + l.value, 0);
        
        node.value = Math.max(incomingValue, outgoingValue) || 0;
    });
    
    // Find min and max values for normalization
    const nodeValues = nodes.map(n => n.value).filter(v => v > 0);
    const minValue = Math.min(...nodeValues);
    const maxValue = Math.max(...nodeValues);
    
    // Group nodes by layer
    const layers = [...new Set(nodes.map(d => d.layer))].sort();
    const numLayers = layers.length;
    
    // Dynamic layout parameters
    const nodeWidth = 30;
    const minNodeHeight = 20; // Minimum height for readability
    const maxNodeHeight = 100; // Reduced max height to allow more space for labels
    const basePadding = 12; // Base padding between nodes
    const labelHeight = 20; // Space needed for labels above nodes
    const layerWidth = Math.max(140, 220 - numLayers * 10); // Increased layer width
    const minDiagramHeight = 320; // Increased minimum height
    
    // Calculate proportional heights for nodes in all layers
    layers.forEach((layer, layerIndex) => {
        const layerNodes = nodes.filter(d => d.layer === layer);
        
        // Calculate proportional heights for nodes in this layer
        layerNodes.forEach(node => {
            if (node.value === 0) {
                node.height = minNodeHeight;
            } else {
                // Normalize value to a height between min and max
                const normalizedValue = (node.value - minValue) / (maxValue - minValue);
                node.height = Math.round(minNodeHeight + (normalizedValue * (maxNodeHeight - minNodeHeight)));
            }
        });
    });
    
    // Calculate diagram height based on content and spacing needs
    const allNodeHeights = nodes.map(n => n.height);
    const maxTotalNodesHeight = Math.max(...layers.map(layer => {
        const layerNodes = nodes.filter(d => d.layer === layer);
        return layerNodes.reduce((sum, node) => sum + node.height, 0);
    }));
    
    // Ensure we have enough space for the largest layer plus labels and margins
    const diagramHeight = Math.max(
        minDiagramHeight, 
        maxTotalNodesHeight + labelHeight * 3 + 100 // Extra space for labels, gaps, and margins
    );
    
    // Calculate required width
    const diagramWidth = Math.max(400, (numLayers - 1) * layerWidth + nodeWidth + 100);
    
    // Position nodes within each layer with even vertical distribution
    layers.forEach((layer, layerIndex) => {
        const layerNodes = nodes.filter(d => d.layer === layer);
        
        if (layerNodes.length === 0) return;
        
        // Calculate total height used by nodes in this layer
        const totalNodesHeight = layerNodes.reduce((sum, node) => sum + node.height, 0);
        
        // Available space for distribution (excluding margins)
        const availableHeight = diagramHeight - labelHeight * 2 - 40; // Top and bottom margins
        const availableSpaceForGaps = availableHeight - totalNodesHeight;
        
        // Distribute nodes evenly within available space
        if (layerNodes.length === 1) {
            // Single node - center it
            const node = layerNodes[0];
            node.x = layerIndex * layerWidth + 50;
            node.y = (diagramHeight - node.height) / 2;
            node.width = nodeWidth;
        } else {
            // Multiple nodes - distribute evenly
            const gapSize = Math.max(basePadding, availableSpaceForGaps / (layerNodes.length - 1));
            
            // Start from top with margin
            let currentY = labelHeight + 20;
            
            // If we have too much space, center the whole layer
            const totalLayerHeight = totalNodesHeight + (layerNodes.length - 1) * gapSize;
            if (totalLayerHeight < availableHeight) {
                currentY = (diagramHeight - totalLayerHeight) / 2 + labelHeight / 2;
            }
            
            layerNodes.forEach((node, nodeIndex) => {
                node.x = layerIndex * layerWidth + 50;
                node.y = currentY;
                node.width = nodeWidth;
                // Height was already calculated above
                
                currentY += node.height + gapSize;
            });
        }
    });
    
    // Calculate link heights and stacking positions
    links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        
        link.sourceNode = sourceNode;
        link.targetNode = targetNode;
    });
    
    // Calculate proportional link heights and stacking positions
    nodes.forEach(node => {
        const outgoingLinks = links.filter(l => l.source === node.id);
        const incomingLinks = links.filter(l => l.target === node.id);
        
        // Calculate outgoing link heights and positions
        const totalOutgoingValue = outgoingLinks.reduce((sum, l) => sum + l.value, 0);
        let currentOutgoingY = 0;
        
        outgoingLinks.forEach(link => {
            const linkHeightRatio = totalOutgoingValue > 0 ? link.value / totalOutgoingValue : 0;
            link.sourceHeight = linkHeightRatio * node.height;
            link.sourceY1 = currentOutgoingY;
            link.sourceY2 = currentOutgoingY + link.sourceHeight;
            currentOutgoingY += link.sourceHeight;
        });
        
        // Calculate incoming link heights and positions
        const totalIncomingValue = incomingLinks.reduce((sum, l) => sum + l.value, 0);
        let currentIncomingY = 0;
        
        incomingLinks.forEach(link => {
            const linkHeightRatio = totalIncomingValue > 0 ? link.value / totalIncomingValue : 0;
            link.targetHeight = linkHeightRatio * node.height;
            link.targetY1 = currentIncomingY;
            link.targetY2 = currentIncomingY + link.targetHeight;
            currentIncomingY += link.targetHeight;
        });
    });
    
    // Generate SVG paths for stacked links
    links.forEach(link => {
        const sourceNode = link.sourceNode;
        const targetNode = link.targetNode;
        
        // Source connection points (right side of source node)
        const x1 = sourceNode.x + sourceNode.width;
        const sy1 = sourceNode.y + link.sourceY1;
        const sy2 = sourceNode.y + link.sourceY2;
        
        // Target connection points (left side of target node)
        const x2 = targetNode.x;
        const ty1 = targetNode.y + link.targetY1;
        const ty2 = targetNode.y + link.targetY2;
        
        // Control points for smooth curves
        const cx1 = x1 + (x2 - x1) * 0.5;
        const cx2 = x2 - (x2 - x1) * 0.5;
        
        // Create a path that forms a "ribbon" between the nodes
        // Start at top of source link, curve to top of target link,
        // then to bottom of target link, curve back to bottom of source link, and close
        const path = [
            `M${x1},${sy1}`, // Move to top of source link
            `C${cx1},${sy1} ${cx2},${ty1} ${x2},${ty1}`, // Curve to top of target link
            `L${x2},${ty2}`, // Line to bottom of target link
            `C${cx2},${ty2} ${cx1},${sy2} ${x1},${sy2}`, // Curve back to bottom of source link
            `Z` // Close the path
        ].join(' ');
        
        link.path = path;
        link.linkHeight = Math.max(link.sourceHeight, link.targetHeight, 2); // For stroke width reference
    });
    
    return { nodes, links, dimensions: { width: diagramWidth, height: diagramHeight + 40 } };
}

function createSankeyDiagram(data) {
    try {
        console.log('Creating pure JavaScript Sankey diagram');
        
        // Clear existing content
        const loadingDiv = document.getElementById('loading');
        const svg = document.getElementById('sankey-svg');
        
        // Clear SVG
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }
        
        // Hide loading message
        loadingDiv.style.display = 'none';
        
        // Calculate layout first to get dynamic dimensions
        const graph = calculateSankeyLayout(data);
        
        console.log('Layout calculated:', graph);
        console.log('Dynamic dimensions:', graph.dimensions);
        
        // Set SVG dimensions based on calculated layout
        const { width: diagramWidth, height: diagramHeight } = graph.dimensions;
        
        // Ensure the SVG container can accommodate the diagram
        const containerMaxWidth = 550; // Leave some margin for the popup
        const containerMaxHeight = 400;
        
        // Scale down if necessary while maintaining aspect ratio
        const scaleX = diagramWidth > containerMaxWidth ? containerMaxWidth / diagramWidth : 1;
        const scaleY = diagramHeight > containerMaxHeight ? containerMaxHeight / diagramHeight : 1;
        const scale = Math.min(scaleX, scaleY);
        
        const finalWidth = Math.ceil(diagramWidth * scale);
        const finalHeight = Math.ceil(diagramHeight * scale);
        
        svg.setAttribute('width', finalWidth);
        svg.setAttribute('height', finalHeight);
        svg.setAttribute('viewBox', `0 0 ${diagramWidth} ${diagramHeight}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        // Adjust container height if needed
        const container = document.getElementById('sankey-container');
        container.style.height = `${finalHeight + 20}px`;
        
        // Find max value for stroke width scaling
        const maxValue = Math.max(...graph.links.map(l => l.value));
        
        // Create links as filled ribbons
        graph.links.forEach(link => {
            const path = createSVGElement('path', {
                d: link.path,
                fill: getLinkColor(link.sourceNode),
                'fill-opacity': '0.6',
                stroke: 'none',
                class: 'sankey-link'
            });
            
            // Add hover effect
            path.addEventListener('mouseover', function() {
                this.setAttribute('fill-opacity', '0.8');
            });
            path.addEventListener('mouseout', function() {
                this.setAttribute('fill-opacity', '0.6');
            });
            
            // Add tooltip
            const title = createSVGElement('title');
            title.textContent = `${link.sourceNode.name} → ${link.targetNode.name}\n${link.value.toLocaleString()} visitors`;
            path.appendChild(title);
            
            svg.appendChild(path);
        });
        
        // Create nodes
        graph.nodes.forEach(node => {
            // Create node group
            const nodeGroup = createSVGElement('g', {
                class: 'sankey-node',
                transform: `translate(${node.x}, ${node.y})`
            });
            
            // Create square rectangle with no border
            const rect = createSVGElement('rect', {
                width: node.width,
                height: node.height,
                fill: getNodeColor(node),
                stroke: 'none',
                rx: 0,
                ry: 0
            });
            
            // Create label
            const text = createSVGElement('text', {
                x: node.width / 2,
                y: -8,
                'text-anchor': 'middle',
                'font-size': '11px',
                'font-weight': '600',
                fill: '#333'
            });
            text.textContent = node.name;
            
            // Create value label
            const valueText = createSVGElement('text', {
                x: node.width / 2,
                y: node.height / 2,
                'text-anchor': 'middle',
                'dominant-baseline': 'middle',
                'font-size': '10px',
                'font-weight': 'bold',
                fill: 'white'
            });
            valueText.textContent = node.value ? node.value.toLocaleString() : '';
            
            nodeGroup.appendChild(rect);
            nodeGroup.appendChild(text);
            nodeGroup.appendChild(valueText);
            svg.appendChild(nodeGroup);
        });
        
        console.log(`Pure JavaScript Sankey diagram created successfully (${finalWidth}x${finalHeight})`);
        
    } catch (error) {
        console.error('Error creating Sankey diagram:', error);
        const loadingDiv = document.getElementById('loading');
        loadingDiv.textContent = `Error: ${error.message}`;
        loadingDiv.style.display = 'block';
    }
}

// Function to get data from the current webpage
function getPageData() {
    return new Promise((resolve, reject) => {
        try {
            // Get the current active tab
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs.length === 0) {
                    console.error('No active tab found');
                    resolve(null);
                    return;
                }
                
                const tab = tabs[0];
                console.log('Sending message to tab:', tab.id, tab.url);
                
                // Send message to content script to extract data
                chrome.tabs.sendMessage(tab.id, { action: 'getSankeyData' }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.error('Chrome runtime error:', chrome.runtime.lastError.message);
                        resolve(null);
                        return;
                    }
                    
                    if (response && response.success) {
                        console.log('Successfully extracted data from page:', response.data);
                        resolve(response.data);
                    } else {
                        console.log('No data found on page:', response ? response.error : 'No response');
                        resolve(null);
                    }
                });
            });
        } catch (error) {
            console.error('Error communicating with content script:', error);
            resolve(null);
        }
    });
}

// Function to apply selected color theme
function applyColorTheme() {
    const themeSelect = document.getElementById('color-dropdown');
    const selectedIndex = parseInt(themeSelect.value);
    
    if (selectedIndex >= 0 && selectedIndex < themeNames.length) {
        const selectedThemeName = themeNames[selectedIndex];
        currentTheme = colorThemes[selectedThemeName];
        console.log(`Applied theme: ${currentTheme.name}`);
        
        // Show loading
        document.getElementById('loading').textContent = 'Applying theme...';
        document.getElementById('loading').style.display = 'block';
        
        // Regenerate diagram with new theme
        createSankeyDiagram(currentData);
    }
}

// Function to apply a random theme
function applyRandomTheme() {
    // Get a random theme index
    const randomIndex = Math.floor(Math.random() * themeNames.length);
    const randomThemeName = themeNames[randomIndex];
    
    // Update the dropdown to reflect the random selection
    const themeSelect = document.getElementById('color-dropdown');
    themeSelect.value = randomIndex.toString();
    
    // Apply the random theme
    currentTheme = colorThemes[randomThemeName];
    console.log(`Applied random theme: ${currentTheme.name}`);
    
    // Show loading
    document.getElementById('loading').textContent = `Applying ${currentTheme.name} theme...`;
    document.getElementById('loading').style.display = 'block';
    
    // Regenerate diagram with new theme
    createSankeyDiagram(currentData);
}

// Function to refresh data from the current page
function refreshFromPage() {
    console.log('🔄 Refreshing data from current page...');
    
    // Show loading
    document.getElementById('loading').textContent = 'Refreshing data from page...';
    document.getElementById('loading').style.display = 'block';
    
    // Try to get fresh data from the current webpage
    getPageData().then(pageData => {
        console.log('Refresh - getPageData resolved with:', pageData);
        
        if (pageData) {
            // Use fresh data from the webpage
            console.log('✅ Successfully refreshed data from webpage');
            console.log('New page data nodes:', pageData.nodes?.length || 0);
            console.log('New page data links:', pageData.links?.length || 0);
            currentData = pageData;
            
            // Update the diagram with new data
            createSankeyDiagram(currentData);
        } else {
            // If no data found, show error message
            console.log('❌ No new data found on page during refresh');
            document.getElementById('loading').textContent = 'No data found on current page';
            
            // Hide loading message after a short delay
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
            }, 2000);
        }
    }).catch(error => {
        console.error('❌ Error during refresh:', error);
        document.getElementById('loading').textContent = 'Error refreshing data';
        
        // Hide loading message after a short delay
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 2000);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('SankeyStone popup loaded - theme dropdown version');
    
    // Show loading while we try to get page data
    document.getElementById('loading').textContent = 'Extracting data from page...';
    document.getElementById('loading').style.display = 'block';
    
    // Try to get data from the current webpage
    getPageData().then(pageData => {
        console.log('getPageData resolved with:', pageData);
        
        if (pageData) {
            // Use data from the webpage
            console.log('✅ Using data extracted from webpage');
            console.log('Page data nodes:', pageData.nodes?.length || 0);
            console.log('Page data links:', pageData.links?.length || 0);
            currentData = pageData;
        } else {
            // Fall back to random data
            console.log('❌ No page data found, using random data');
            currentData = generateRandomData();
        }
        
        // Create initial diagram
        createSankeyDiagram(currentData);
    }).catch(error => {
        console.error('❌ Error during initialization:', error);
        currentData = generateRandomData();
        createSankeyDiagram(currentData);
    });
    
    // Add event listener for dropdown change - apply theme immediately
    document.getElementById('color-dropdown').addEventListener('change', applyColorTheme);
    
    // Add event listener for refresh button
    document.getElementById('refresh-btn').addEventListener('click', refreshFromPage);
    
    // Add event listener for random theme button
    document.getElementById('random-btn').addEventListener('click', applyRandomTheme);
});

// Export for potential future use
window.SankeyStone = {
    createDiagram: createSankeyDiagram,
    generateRandomData: generateRandomData,
    currentData: () => currentData
};
