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

// Color palettes for different styles
const colorPalettes = {
    classic: [
        "#3498db", "#e74c3c", "#2ecc71", "#f39c12", 
        "#9b59b6", "#34495e", "#1abc9c", "#e67e22"
    ],
    ocean: [
        "#006994", "#13A8A8", "#52C7B8", "#A4E2C6",
        "#0891b2", "#0e7490", "#155e75", "#164e63"
    ],
    sunset: [
        "#FF6B6B", "#FF8E53", "#FF6B9D", "#C44569",
        "#F8B500", "#FF7675", "#FD79A8", "#E84393"
    ],
    forest: [
        "#27AE60", "#2ECC71", "#58D68D", "#82E0AA",
        "#16A085", "#48C9B0", "#76D7C4", "#A3E4D7"
    ],
    monochrome: [
        "#2C3E50", "#34495E", "#5D6D7E", "#85929E",
        "#ABB2B9", "#CCD1D1", "#D5DBDB", "#EAEDED"
    ]
};

// Current color style index
let currentStyleIndex = 0;
const styleNames = Object.keys(colorPalettes);
let currentColors = colorPalettes[styleNames[currentStyleIndex]];

// Node style variations
const nodeStyles = {
    rounded: { rx: 3, ry: 3 },
    square: { rx: 0, ry: 0 },
    circular: { rx: 15, ry: 15 },
    pill: { rx: 8, ry: 8 }
};

// Current node style index
let currentNodeStyleIndex = 0;
const nodeStyleNames = Object.keys(nodeStyles);
let currentNodeStyle = nodeStyles[nodeStyleNames[currentNodeStyleIndex]];

