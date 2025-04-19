// Check authentication
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin/login.html';
    }
    return token;
}

// Fetch and display chat history
async function loadChatHistory() {
    try {
        const response = await fetch('/api/chat/history', {
            headers: {
                'Authorization': `Bearer ${checkAuth()}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load chat history');
        
        const messages = await response.json();
        const chatHistory = document.getElementById('chat-history');
        
        chatHistory.innerHTML = messages.map(msg => `
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex justify-between items-start">
                    <p class="font-medium">${msg.sender.username}</p>
                    <span class="text-sm text-gray-500">${new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <p class="mt-2">${msg.content}</p>
                ${msg.attachments?.length ? `
                    <div class="mt-2 flex gap-2">
                        ${msg.attachments.map(att => `
                            <a href="${att.path}" class="text-blue-500 hover:underline" target="_blank">
                                ${att.filename}
                            </a>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

// Load analytics
async function loadAnalytics() {
    try {
        const response = await fetch('/api/chat/analytics', {
            headers: {
                'Authorization': `Bearer ${checkAuth()}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load analytics');
        
        const data = await response.json();
        document.getElementById('total-chats').textContent = data.totalChats;
        document.getElementById('response-rate').textContent = `${data.responseRate}%`;
        document.getElementById('avg-response-time').textContent = `${data.avgResponseTime}m`;
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadChatHistory();
    loadAnalytics();
    
    // Logout handler
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login.html';
    });
});
