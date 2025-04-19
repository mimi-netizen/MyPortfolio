// Menu toggle function
function toggleMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  
  if (mobileMenu.classList.contains('-translate-y-full')) {
    mobileMenu.classList.remove('-translate-y-full');
    hamburgerIcon.classList.add('open');
  } else {
    mobileMenu.classList.add('-translate-y-full');
    hamburgerIcon.classList.remove('open');
  }
}

// Update theme toggle function
function toggleTheme() {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

// Enhanced project filtering
function filterProjects(category) {
  const projects = document.querySelectorAll('.project-container');
  const buttons = document.querySelectorAll('.filter-btn');
  
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  projects.forEach(project => {
    const projectCategory = project.dataset.category;
    if (category === 'all' || projectCategory === category) {
      project.style.opacity = '1';
      project.style.transform = 'scale(1)';
      project.style.display = 'block';
    } else {
      project.style.opacity = '0';
      project.style.transform = 'scale(0.8)';
      setTimeout(() => {
        project.style.display = 'none';
      }, 300);
    }
  });
}

// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-in-out',
    anchorPlacement: 'top-bottom',
    disable: 'mobile'
  });
  
  // Add custom animation for skill bars
  const skillBars = document.querySelectorAll('[data-aos="width"]');
  skillBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = width;
      bar.style.transition = 'width 1s ease-in-out';
    }, 200);
  });

  // Check for saved theme preference or use system preference
  const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || (!savedTheme && darkModePreference.matches)) {
    document.documentElement.classList.add('dark');
  }

  // Set initial theme
  const initialTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', initialTheme);
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
});

// Contact form handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  
  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      alert('Thanks for your message! I\'ll get back to you soon.');
      form.reset();
    } else {
      throw new Error('Oops! There was a problem sending your message.');
    }
  })
  .catch(error => {
    alert(error.message);
  });
});

// Update footer year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Newsletter form handling
document.getElementById('newsletter-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  alert(`Thank you for subscribing with: ${email}`);
  this.reset();
});

// Back to top button
window.addEventListener('scroll', function() {
  const backToTop = document.getElementById('back-to-top');
  if (window.scrollY > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Chat Widget functionality
const chatToggle = document.getElementById('chat-toggle');
const chatPanel = document.getElementById('chat-panel');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

chatToggle.addEventListener('click', () => {
  const isOpen = chatPanel.classList.contains('hidden');
  chatPanel.classList.toggle('hidden');
  chatToggle.querySelector('.open-icon').classList.toggle('hidden');
  chatToggle.querySelector('.close-icon').classList.toggle('hidden');
  
  if (isOpen) {
    chatInput.focus();
  }
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  
  if (message) {
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Simulate response after 1 second
    setTimeout(() => {
      addMessage("Thanks for your message! I'll get back to you soon.", 'bot');
    }, 1000);
  }
});

function addMessage(text, sender, attachments = [], timestamp = null) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex flex-col';
  
  const bubble = document.createElement('div');
  bubble.className = sender === 'user' 
    ? 'bg-blue-500 text-white rounded-lg p-3 max-w-[80%] self-end space-y-2'
    : 'bg-blue-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%] self-start space-y-2';
  
  bubble.innerHTML = `
    <p class="text-sm">${text}</p>
    ${attachments.map(att => `
      <div class="flex items-center gap-2 text-sm">
        <a href="${att.path}" target="_blank" class="underline hover:no-underline">
          ${att.filename}
        </a>
      </div>
    `).join('')}
  `;
  
  if (timestamp) {
    const time = new Date(timestamp).toLocaleTimeString();
    bubble.innerHTML += `<div class="text-xs text-gray-500 mt-1">${time}</div>`;
  }
  
  messageDiv.appendChild(bubble);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Enhanced Chat Widget with WebSocket
const ws = new WebSocket('ws://localhost:5000');
let isTyping = false;
let typingTimeout;

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === 'typing') {
    showTypingIndicator();
  } else if (message.type === 'message') {
    addMessage(message.text, 'bot');
  }
};

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.innerHTML = `
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  `;
  chatMessages.appendChild(typingDiv);
}

// Enhanced message handling with file attachments
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  const fileInput = document.getElementById('chat-file');
  const file = fileInput.files[0];
  
  if (message || file) {
    const formData = new FormData();
    if (message) formData.append('message', message);
    if (file) formData.append('file', file);
    
    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      addMessage(data.message, 'user');
      chatInput.value = '';
      fileInput.value = '';
      
      ws.send(JSON.stringify({ type: 'message', text: message }));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
});

// Typing indicator
chatInput.addEventListener('input', () => {
  if (!isTyping) {
    isTyping = true;
    ws.send(JSON.stringify({ type: 'typing' }));
  }
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    isTyping = false;
  }, 1000);
});

// Typing Animation
function typeText(element, text, speed = 100) {
  let index = 0;
  element.innerHTML = '';
  element.classList.add('typing-text');
  
  function type() {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else {
      element.classList.remove('typing-text');
    }
  }
  
  type();
}

