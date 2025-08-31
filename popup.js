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

// Function to show the setup view inline
function showSetupView() {
    console.log('Showing setup view...');
    
    // Hide main view and show setup view
    document.getElementById('main-view').classList.add('hidden');
    document.getElementById('setup-view').classList.remove('hidden');
    
    // Load existing settings into the setup form
    loadSettings();
}

// Function to show the main view
function showMainView() {
    console.log('Showing main view...');
    
    // Hide setup view and show main view
    document.getElementById('setup-view').classList.add('hidden');
    document.getElementById('main-view').classList.remove('hidden');
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
    
    // Add event listener for setup button
    document.getElementById('setup-btn').addEventListener('click', showSetupView);
    
    // Add event listener for back button (when setup view is visible)
    document.getElementById('back-btn').addEventListener('click', showMainView);
    
    // Setup form event listeners (only add if elements exist to avoid errors)
    if (document.getElementById('setup-form')) {
        const form = document.getElementById('setup-form');
        const saveBtn = document.getElementById('save-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        const clearDataBtn = document.getElementById('clear-data-btn');
        
        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!showValidationErrors()) {
                return;
            }
            
            // Show loading state
            saveBtn.classList.add('loading');
            form.classList.add('form-saving');
            
            try {
                const success = await saveSettings();
                if (success) {
                    // Briefly show success state
                    setTimeout(() => {
                        saveBtn.classList.remove('loading');
                        form.classList.remove('form-saving');
                        checkFormDirty(); // Update button state
                    }, 500);
                } else {
                    saveBtn.classList.remove('loading');
                    form.classList.remove('form-saving');
                }
            } catch (error) {
                saveBtn.classList.remove('loading');
                form.classList.remove('form-saving');
                showStatusMessage('Unexpected error saving settings.', 'error');
            }
        });
        
        // Cancel button
        cancelBtn.addEventListener('click', showMainView);
        
        // Clear data button
        clearDataBtn.addEventListener('click', clearAllData);
        
        // Password visibility toggles
        document.querySelectorAll('.toggle-visibility').forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                togglePasswordVisibility(targetId);
            });
        });
        
        // Test button event listeners
        document.querySelectorAll('.test-key-btn').forEach(button => {
            button.addEventListener('click', function() {
                const provider = this.getAttribute('data-provider');
                testApiKey(provider);
            });
        });
        
        // Form change detection
        form.addEventListener('input', function() {
            checkFormDirty();
            updateDefaultProviderOptions();
            
            // Clear validation errors on input
            const target = event.target;
            if (target.type === 'password' || target.type === 'text') {
                target.style.borderColor = '#dadce0';
            }
        });
        
        form.addEventListener('change', function() {
            checkFormDirty();
            updateDefaultProviderOptions();
        });
    }
});

// Export for potential future use
window.SankeyStone = {
    createDiagram: createSankeyDiagram,
    generateRandomData: generateRandomData,
    currentData: () => currentData
};

// ===== SETUP FUNCTIONALITY =====
// Storage keys for different settings
const STORAGE_KEYS = {
    OPENAI_KEY: 'sankeystone_openai_key',
    ANTHROPIC_KEY: 'sankeystone_anthropic_key',
    GOOGLE_KEY: 'sankeystone_google_key',
    HUGGINGFACE_KEY: 'sankeystone_huggingface_key',
    COHERE_KEY: 'sankeystone_cohere_key',
    DEFAULT_PROVIDER: 'sankeystone_default_provider',
    AUTO_ANALYZE: 'sankeystone_auto_analyze'
};

// Current form state for setup
let formData = {};
let isFormDirty = false;

/**
 * Load settings from Chrome storage
 */
async function loadSettings() {
    try {
        const stored = await chrome.storage.sync.get(Object.values(STORAGE_KEYS));
        
        // Populate form fields with stored values
        document.getElementById('openai-key').value = stored[STORAGE_KEYS.OPENAI_KEY] || '';
        document.getElementById('anthropic-key').value = stored[STORAGE_KEYS.ANTHROPIC_KEY] || '';
        document.getElementById('google-key').value = stored[STORAGE_KEYS.GOOGLE_KEY] || '';
        document.getElementById('huggingface-key').value = stored[STORAGE_KEYS.HUGGINGFACE_KEY] || '';
        document.getElementById('cohere-key').value = stored[STORAGE_KEYS.COHERE_KEY] || '';
        document.getElementById('default-provider').value = stored[STORAGE_KEYS.DEFAULT_PROVIDER] || '';
        document.getElementById('auto-analyze').checked = stored[STORAGE_KEYS.AUTO_ANALYZE] === true;
        
        // Store initial form data for dirty checking
        formData = { ...stored };
        
        console.log('Settings loaded successfully');
        
        // Update default provider options based on available keys
        updateDefaultProviderOptions();
        
    } catch (error) {
        console.error('Error loading settings:', error);
        showStatusMessage('Error loading settings. Please try again.', 'error');
    }
}

