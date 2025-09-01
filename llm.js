/**
 * SankeyStone LLM Integration Module
 * Handles API calls to Claude for generating diagram names and data based on page context
 */

// Storage keys - using the global STORAGE_KEYS from popup.js

/**
 * Check if LLM integration is available and enabled
 */
async function isLLMAvailable() {
    try {
        const stored = await chrome.storage.sync.get([
            STORAGE_KEYS.ANTHROPIC_KEY, 
            STORAGE_KEYS.AUTO_ANALYZE
        ]);
        
        const hasKey = stored[STORAGE_KEYS.ANTHROPIC_KEY] && stored[STORAGE_KEYS.ANTHROPIC_KEY].trim();
        const isEnabled = stored[STORAGE_KEYS.AUTO_ANALYZE] === true;
        
        return hasKey && isEnabled;
    } catch (error) {
        console.error('Error checking LLM availability:', error);
        return false;
    }
}

/**
 * Get the stored Claude API key
 */
async function getClaudeApiKey() {
    try {
        const stored = await chrome.storage.sync.get([STORAGE_KEYS.ANTHROPIC_KEY]);
        return stored[STORAGE_KEYS.ANTHROPIC_KEY] || null;
    } catch (error) {
        console.error('Error getting Claude API key:', error);
        return null;
    }
}

/**
 * Create a prompt for Claude to analyze page context and generate Sankey diagram data
 */
function createSankeyPrompt(pageContext) {
    const truncationNote = pageContext.truncated ? 
        `\n\nNOTE: The page content below has been truncated to ${pageContext.fullPageContent.length.toLocaleString()} characters from the original ${pageContext.contentLength.toLocaleString()} characters due to API limits.` : '';
    
    return `You are an expert data analyst specializing in creating Sankey diagrams from web page content. 

Please analyze the COMPLETE page content below and create a Sankey diagram that represents the most meaningful flow or process described on this page. The entire page content is provided, including all tables, lists, and text.

PAGE INFORMATION:
================
Title: ${pageContext.title}
URL: ${pageContext.url}${truncationNote}

FULL PAGE CONTENT:
==================
${pageContext.fullPageContent}

REQUIREMENTS:
=============
1. Analyze the ENTIRE page content above - look for any tables, data, processes, flows, or relationships
2. Identify the most meaningful flow or process that can be represented as a Sankey diagram
3. Generate a descriptive title for the diagram that captures the main flow/process
4. Create nodes representing the key stages, categories, or entities in the flow
5. Create links showing how items/volume flows between these nodes
6. Use realistic values that make sense for the context (extract actual numbers from tables/content when possible)
7. Organize nodes into logical layers (0 = sources, 1 = middle stages, 2 = outcomes, etc.)
8. If multiple data sources or processes are present, choose the most significant one or create a comprehensive diagram
9. Ensure the diagram tells a coherent story about the page content
10. **CRITICAL**: Determine what units the data represents (dollars, visitors, customers, units sold, etc.) and specify this clearly

IMPORTANT: Look for tables, charts, statistics, processes, workflows, or any quantitative data that could be visualized as flows.

UNITS IDENTIFICATION:
====================
Carefully analyze the data to determine what the numbers represent. Common examples:
- Financial data: dollars, revenue, costs, profits
- Website analytics: visitors, page views, sessions, clicks
- E-commerce: customers, orders, products sold, transactions
- Manufacturing: units produced, materials, components
- Healthcare: patients, treatments, procedures
- Education: students, enrollments, courses

RESPONSE FORMAT:
===============
Respond with ONLY a valid JSON object in this exact format (no markdown, no extra text):

{
  "title": "Descriptive diagram title (WITHOUT units - units will be added separately)",
  "units": {
    "singular": "dollar",
    "plural": "dollars",
    "type": "currency"
  },
  "nodes": [
    {
      "id": 0,
      "name": "Node Name",
      "layer": 0
    }
  ],
  "links": [
    {
      "source": 0,
      "target": 1,
      "value": 100
    }
  ],
  "confidence": 0.8,
  "reasoning": "Brief explanation of why this diagram represents the page content, what data sources were used, and what the units represent"
}

UNIT EXAMPLES:
- Currency: {"singular": "dollar", "plural": "dollars", "type": "currency"}
- Traffic: {"singular": "visitor", "plural": "visitors", "type": "people"}
- E-commerce: {"singular": "customer", "plural": "customers", "type": "people"}
- Manufacturing: {"singular": "unit", "plural": "units", "type": "items"}
- Transactions: {"singular": "transaction", "plural": "transactions", "type": "events"}

Ensure all node IDs are unique integers starting from 0, and all link source/target IDs reference existing nodes.`;
}

/**
 * Call Claude API to generate Sankey diagram data
 */
