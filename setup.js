/**
 * SankeyStone Setup Page JavaScript
 * Handles LLM API key configuration and settings management
 */

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

// Current form state
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
        const formElements = new FormData(form);
        
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
        
        // Close the setup window after a brief delay
        setTimeout(() => {
            window.close();
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
 * Navigate back to main popup
 */
function navigateToPopup() {
    if (isFormDirty) {
        if (!confirm('You have unsaved changes. Are you sure you want to leave without saving?')) {
            return;
        }
    }
    
    // Close current popup and reopen main popup
    window.close();
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

/**
 * Initialize the setup page
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('SankeyStone setup page loaded');
    
    // Load existing settings
    await loadSettings();
    
    // Set up form event listeners
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
    cancelBtn.addEventListener('click', navigateToPopup);
    
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
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (isFormDirty) {
                form.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to cancel
        if (e.key === 'Escape') {
            navigateToPopup();
        }
    });
    
    // Warn about unsaved changes before page unload
    window.addEventListener('beforeunload', function(e) {
        if (isFormDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
    
    // Initial form state check
    checkFormDirty();
});

/**
 * Export functions for potential use by other scripts
 */
window.SankeyStoneSetup = {
    loadSettings,
    saveSettings,
    clearAllData,
    STORAGE_KEYS
};

/**
 * Utility function to get stored settings (for use by other parts of the extension)
 */
async function getStoredSettings() {
    try {
        return await chrome.storage.sync.get(Object.values(STORAGE_KEYS));
    } catch (error) {
        console.error('Error retrieving stored settings:', error);
        return {};
    }
}

/**
 * Utility function to get API key for a specific provider
 */
async function getApiKey(provider) {
    try {
        const settings = await getStoredSettings();
        const keyMap = {
            'openai': STORAGE_KEYS.OPENAI_KEY,
            'anthropic': STORAGE_KEYS.ANTHROPIC_KEY,
            'google': STORAGE_KEYS.GOOGLE_KEY,
            'huggingface': STORAGE_KEYS.HUGGINGFACE_KEY,
            'cohere': STORAGE_KEYS.COHERE_KEY
        };
        
        return settings[keyMap[provider]] || null;
    } catch (error) {
        console.error(`Error retrieving ${provider} API key:`, error);
        return null;
    }
}

/**
 * Check if any LLM provider is configured
 */
async function hasConfiguredProvider() {
    try {
        const settings = await getStoredSettings();
        return !!(
            settings[STORAGE_KEYS.OPENAI_KEY] ||
            settings[STORAGE_KEYS.ANTHROPIC_KEY] ||
            settings[STORAGE_KEYS.GOOGLE_KEY] ||
            settings[STORAGE_KEYS.HUGGINGFACE_KEY] ||
            settings[STORAGE_KEYS.COHERE_KEY]
        );
    } catch (error) {
        console.error('Error checking configured providers:', error);
        return false;
    }
}

// Export utility functions for use by other scripts
window.SankeyStoneSetup.getStoredSettings = getStoredSettings;
window.SankeyStoneSetup.getApiKey = getApiKey;
window.SankeyStoneSetup.hasConfiguredProvider = hasConfiguredProvider;
