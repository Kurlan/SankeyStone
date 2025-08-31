/**
 * SankeyStone Content Script
 * This script extracts Sankey diagram data from the current webpage.
 */

// Function to extract JSON Sankey data
function extractSankeyJsonData() {
    try {
        console.log('🔍 Looking for JSON Sankey data...');
        
        // Look for the JSON data in a script tag with id="sankey-data"
        const sankeyDataElement = document.getElementById('sankey-data');
        if (sankeyDataElement) {
            console.log('✅ Found #sankey-data element');
            const jsonData = JSON.parse(sankeyDataElement.textContent.trim());
            console.log('✅ Successfully parsed Sankey JSON data:', jsonData);
            return jsonData;
        } else {
            console.log('❌ No #sankey-data element found');
        }
        
        // If there's no explicit JSON element, try to find JSON in other script tags
        const scriptTags = document.querySelectorAll('script[type="application/json"]');
        console.log(`🔍 Found ${scriptTags.length} JSON script tags`);
        
        for (const script of scriptTags) {
            try {
                const data = JSON.parse(script.textContent.trim());
                if (data.nodes && data.links) {
                    console.log('✅ Found Sankey data in script tag:', data);
                    return data;
                }
            } catch (e) {
                // Skip this script tag if it doesn't contain valid JSON
                console.debug('⚠️ Script tag contains invalid JSON:', e);
            }
        }
        
        console.log('❌ No valid Sankey JSON data found');
        return null;
    } catch (error) {
        console.error('❌ Error extracting JSON Sankey data:', error);
        return null;
    }
}

// Function to extract Sankey data from HTML tables
function extractSankeyTableData() {
    try {
        // Check if tables with Sankey layer attributes exist
        const tables = document.querySelectorAll('table[data-sankey-layer]');
        if (tables.length === 0) {
            return null;
        }
        
        // Create structure for nodes and links
        const nodes = [];
        const links = [];
        const nodeMap = new Map(); // Maps node IDs to their positions in the nodes array
        let nodeCount = 0;
        
        // Process each table to extract nodes
        tables.forEach(table => {
            const layer = parseInt(table.getAttribute('data-sankey-layer'), 10);
            const rows = table.querySelectorAll('tbody tr[data-node-id]');
            
            rows.forEach(row => {
                const nodeId = parseInt(row.getAttribute('data-node-id'), 10);
                const cells = row.querySelectorAll('td');
                
                if (cells.length >= 2) {
                    const name = cells[0].textContent.trim();
                    const value = parseInt(cells[1].textContent.replace(/,/g, ''), 10) || 0;
                    
                    nodes.push({
                        id: nodeId,
                        name: name,
                        layer: layer,
                        value: value
                    });
                    
                    nodeMap.set(nodeId, nodeCount++);
                }
            });
        });
        
        // Since the HTML table doesn't explicitly define links, we'll create reasonable defaults
        // based on common patterns: each node in layer N connects to all nodes in layer N+1
        const layerNodes = new Map(); // Groups nodes by layer
        
        nodes.forEach(node => {
            if (!layerNodes.has(node.layer)) {
                layerNodes.set(node.layer, []);
            }
            layerNodes.get(node.layer).push(node);
        });
        
        // Get all unique layers and sort them
        const layers = [...layerNodes.keys()].sort();
        
        // For each layer (except the last), connect nodes to the next layer
        for (let i = 0; i < layers.length - 1; i++) {
            const sourceLayer = layers[i];
            const targetLayer = layers[i + 1];
            
            const sourceNodes = layerNodes.get(sourceLayer);
            const targetNodes = layerNodes.get(targetLayer);
            
            // Create links based on a proportional distribution
            sourceNodes.forEach(sourceNode => {
                const sourceTotal = sourceNode.value;
                let remainingValue = sourceTotal;
                const targetCount = targetNodes.length;
                
                // Last target gets remainder to ensure total matches
                targetNodes.forEach((targetNode, idx) => {
                    // Calculate proportional value (except for last link)
                    let linkValue;
                    if (idx === targetCount - 1) {
                        linkValue = remainingValue;
                    } else {
                        // Each target gets a proportion based on its relative size
                        const proportion = targetNode.value / targetNodes.reduce((sum, node) => sum + node.value, 0);
                        linkValue = Math.round(sourceTotal * proportion);
                        remainingValue -= linkValue;
                    }
                    
                    // Add link if it has a value
                    if (linkValue > 0) {
                        links.push({
                            source: sourceNode.id,
                            target: targetNode.id,
                            value: linkValue
                        });
                    }
                });
            });
        }
        
        const result = { nodes, links };
        console.log('Extracted Sankey data from tables:', result);
        return result;
    } catch (error) {
        console.error('Error extracting table Sankey data:', error);
        return null;
    }
}

