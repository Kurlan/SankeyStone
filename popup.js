// Dummy data for the Sankey diagram
const dummyData = {
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
    links: [
        { source: 0, target: 3, value: 2500 }, // Search Engines -> Landing Page
        { source: 0, target: 4, value: 1800 }, // Search Engines -> Product Page
        { source: 1, target: 3, value: 1200 }, // Social Media -> Landing Page
        { source: 1, target: 5, value: 800 },  // Social Media -> About Page
        { source: 2, target: 4, value: 1500 }, // Direct -> Product Page
        { source: 2, target: 5, value: 600 },  // Direct -> About Page
        { source: 3, target: 6, value: 1200 }, // Landing Page -> Conversion
        { source: 3, target: 7, value: 2500 }, // Landing Page -> Bounce
        { source: 4, target: 6, value: 2100 }, // Product Page -> Conversion
        { source: 4, target: 7, value: 1200 }, // Product Page -> Bounce
        { source: 5, target: 6, value: 400 },  // About Page -> Conversion
        { source: 5, target: 7, value: 1000 }  // About Page -> Bounce
    ]
};

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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('SankeyStone popup loaded - pure JavaScript version');
    
    // Create initial diagram immediately
    createSankeyDiagram(dummyData);
    
    // Add event listener for regenerate button
    document.getElementById('regenerate-btn').addEventListener('click', function() {
        console.log('Regenerating diagram...');
        createSankeyDiagram(dummyData);
    });
});

// Export for potential future use
window.SankeyStone = {
    createDiagram: createSankeyDiagram,
    dummyData: dummyData
};