// Scroll Progress
window.addEventListener('scroll', () => {
  const scrollProgress = document.querySelector('.scroll-progress');
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  scrollProgress.style.setProperty('--scroll', `${scrolled}%`);
});

// Custom Cursor
document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.addEventListener('mousedown', () => cursor.classList.add('active'));
  document.addEventListener('mouseup', () => cursor.classList.remove('active'));
});

// Enhanced Skill Bars Animation
const observeSkills = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-progress');
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-progress').forEach(bar => {
  observeSkills.observe(bar);
});

// Initialize typing animation
document.addEventListener('DOMContentLoaded', () => {
  const titleElement = document.querySelector('.section__text__p2');
  typeText(titleElement, 'Frontend Developer');
});

// File handling functions
const fileInput = document.getElementById('chat-file');
const filePreview = document.getElementById('file-preview');
const fileName = document.getElementById('file-name');

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    fileName.textContent = file.name;
    filePreview.classList.remove('hidden');
  }
});

function removeFile() {
  fileInput.value = '';
  filePreview.classList.add('hidden');
}

// Update chat form submission
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  const file = fileInput.files[0];
  
  if (message || file) {
    const formData = new FormData();
    if (message) formData.append('message', message);
    if (file) formData.append('file', file);
    
    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        addMessage(data.content, 'user', data.attachments);
        chatInput.value = '';
        removeFile();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
});

// Update message display to handle attachments
function addMessage(text, sender, attachments = [], timestamp = null) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex flex-col';
  
  const bubble = document.createElement('div');
  bubble.className = sender === 'user' 
    ? 'bg-blue-500 text-white rounded-lg p-3 max-w-[80%] self-end space-y-2'
    : 'bg-blue-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%] self-start space-y-2';
  
  bubble.innerHTML = `
    <p class="text-sm">${text}</p>
    ${attachments.map(att => `
      <div class="flex items-center gap-2 text-sm">
        <a href="${att.path}" target="_blank" class="underline hover:no-underline">
          ${att.filename}
        </a>
      </div>
    `).join('')}
  `;
  
  if (timestamp) {
    const time = new Date(timestamp).toLocaleTimeString();
    bubble.innerHTML += `<div class="text-xs text-gray-500 mt-1">${time}</div>`;
  }
  
  messageDiv.appendChild(bubble);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Enhanced WebSocket connection with authentication
function connectWebSocket() {
  const token = localStorage.getItem('token');
  const ws = new WebSocket(`ws://localhost:5000?token=${token}`);
  
  ws.onopen = () => {
    console.log('WebSocket Connected');
    loadChatHistory();
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleWebSocketMessage(data);
  };
  
  ws.onclose = () => {
    console.log('WebSocket Disconnected');
    setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
  };
  
  return ws;
}

function handleWebSocketMessage(data) {
  switch (data.type) {
    case 'typing':
      showTypingIndicator(data.userId);
      break;
    case 'message':
      addMessage(data.message.content, 'bot');
      break;
  }
}

async function loadChatHistory() {
  try {
    const response = await fetch('/api/chat/history', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to load chat history');
    
    const messages = await response.json();
    chatMessages.innerHTML = ''; // Clear existing messages
    
    messages.reverse().forEach(msg => {
      const isUser = msg.sender._id === getUserId();
      addMessage(msg.content, isUser ? 'user' : 'bot', msg.attachments, msg.timestamp);
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
}

// Initialize chat
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('token')) {
    loadChatHistory();
  }
});

// Initialize WebSocket connection
const ws = connectWebSocket();

async function handleFileUpload(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/chat/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Update file input handler
fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  if (file) {
    try {
      fileName.textContent = 'Uploading...';
      filePreview.classList.remove('hidden');
      const fileUrl = await handleFileUpload(file);
      fileName.textContent = file.name;
      fileInput.dataset.url = fileUrl;
    } catch (error) {
      fileName.textContent = 'Upload failed';
      setTimeout(removeFile, 2000);
    }
  }
});

// Update Chat Widget initialization
document.addEventListener('DOMContentLoaded', function() {
  // Existing initialization code...

  // Fix chat widget toggle
  const chatToggle = document.getElementById('chat-toggle');
  const chatPanel = document.getElementById('chat-panel');
  const chatInput = document.getElementById('chat-input');

  if (chatToggle && chatPanel) {
    chatToggle.addEventListener('click', (e) => {
      e.preventDefault();
      chatPanel.classList.toggle('hidden');
      const openIcon = chatToggle.querySelector('.open-icon');
      const closeIcon = chatToggle.querySelector('.close-icon');
      
      if (openIcon && closeIcon) {
        openIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
      }

      if (!chatPanel.classList.contains('hidden') && chatInput) {
        chatInput.focus();
      }
    });
  }

  // Initialize WebSocket with error handling
  try {
    initializeWebSocket();
  } catch (error) {
    console.error('WebSocket initialization failed:', error);
  }
});

function initializeWebSocket() {
  const ws = new WebSocket('ws://localhost:5000');
  
  ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected. Attempting to reconnect...');
    setTimeout(initializeWebSocket, 3000);
  };

  return ws;
}