// Function to extract page context for LLM analysis
function extractPageContext() {
    try {
        console.log('🔍 Extracting page context for LLM analysis...');
        
        // Extract page title
        const title = document.title || 'Untitled Page';
        
        // Extract main headings
        const headings = [];
        const headingSelectors = ['h1', 'h2', 'h3'];
        headingSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const text = el.textContent.trim();
                if (text && text.length < 200) { // Avoid very long headings
                    headings.push(text);
                }
            });
        });
        
        // Extract main text content (paragraphs, divs with substantial text)
        let content = '';
        const contentSelectors = ['p', 'div', 'article', 'section', 'main'];
        contentSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const text = el.textContent.trim();
                // Only include elements with substantial text content
                if (text && text.length > 20 && text.length < 500) {
                    content += text + ' ';
                }
            });
        });
        
        // Extract table data
        const tables = [];
        const tableElements = document.querySelectorAll('table');
        tableElements.forEach(table => {
            const rows = table.querySelectorAll('tr');
            if (rows.length > 1 && rows.length < 20) { // Reasonable table size
                let tableText = '';
                rows.forEach((row, idx) => {
                    if (idx < 10) { // Limit rows to avoid too much data
                        const cells = row.querySelectorAll('td, th');
                        const rowText = Array.from(cells).map(cell => cell.textContent.trim()).join(' | ');
                        if (rowText) {
                            tableText += rowText + '\n';
                        }
                    }
                });
                if (tableText) {
                    tables.push(tableText.trim());
                }
            }
        });
        
        // Extract list data
        const lists = [];
        const listElements = document.querySelectorAll('ul, ol');
        listElements.forEach(list => {
            const items = list.querySelectorAll('li');
            if (items.length > 1 && items.length < 15) { // Reasonable list size
                const listText = Array.from(items).map(item => item.textContent.trim()).join(', ');
                if (listText && listText.length < 500) {
                    lists.push(listText);
                }
            }
        });
        
        const pageContext = {
            title: title,
            url: window.location.href,
            headings: headings.slice(0, 10), // Limit to first 10 headings
            content: content.substring(0, 3000), // Limit content length
            tables: tables.slice(0, 5), // Limit to first 5 tables
            lists: lists.slice(0, 5) // Limit to first 5 lists
        };
        
        console.log('✅ Extracted page context:', pageContext);
        return pageContext;
        
    } catch (error) {
        console.error('❌ Error extracting page context:', error);
        return null;
    }
}

// Function to respond to messages from the extension popup
function handleMessage(request, sender, sendResponse) {
    console.log('🔍 Content Script: Received message from popup:', request);
    console.log('🔍 Content Script: Current URL:', window.location.href);
    console.log('🔍 Content Script: Document ready state:', document.readyState);
    
    if (request.action === 'getSankeyData') {
        console.log('📊 Content Script: Starting to extract Sankey data...');
        
        // First try to extract JSON data, then fall back to table data
        console.log('🔍 Content Script: Trying JSON extraction...');
        const jsonData = extractSankeyJsonData();
        if (jsonData) {
            console.log('✅ Content Script: Successfully extracted JSON data:', jsonData);
            sendResponse({ success: true, data: jsonData });
            return;
        }
        console.log('❌ Content Script: No JSON data found');
        
        console.log('🔍 Content Script: Trying table extraction...');
        const tableData = extractSankeyTableData();
        if (tableData) {
            console.log('✅ Content Script: Successfully extracted table data:', tableData);
            sendResponse({ success: true, data: tableData });
            return;
        }
        console.log('❌ Content Script: No table data found');
        
        // If no data found, send error
        console.log('❌ Content Script: No Sankey data found on this page');
        sendResponse({ 
            success: false, 
            error: 'No Sankey data found on this page' 
        });
    } else if (request.action === 'getPageContext') {
        console.log('🔍 Content Script: Extracting page context...');
        const pageContext = extractPageContext();
        if (pageContext) {
            console.log('✅ Content Script: Successfully extracted page context');
            sendResponse({ success: true, data: pageContext });
        } else {
            console.log('❌ Content Script: Failed to extract page context');
            sendResponse({ success: false, error: 'Failed to extract page context' });
        }
    } else {
        console.log('❓ Content Script: Unknown action:', request.action);
        sendResponse({ success: false, error: 'Unknown action' });
    }
}

// Set up message listener when content script loads
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleMessage(request, sender, sendResponse);
    return true; // Keep the message channel open for async response
});

// Log when the content script loads
console.log('SankeyStone content script loaded.');