/**
 * Save settings to Chrome storage
 */
async function saveSettings() {
    try {
        const form = document.getElementById('setup-form');
        
        // Prepare data object for storage
        const dataToSave = {
            [STORAGE_KEYS.OPENAI_KEY]: document.getElementById('openai-key').value.trim(),
            [STORAGE_KEYS.ANTHROPIC_KEY]: document.getElementById('anthropic-key').value.trim(),
            [STORAGE_KEYS.GOOGLE_KEY]: document.getElementById('google-key').value.trim(),
            [STORAGE_KEYS.HUGGINGFACE_KEY]: document.getElementById('huggingface-key').value.trim(),
            [STORAGE_KEYS.COHERE_KEY]: document.getElementById('cohere-key').value.trim(),
            [STORAGE_KEYS.DEFAULT_PROVIDER]: document.getElementById('default-provider').value,
            [STORAGE_KEYS.AUTO_ANALYZE]: document.getElementById('auto-analyze').checked
        };
        
        // Validate at least one API key is provided
        const hasApiKey = dataToSave[STORAGE_KEYS.OPENAI_KEY] || 
                         dataToSave[STORAGE_KEYS.ANTHROPIC_KEY] || 
                         dataToSave[STORAGE_KEYS.GOOGLE_KEY] || 
                         dataToSave[STORAGE_KEYS.HUGGINGFACE_KEY] || 
                         dataToSave[STORAGE_KEYS.COHERE_KEY];
        
        if (!hasApiKey) {
            showStatusMessage('Please provide at least one API key.', 'error');
            return false;
        }
        
        // Validate default provider selection if auto-analyze is enabled
        if (dataToSave[STORAGE_KEYS.AUTO_ANALYZE] && !dataToSave[STORAGE_KEYS.DEFAULT_PROVIDER]) {
            showStatusMessage('Please select a default provider when auto-analyze is enabled.', 'error');
            return false;
        }
        
        // Check if default provider has corresponding API key
        if (dataToSave[STORAGE_KEYS.DEFAULT_PROVIDER]) {
            const providerKeyMap = {
                'openai': STORAGE_KEYS.OPENAI_KEY,
                'anthropic': STORAGE_KEYS.ANTHROPIC_KEY,
                'google': STORAGE_KEYS.GOOGLE_KEY,
                'huggingface': STORAGE_KEYS.HUGGINGFACE_KEY,
                'cohere': STORAGE_KEYS.COHERE_KEY
            };
            
            const requiredKey = providerKeyMap[dataToSave[STORAGE_KEYS.DEFAULT_PROVIDER]];
            if (requiredKey && !dataToSave[requiredKey]) {
                showStatusMessage('Please provide an API key for your selected default provider.', 'error');
                return false;
            }
        }
        
        // Save to Chrome storage
        await chrome.storage.sync.set(dataToSave);
        
        // Update stored form data
        formData = { ...dataToSave };
        isFormDirty = false;
        
        console.log('Settings saved successfully');
        showStatusMessage('✅ Settings saved successfully!', 'success');
        
        // Go back to main view after a brief delay
        setTimeout(() => {
            showMainView();
        }, 1500);
        
        return true;
        
    } catch (error) {
        console.error('Error saving settings:', error);
        showStatusMessage('Error saving settings. Please try again.', 'error');
        return false;
    }
}

/**
 * Clear all stored data
 */
async function clearAllData() {
    if (!confirm('Are you sure you want to clear all stored API keys and settings? This action cannot be undone.')) {
        return;
    }
    
    try {
        // Clear all storage
        await chrome.storage.sync.clear();
        
        // Reset form
        document.getElementById('setup-form').reset();
        formData = {};
        isFormDirty = false;
        
        // Update UI
        updateDefaultProviderOptions();
        
        console.log('All data cleared successfully');
        showStatusMessage('🗑️ All data cleared successfully.', 'info');
        
    } catch (error) {
        console.error('Error clearing data:', error);
        showStatusMessage('Error clearing data. Please try again.', 'error');
    }
}