async function callClaudeAPI(pageContext) {
    const startTime = Date.now();
    
    const apiKey = await getClaudeApiKey();
    if (!apiKey) {
        // Log the error for debugging
        if (typeof logSystemEvent === 'function') {
            logSystemEvent('Claude API call failed: No API key available');
        }
        throw new Error('No Claude API key available');
    }

    const prompt = createSankeyPrompt(pageContext);
    
    const requestBody = {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.3,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ]
    };

    console.log('🤖 Calling Claude API...');
    
    // Log the request for debugging
    if (typeof logLLMRequest === 'function') {
        logLLMRequest('anthropic', {
            url: 'https://api.anthropic.com/v1/messages',
            method: 'POST',
            headers: {
                'x-api-key': '[REDACTED]',
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify(requestBody)
        });
    }
    
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify(requestBody)
        });

        const duration = Date.now() - startTime;
        console.log('🤖 Claude API response status:', response.status);
        
        // Log the response for debugging
        if (typeof logLLMResponse === 'function') {
            logLLMResponse('anthropic', response, duration);
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('🤖 Claude API error:', errorText);
            throw new Error(`Claude API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('🤖 Claude API response:', result);

        // Extract the content from Claude's response
        if (result.content && result.content[0] && result.content[0].text) {
            const responseText = result.content[0].text.trim();
            
            // Try to parse the JSON response
            try {
                const diagramData = JSON.parse(responseText);
                
                // Validate the response has required fields
                if (!diagramData.title || !diagramData.nodes || !diagramData.links) {
                    throw new Error('Invalid response format: missing required fields');
                }
                
                // Validate nodes and links structure
                if (!Array.isArray(diagramData.nodes) || !Array.isArray(diagramData.links)) {
                    throw new Error('Invalid response format: nodes and links must be arrays');
                }
                
                console.log('✅ Successfully parsed Claude response:', diagramData);
                return diagramData;
                
            } catch (parseError) {
                console.error('🤖 Error parsing Claude response JSON:', parseError);
                console.error('🤖 Raw response text:', responseText);
                throw new Error('Failed to parse Claude response as JSON');
            }
        } else {
            throw new Error('No content in Claude response');
        }
        
    } catch (error) {
        console.error('🤖 Error calling Claude API:', error);
        throw error;
    }
}

/**
 * Generate Sankey diagram data using LLM based on page context
 */
async function generateSankeyWithLLM(pageContext) {
    try {
        console.log('🤖 Starting LLM-based Sankey generation...');
        
        // Enhanced logging for full page content transmission
        console.log('🤖 LLM Analysis - FULL PAGE Content Summary:');
        console.log(`   - Title: ${pageContext?.title || 'N/A'}`);
        console.log(`   - URL: ${pageContext?.url || 'N/A'}`);
        console.log(`   - Original page length: ${pageContext?.contentLength?.toLocaleString() || 0} characters`);
        console.log(`   - Content sent to LLM: ${pageContext?.fullPageContent?.length?.toLocaleString() || 0} characters`);
        console.log(`   - Content truncated: ${pageContext?.truncated ? 'YES' : 'NO'}`);
        
        if (pageContext?.truncated) {
            const percentageSent = ((pageContext.fullPageContent.length / pageContext.contentLength) * 100).toFixed(1);
            console.log(`   - Sending ${percentageSent}% of original content to LLM`);
        }
        
        console.log('🤖 Full page content includes ALL tables, lists, and text automatically');
        
        // Log system event for debugging
        if (typeof logSystemEvent === 'function') {
            logSystemEvent('Starting LLM-based Sankey generation with full page content', {
                pageTitle: pageContext?.title,
                originalContentLength: pageContext?.contentLength || 0,
                sentContentLength: pageContext?.fullPageContent?.length || 0,
                truncated: pageContext?.truncated || false
            });
        }
        
        // Check if LLM is available
        if (!(await isLLMAvailable())) {
            console.log('🤖 LLM not available or disabled');
            
            // Log availability check result
            if (typeof logSystemEvent === 'function') {
                logSystemEvent('LLM not available or disabled - skipping generation');
            }
            
            return null;
        }
        
        // Call Claude API
        const result = await callClaudeAPI(pageContext);
        
        console.log('🤖 LLM generated Sankey data:', result);
        
        // Log the result for debugging
        if (typeof logLLMResult === 'function') {
            logLLMResult('anthropic', result, 'generate_diagram');
        }
        
        return result;
        
    } catch (error) {
        console.error('🤖 Error generating Sankey with LLM:', error);
        
        // Log the error for debugging
        if (typeof logLLMResult === 'function') {
            logLLMResult('anthropic', { error: error.message }, 'generate_diagram');
        }
        
        return null;
    }
}

// Export functions for use in other scripts
window.LLMIntegration = {
    isLLMAvailable,
    generateSankeyWithLLM,
    callClaudeAPI
};
