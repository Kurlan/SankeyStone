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

// Color palette
const colors = [
    "#3498db", "#e74c3c", "#2ecc71", "#f39c12", 
    "#9b59b6", "#34495e", "#1abc9c", "#e67e22"
];

function getNodeColor(nodeName) {
    const hash = nodeName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
}

// Create SVG elements using vanilla JavaScript
function createSVGElement(tag, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.keys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key]);
    });
    return element;
}

// Calculate layout for Sankey diagram
function calculateSankeyLayout(data) {
    const nodes = data.nodes.map(d => ({ ...d }));
    const links = data.links.map(d => ({ ...d }));
    
    // Layout parameters
    const nodeWidth = 30;
    const nodePadding = 30;
    const layerWidth = 180;
    const diagramHeight = 280;
    
    // Group nodes by layer
    const layers = [...new Set(nodes.map(d => d.layer))].sort();
    
    layers.forEach((layer, layerIndex) => {
        const layerNodes = nodes.filter(d => d.layer === layer);
        const nodeHeight = (diagramHeight - (layerNodes.length - 1) * nodePadding) / layerNodes.length;
        
        layerNodes.forEach((node, nodeIndex) => {
            node.x = layerIndex * layerWidth + 20;
            node.y = nodeIndex * (nodeHeight + nodePadding) + 20;
            node.width = nodeWidth;
            node.height = Math.max(nodeHeight, 40);
            
            // Calculate node values
            const incomingValue = links
                .filter(l => l.target === node.id)
                .reduce((sum, l) => sum + l.value, 0);
            const outgoingValue = links
                .filter(l => l.source === node.id)
                .reduce((sum, l) => sum + l.value, 0);
            
            node.value = Math.max(incomingValue, outgoingValue) || 0;
        });
    });
    
    // Calculate link paths
    links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        
        link.sourceNode = sourceNode;
        link.targetNode = targetNode;
        
        // Simple curved path
        const x1 = sourceNode.x + sourceNode.width;
        const y1 = sourceNode.y + sourceNode.height / 2;
        const x2 = targetNode.x;
        const y2 = targetNode.y + targetNode.height / 2;
        const cx = (x1 + x2) / 2;
        
        link.path = `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`;
    });
    
    return { nodes, links };
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
        
        // Set SVG dimensions
        svg.setAttribute('width', '568');
        svg.setAttribute('height', '350');
        svg.setAttribute('viewBox', '0 0 568 350');
        
        // Calculate layout
        const graph = calculateSankeyLayout(data);
        
        console.log('Layout calculated:', graph);
        
        // Find max value for stroke width scaling
        const maxValue = Math.max(...graph.links.map(l => l.value));
        
        // Create links
        graph.links.forEach(link => {
            const path = createSVGElement('path', {
                d: link.path,
                stroke: getNodeColor(link.sourceNode.name),
                'stroke-width': Math.max(2, (link.value / maxValue) * 15),
                'stroke-opacity': '0.6',
                fill: 'none',
                class: 'sankey-link'
            });
            
            // Add hover effect
            path.addEventListener('mouseover', function() {
                this.setAttribute('stroke-opacity', '0.8');
            });
            path.addEventListener('mouseout', function() {
                this.setAttribute('stroke-opacity', '0.6');
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
            
            // Create rectangle
            const rect = createSVGElement('rect', {
                width: node.width,
                height: node.height,
                fill: getNodeColor(node.name),
                stroke: '#333',
                'stroke-width': '1',
                rx: '3'
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
        
        console.log('Pure JavaScript Sankey diagram created successfully');
        
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

// Function to update the regenerate button text and state
function updateRegenerateButton(hasPageData) {
    const button = document.getElementById('regenerate-btn');
    if (hasPageData) {
        button.textContent = 'Refresh from Page';
        button.title = 'Extract fresh data from the current webpage';
    } else {
        button.textContent = 'Generate Random';
        button.title = 'Generate new random data (no page data found)';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('SankeyStone popup loaded - webpage data extraction version');
    
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
            updateRegenerateButton(true);
        } else {
            // Fall back to random data
            console.log('❌ No page data found, using random data');
            currentData = generateRandomData();
            updateRegenerateButton(false);
        }
        
        // Create initial diagram
        createSankeyDiagram(currentData);
    }).catch(error => {
        console.error('❌ Error during initialization:', error);
        currentData = generateRandomData();
        updateRegenerateButton(false);
        createSankeyDiagram(currentData);
    });
    
    // Add event listener for regenerate button
    document.getElementById('regenerate-btn').addEventListener('click', function() {
        console.log('Regenerate button clicked');
        
        // Show loading
        document.getElementById('loading').textContent = 'Refreshing data...';
        document.getElementById('loading').style.display = 'block';
        
        // Try to get fresh data from page
        getPageData().then(freshPageData => {
            if (freshPageData) {
                console.log('Using fresh data from webpage');
                currentData = freshPageData;
                updateRegenerateButton(true);
            } else {
                console.log('No page data found, generating new random data');
                currentData = generateRandomData();
                updateRegenerateButton(false);
            }
            
            // Create diagram with new data
            createSankeyDiagram(currentData);
        }).catch(error => {
            console.error('Error during regeneration:', error);
            currentData = generateRandomData();
            updateRegenerateButton(false);
            createSankeyDiagram(currentData);
        });
    });
});

// Export for potential future use
window.SankeyStone = {
    createDiagram: createSankeyDiagram,
    generateRandomData: generateRandomData,
    currentData: () => currentData
};