function getNodeColor(nodeName) {
    const hash = nodeName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    return currentColors[Math.abs(hash) % currentColors.length];
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
    
    // Calculate proportional heights for each layer
    const layerHeights = [];
    let totalDiagramHeight = minDiagramHeight;
    
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
        
        // Calculate spacing needed between nodes to prevent label overlap
        let dynamicPadding = basePadding;
        for (let i = 0; i < layerNodes.length - 1; i++) {
            const currentNodeHeight = layerNodes[i].height;
            const nextNodeHeight = layerNodes[i + 1].height;
            // Ensure there's enough space for labels above nodes
            const requiredPadding = Math.max(basePadding, labelHeight + 4);
            dynamicPadding = Math.max(dynamicPadding, requiredPadding);
        }
        
        // Calculate total height needed for this layer with dynamic padding
        const layerTotalHeight = layerNodes.reduce((sum, node) => sum + node.height, 0) + 
                                (layerNodes.length - 1) * dynamicPadding + labelHeight; // Add space for top labels
        layerHeights[layerIndex] = layerTotalHeight;
    });
    
    // Use the tallest layer to determine diagram height
    const maxLayerHeight = Math.max(...layerHeights);
    const diagramHeight = Math.max(minDiagramHeight, maxLayerHeight + 80); // Add some margin
    
    // Calculate required width
    const diagramWidth = Math.max(400, (numLayers - 1) * layerWidth + nodeWidth + 100);
    
    // Position nodes within each layer with proper spacing
    layers.forEach((layer, layerIndex) => {
        const layerNodes = nodes.filter(d => d.layer === layer);
        const layerTotalHeight = layerHeights[layerIndex];
        
        // Calculate dynamic padding for this layer
        let dynamicPadding = basePadding;
        for (let i = 0; i < layerNodes.length - 1; i++) {
            const requiredPadding = Math.max(basePadding, labelHeight + 4);
            dynamicPadding = Math.max(dynamicPadding, requiredPadding);
        }
        
        // Center the layer vertically
        const layerStartY = (diagramHeight - layerTotalHeight) / 2 + labelHeight + 20;
        
        let currentY = layerStartY;
        layerNodes.forEach((node, nodeIndex) => {
            node.x = layerIndex * layerWidth + 50; // Add left margin
            node.y = currentY;
            node.width = nodeWidth;
            // Height was already calculated above
            
            currentY += node.height + dynamicPadding;
        });
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
                fill: getNodeColor(link.sourceNode.name),
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
            
            // Create rectangle with current node style
            const rect = createSVGElement('rect', {
                width: node.width,
                height: node.height,
                fill: getNodeColor(node.name),
                stroke: '#333',
                'stroke-width': '1',
                rx: currentNodeStyle.rx,
                ry: currentNodeStyle.ry
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

// Function to cycle to the next color style
function cycleToNextColorStyle() {
    currentStyleIndex = (currentStyleIndex + 1) % styleNames.length;
    currentColors = colorPalettes[styleNames[currentStyleIndex]];
    
    console.log(`Switched to color style: ${styleNames[currentStyleIndex]}`);
    
    // Update button text to show current style
    updateColorButton();
}

// Function to cycle to the next node style
function cycleToNextNodeStyle() {
    currentNodeStyleIndex = (currentNodeStyleIndex + 1) % nodeStyleNames.length;
    currentNodeStyle = nodeStyles[nodeStyleNames[currentNodeStyleIndex]];
    
    console.log(`Switched to node style: ${nodeStyleNames[currentNodeStyleIndex]}`);
    
    // Update button text to show current style
    updateNodeStyleButton();
}

// Function to update the color button text
function updateColorButton() {
    const button = document.getElementById('color-btn');
    const currentStyleName = styleNames[currentStyleIndex];
    const nextStyleName = styleNames[(currentStyleIndex + 1) % styleNames.length];
    
    button.textContent = `${nextStyleName.charAt(0).toUpperCase() + nextStyleName.slice(1)} Colors`;
    button.title = `Currently using ${currentStyleName} colors. Click to switch to ${nextStyleName} colors.`;
}

// Function to update the node style button text
function updateNodeStyleButton() {
    const button = document.getElementById('style-btn');
    const currentStyleName = nodeStyleNames[currentNodeStyleIndex];
    const nextStyleName = nodeStyleNames[(currentNodeStyleIndex + 1) % nodeStyleNames.length];
    
    button.textContent = `${nextStyleName.charAt(0).toUpperCase() + nextStyleName.slice(1)} Nodes`;
    button.title = `Currently using ${currentStyleName} node style. Click to switch to ${nextStyleName} nodes.`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('SankeyStone popup loaded - style cycling version');
    
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
        
        // Set initial button text
        updateColorButton();
        updateNodeStyleButton();
        
        // Create initial diagram
        createSankeyDiagram(currentData);
    }).catch(error => {
        console.error('❌ Error during initialization:', error);
        currentData = generateRandomData();
        updateColorButton();
        updateNodeStyleButton();
        createSankeyDiagram(currentData);
    });
    
    // Add event listener for color cycling button
    document.getElementById('color-btn').addEventListener('click', function() {
        console.log('Color cycle button clicked');
        
        // Show loading
        document.getElementById('loading').textContent = 'Applying new colors...';
        document.getElementById('loading').style.display = 'block';
        
        // Cycle to next color style
        cycleToNextColorStyle();
        
        // Regenerate diagram with same data but new colors
        createSankeyDiagram(currentData);
    });
    
    // Add event listener for node style cycling button
    document.getElementById('style-btn').addEventListener('click', function() {
        console.log('Node style cycle button clicked');
        
        // Show loading
        document.getElementById('loading').textContent = 'Applying new node style...';
        document.getElementById('loading').style.display = 'block';
        
        // Cycle to next node style
        cycleToNextNodeStyle();
        
        // Regenerate diagram with same data but new node style
        createSankeyDiagram(currentData);
    });
});

// Export for potential future use
window.SankeyStone = {
    createDiagram: createSankeyDiagram,
    generateRandomData: generateRandomData,
    currentData: () => currentData
};