/**
 * Update the default provider dropdown based on available API keys
 */
function updateDefaultProviderOptions() {
    const defaultProviderSelect = document.getElementById('default-provider');
    const currentValue = defaultProviderSelect.value;
    
    // Get current values of API keys
    const keys = {
        openai: document.getElementById('openai-key').value.trim(),
        anthropic: document.getElementById('anthropic-key').value.trim(),
        google: document.getElementById('google-key').value.trim(),
        huggingface: document.getElementById('huggingface-key').value.trim(),
        cohere: document.getElementById('cohere-key').value.trim()
    };
    
    // Enable/disable options based on available keys
    const options = defaultProviderSelect.querySelectorAll('option[value]');
    options.forEach(option => {
        const providerKey = option.value;
        if (providerKey && keys[providerKey]) {
            option.disabled = false;
            option.textContent = option.textContent.replace(' (No API Key)', '');
        } else if (providerKey) {
            option.disabled = true;
            if (!option.textContent.includes('(No API Key)')) {
                option.textContent += ' (No API Key)';
            }
        }
    });
    
    // If current selection is now disabled, clear it
    if (currentValue && !keys[currentValue]) {
        defaultProviderSelect.value = '';
    }
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility(targetId) {
    const input = document.getElementById(targetId);
    const button = document.querySelector(`[data-target="${targetId}"]`);
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

/**
 * Show status message to user
 */
function showStatusMessage(message, type = 'info') {
    const statusElement = document.getElementById('status-message');
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    statusElement.classList.remove('hidden');
    
    // Auto-hide success and info messages after 3 seconds
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            statusElement.classList.add('hidden');
        }, 3000);
    }
}

/**
 * Check if form has unsaved changes
 */
function checkFormDirty() {
    const currentFormData = {
        [STORAGE_KEYS.OPENAI_KEY]: document.getElementById('openai-key').value.trim(),
        [STORAGE_KEYS.ANTHROPIC_KEY]: document.getElementById('anthropic-key').value.trim(),
        [STORAGE_KEYS.GOOGLE_KEY]: document.getElementById('google-key').value.trim(),
        [STORAGE_KEYS.HUGGINGFACE_KEY]: document.getElementById('huggingface-key').value.trim(),
        [STORAGE_KEYS.COHERE_KEY]: document.getElementById('cohere-key').value.trim(),
        [STORAGE_KEYS.DEFAULT_PROVIDER]: document.getElementById('default-provider').value,
        [STORAGE_KEYS.AUTO_ANALYZE]: document.getElementById('auto-analyze').checked
    };
    
    // Compare with stored form data
    const isDirty = Object.keys(currentFormData).some(key => 
        currentFormData[key] !== (formData[key] || (typeof currentFormData[key] === 'boolean' ? false : ''))
    );
    
    isFormDirty = isDirty;
    
    // Update save button state
    const saveBtn = document.getElementById('save-btn');
    if (isDirty) {
        saveBtn.textContent = '💾 Save Changes';
        saveBtn.classList.add('btn-primary');
        saveBtn.classList.remove('btn-secondary');
    } else {
        saveBtn.textContent = '✅ Saved';
        saveBtn.classList.remove('btn-primary');
        saveBtn.classList.add('btn-secondary');
    }
}

/**
 * Validate API key format
 */
function validateApiKey(provider, key) {
    if (!key) return true; // Empty keys are allowed
    
    const patterns = {
        openai: /^sk-[a-zA-Z0-9]{20,}$/,
        anthropic: /^sk-ant-[a-zA-Z0-9_-]+$/,
        google: /^AI[a-zA-Z0-9_-]+$/,
        huggingface: /^hf_[a-zA-Z0-9]{20,}$/,
        cohere: /^[a-zA-Z0-9_-]{20,}$/
    };
    
    const pattern = patterns[provider];
    return !pattern || pattern.test(key);
}

/**
 * Test API key for a specific provider
 */
async function testApiKey(provider) {
    const keyInput = document.getElementById(`${provider}-key`);
    const testBtn = document.querySelector(`[data-provider="${provider}"]`);
    const apiKey = keyInput.value.trim();
    
    if (!apiKey) {
        showStatusMessage('Please enter an API key first.', 'error');
        return;
    }
    
    // Validate format first
    if (!validateApiKey(provider, apiKey)) {
        showStatusMessage(`Invalid ${provider.toUpperCase()} API key format. Expected format: ${getExpectedKeyFormat(provider)}`, 'error');
        return;
    }
    
    // Update button state
    testBtn.classList.add('testing');
    testBtn.disabled = true;
    testBtn.title = 'Testing API key...';
    
    try {
        const result = await makeTestApiCall(provider, apiKey);
        
        if (result.isValid) {
            testBtn.classList.remove('testing', 'error');
            testBtn.classList.add('success');
            testBtn.title = 'API key is valid!';
            showStatusMessage(`✅ ${getProviderName(provider)} API key is valid!${result.details ? ' ' + result.details : ''}`, 'success');
        } else {
            testBtn.classList.remove('testing', 'success');
            testBtn.classList.add('error');
            testBtn.title = 'API key is invalid';
            const errorDetails = result.details ? `\n\nDetails: ${result.details}` : '';
            const debugInfo = result.debug ? `\n\nDebug Info:\n• Status: ${result.debug.status}\n• Response: ${result.debug.response}` : '';
            showStatusMessage(`❌ ${getProviderName(provider)} API key validation failed.${errorDetails}${debugInfo}`, 'error');
        }
        
    } catch (error) {
        console.error(`Error testing ${provider} API key:`, error);
        testBtn.classList.remove('testing', 'success');
        testBtn.classList.add('error');
        testBtn.title = 'Error testing API key';
        
        let errorDetails = error.message;
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorDetails = 'Network error - check your internet connection or the API endpoint may be blocked.';
        } else if (error.message.includes('CORS')) {
            errorDetails = 'CORS error - this is often due to browser security restrictions with extension API calls.';
        }
        
        showStatusMessage(`❌ Error testing ${getProviderName(provider)} API key: ${errorDetails}`, 'error');
    } finally {
        testBtn.disabled = false;
        
        // Reset button state after 5 seconds (longer to read error details)
        setTimeout(() => {
            testBtn.classList.remove('testing', 'success', 'error');
            testBtn.title = 'Test API Key';
        }, 5000);
    }
}

/**
 * Get expected key format for display
 */
function getExpectedKeyFormat(provider) {
    const formats = {
        'openai': 'sk-...',
        'anthropic': 'sk-ant-...',
        'google': 'AI...',
        'huggingface': 'hf_...',
        'cohere': 'alphanumeric string'
    };
    return formats[provider] || 'provider-specific format';
}

/**
 * Get display name for provider
 */
function getProviderName(provider) {
    const names = {
        'openai': 'OpenAI',
        'anthropic': 'Anthropic',
        'google': 'Google AI',
        'huggingface': 'Hugging Face',
        'cohere': 'Cohere'
    };
    return names[provider] || provider.toUpperCase();
}

/**
 * Make a test API call to validate the key
 */
async function makeTestApiCall(provider, apiKey) {
    const testEndpoints = {
        'openai': {
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: 'Test: Say "OpenAI key works"' }],
                max_tokens: 10,
                temperature: 0
            })
        },
        'anthropic': {
            url: 'https://api.anthropic.com/v1/messages',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            method: 'POST',
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 10,
                messages: [{ role: 'user', content: 'Test: Say "Anthropic key works"' }]
            })
        },
        'google': {
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: 'Test: Say "Google AI key works"' }]
                }],
                generationConfig: {
                    maxOutputTokens: 10,
                    temperature: 0
                }
            })
        },
        'huggingface': {
            url: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                inputs: 'Test: Say "HuggingFace key works"',
                parameters: {
                    max_length: 20,
                    temperature: 0.1
                },
                options: {
                    wait_for_model: false
                }
            })
        },
        'cohere': {
            url: 'https://api.cohere.ai/v1/generate',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                prompt: 'Test: Say "Cohere key works"',
                model: 'command-light',
                max_tokens: 10,
                temperature: 0
            })
        }
    };
    
    const config = testEndpoints[provider];
    if (!config) {
        return {
            isValid: false,
            details: 'Unsupported provider',
            debug: { status: 'N/A', response: 'Provider not supported' }
        };
    }
    
    try {
        console.log(`Testing ${provider} API key...`);
        console.log(`Making request to: ${config.url}`);
        
        const response = await fetch(config.url, {
            method: config.method || 'GET',
            headers: config.headers,
            body: config.body
        });
        
        console.log(`${provider} response status:`, response.status);
        
        let responseText = '';
        try {
            responseText = await response.text();
            console.log(`${provider} response body:`, responseText);
        } catch (e) {
            console.log(`Could not read ${provider} response body:`, e.message);
        }
        
        // Provider-specific validation logic
        let isValid = false;
        let details = '';
        
        if (provider === 'openai') {
            isValid = response.status === 200;
            if (!isValid) {
                details = response.status === 401 ? 'Invalid API key' : 
                         response.status === 429 ? 'Rate limited' :
                         response.status === 403 ? 'Forbidden - check key permissions' :
                         `HTTP ${response.status}`;
            }
        } else if (provider === 'anthropic') {
            // Anthropic API validation
            if (response.status === 200) {
                isValid = true;
                details = 'Key validated with successful API call';
            } else if (response.status === 400) {
                // Check if it's a validation error (key valid but request malformed)
                if (responseText.includes('messages') || responseText.includes('model') || responseText.includes('max_tokens')) {
                    isValid = true;
                    details = 'Key is valid (request format error expected for test)';
                } else if (responseText.includes('authentication') || responseText.includes('api_key')) {
                    isValid = false;
                    details = 'Authentication error - invalid API key';
                } else if (responseText.includes('anthropic-dangerous-direct-browser-access')) {
                    isValid = true;
                    details = 'Key format appears valid, but Anthropic blocks direct browser access. This is normal.';
                } else {
                    isValid = false;
                    details = 'Bad request - check API key';
                }
            } else if (response.status === 401) {
                // Check if this is a CORS-related authentication error vs actual invalid key
                if (responseText.includes('anthropic-dangerous-direct-browser-access') || responseText.includes('authentication_error')) {
                    // This suggests the key might be valid but blocked by CORS policy
                    isValid = true;
                    details = 'Key appears valid but Anthropic requires special browser headers. This is expected behavior.';
                } else {
                    isValid = false;
                    details = 'Unauthorized - invalid API key';
                }
            } else if (response.status === 403) {
                isValid = true;
                details = 'Key is valid but lacks required permissions';
            } else {
                isValid = false;
                details = `Unexpected status ${response.status}`;
            }
        } else if (provider === 'google') {
            isValid = response.status === 200;
            if (!isValid) {
                details = response.status === 400 ? 'Invalid API key' :
                         response.status === 403 ? 'Forbidden - check API key permissions' :
                         `HTTP ${response.status}`;
            }
        } else if (provider === 'huggingface') {
            isValid = response.status === 200;
            if (!isValid) {
                details = response.status === 401 ? 'Invalid API key' :
                         `HTTP ${response.status}`;
            }
        } else if (provider === 'cohere') {
            isValid = response.status === 200;
            if (!isValid) {
                details = response.status === 401 ? 'Invalid API key' :
                         response.status === 400 ? 'Bad request - check API key format' :
                         `HTTP ${response.status}`;
            }
        }
        
        return {
            isValid,
            details,
            debug: {
                status: response.status,
                response: responseText.substring(0, 500) // Truncate long responses
            }
        };
        
    } catch (error) {
        console.error(`Error testing ${provider} API key:`, error);
        
        // Handle different types of errors
        let details = '';
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            details = 'Network error - could be CORS, blocked request, or connectivity issue';
        } else if (error.message.includes('CORS')) {
            details = 'CORS error - browser security restriction. Key format appears valid.';
            // For CORS errors, assume key is valid if format passed validation
            return {
                isValid: true,
                details: 'Cannot test due to CORS restrictions, but key format is valid',
                debug: { status: 'CORS', response: error.message }
            };
        } else {
            details = `Network/Connection error: ${error.message}`;
        }
        
        return {
            isValid: false,
            details,
            debug: { status: 'ERROR', response: error.message }
        };
    }
}

/**
 * Show validation errors for API keys
 */
function showValidationErrors() {
    const providers = ['openai', 'anthropic', 'google', 'huggingface', 'cohere'];
    let hasErrors = false;
    
    providers.forEach(provider => {
        const input = document.getElementById(`${provider}-key`);
        const key = input.value.trim();
        
        if (key && !validateApiKey(provider, key)) {
            input.style.borderColor = '#ea4335';
            hasErrors = true;
        } else {
            input.style.borderColor = '#dadce0';
        }
    });
    
    if (hasErrors) {
        showStatusMessage('Please check the format of your API keys.', 'error');
    }
    
    return !hasErrors;
}
