// Menu toggle function
function toggleMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburgerIcon = document.querySelector(".hamburger-icon");

  if (mobileMenu.classList.contains("-translate-y-full")) {
    mobileMenu.classList.remove("-translate-y-full");
    hamburgerIcon.classList.add("open");
  } else {
    mobileMenu.classList.add("-translate-y-full");
    hamburgerIcon.classList.remove("open");
  }
}

// Theme toggle function
function toggleTheme() {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
}

// Enhanced Project Filtering
function filterProjects(category) {
  const projects = document.querySelectorAll('.project-container');
  const buttons = document.querySelectorAll('.filter-btn');

  // Update active button state
  buttons.forEach(btn => {
    btn.classList.toggle('active', 
      (category === 'all' && btn.textContent.trim().toLowerCase() === 'all') || 
      btn.textContent.trim().toUpperCase().replace('-', '_') === category
    );
  });

  projects.forEach(project => {
    const projectCategory = project.dataset.category;
    if (category === 'all' || projectCategory === category) {
      project.style.display = 'block';
      setTimeout(() => {
        project.style.opacity = '1';
        project.style.transform = 'scale(1)';
      }, 50);
    } else {
      project.style.opacity = '0';
      project.style.transform = 'scale(0.8)';
      setTimeout(() => {
        project.style.display = 'none';
      }, 300);
    }
  });
}

// AOS Initialization
document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: "ease-in-out",
    anchorPlacement: "top-bottom",
    disable: "mobile",
  });

  // Skill bars animation
  const skillBars = document.querySelectorAll('[data-aos="width"]');
  skillBars.forEach((bar) => {
    const width = bar.style.width;
    bar.style.width = "0";
    setTimeout(() => {
      bar.style.width = width;
      bar.style.transition = "width 1s ease-in-out";
    }, 200);
  });

  // Theme initialization
  const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.classList.toggle("dark", savedTheme === "dark");
  document.documentElement.setAttribute("data-theme", savedTheme);
});

// Project Filtering
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterProjects(filter);
            });
        });
    }
});

// Project Details Page
const projectIds = [5, 6, 8, 9, 10, 11, 12, 13, 14];

function loadProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = parseInt(urlParams.get('id'));
    
    if (projectId && projectsData[projectId]) {
        const project = projectsData[projectId];
        const projectContent = document.getElementById('project-content');
        
        if (projectContent) {
            projectContent.innerHTML = `
                <h1 class="text-4xl font-bold mb-4">${project.title}</h1>
                <p class="text-gray-600 dark:text-gray-400 mb-8">Category: ${project.category}</p>
                
                <div class="mb-8">
                    <img src="${project.image}" alt="${project.title}" class="w-full rounded-lg shadow-lg">
                </div>

                <div class="prose dark:prose-invert max-w-none">
                    <h2 class="text-2xl font-semibold mb-4">Project Overview</h2>
                    <p class="mb-6">${project.description}</p>
                    
                    <div class="flex gap-4 mt-8">
                        ${project.github ? `<a href="${project.github}" target="_blank" class="px-6 py-2 bg-gray-800 text-white dark:bg-white dark:text-gray-800 rounded-full hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors">View on GitHub</a>` : ''}
                        ${project.website ? `<a href="${project.website}" target="_blank" class="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">Live Demo</a>` : ''}
                    </div>
                </div>
            `;

            // Update navigation buttons
            updateNavigationButtons(projectId);
        }
    }
}

// Add navigation button functionality
function updateNavigationButtons(currentId) {
    const currentIndex = projectIds.indexOf(parseInt(currentId));
    const prevButton = document.getElementById('prev-project');
    const nextButton = document.getElementById('next-project');

    if (prevButton && nextButton) {
        // Previous button
        if (currentIndex > 0) {
            const prevId = projectIds[currentIndex - 1];
            prevButton.onclick = () => window.location.href = `project-details.html?id=${prevId}`;
            prevButton.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            prevButton.onclick = null;
            prevButton.classList.add('opacity-50', 'cursor-not-allowed');
        }

        // Next button
        if (currentIndex < projectIds.length - 1) {
            const nextId = projectIds[currentIndex + 1];
            nextButton.onclick = () => window.location.href = `project-details.html?id=${nextId}`;
            nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            nextButton.onclick = null;
            nextButton.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
}

// Project data for details page
const projectsData = {
    5: {
        title: "DevOps & Cloud",
        category: "DEVOPS",
        image: "./assets/project_images/devops.gif",
        description: "During my time at Steghub, I engaged in an immersive, hands-on learning experience that significantly shaped my DevOps skills. The project-based curriculum allowed me to work on real-world applications, covering essential topics such as cloud infrastructure, continuous integration, and container orchestration. The Steghub DevOps & Cloud Computing repository showcases all the projects I completed while studying there, including implementations of various web stacks and automation using tools like Jenkins, Docker, and Terraform. This practical approach not only solidified my technical knowledge but also prepared me to tackle complex challenges in the field of DevOps.",
        github: "https://github.com/mimi-netizen/Steghub-DevOps_CloudComputing",
        website: null
    },
    6: {
        title: "Kikapu Marketplace",
        category: "E_COMMERCE",
        image: "./assets/project_images/Untitled_design.gif",
        description: "Kikapu Marketplace is a full-featured buy/sell platform built with Python/Django that enables seamless interactions between buyers and sellers. The platform features a responsive design with an intuitive user interface where sellers can post detailed product listings with multiple images, specifications, and pricing, while buyers can easily browse, search, and filter listings by categories, locations, and other criteria. Key features include a secure user authentication system, real-time messaging between buyers and sellers, an advanced search functionality with auto-suggestions, image galleries with zoom capabilities, seller profiles with ratings and reviews, and a responsive admin dashboard for content moderation. The project implements modern web practices including mobile-first design, SEO optimization, and performance enhancements through efficient database queries and caching mechanisms.",
        github: null,
        website: null
    },
    8: {
        title: "Vaccination Scheduling App",
        category: "E_COMMERCE",
        image: "./assets/project_images/v1.gif",
        description: "I developed a comprehensive web application for managing children's vaccination schedules using Django and Python. The application features a user-friendly interface that enables parents to track vaccine doses, schedule appointments at nearby hospitals and vaccination centers, and receive automated reminders. I implemented key functionalities including a calendar-based scheduling system, vaccination certificate generation, and an information portal about available vaccines. The project demonstrates my proficiency in full-stack development using Python, Django, HTML, CSS, and JavaScript, as well as my ability to create healthcare-focused solutions. The application was successfully deployed on Render, making it accessible to users online through vaccination-scheduling-app.onrender.com.",
        github: "https://github.com/mimi-netizen/Vaccination-Scheduling-App",
        website: "https://vaccination-scheduling-app.onrender.com/"
    },
    9: {
        title: "Python Scripts for System Administrators",
        category: "AUTOMATION",
        image: "./assets/project_images/like4like.gif",
        description: "I developed a comprehensive collection of Python automation tools focusing on three key areas: web automation using Selenium, web scraping, and cryptographic operations. The project features advanced implementations including email automation, social media interactions, specialized web scrapers for various platforms (including books, product, and job listing data extraction), and robust cryptographic systems including cipher implementations and security protocols. I demonstrated strong technical expertise by implementing detailed debugging systems, logging mechanisms, and performance monitoring tools across all components. The project showcases my proficiency in Python programming, system administration, and security practices, while emphasizing clean code architecture and comprehensive documentation",
        github: "https://github.com/mimi-netizen/Python-Scripts",
        website: null
    },
    10: {
        title: "ChatGPT App Development",
        category: "AUTOMATION",
        image: "./assets/project_images/articlegenerator.jpg",
        description: "I developed a suite of AI-powered applications that leverages ChatGPT, Gemini, and related technologies. This collection includes ten distinct tools ranging from an article generator and chatbot implementation to code analysis tools and image generators. I implemented core functionalities such as API integrations, conversation state management, and automated content generation systems. The project demonstrates my ability to work with modern AI technologies while creating practical applications like text summarizers, automated response systems, and development utilities. I utilized various technologies including Python, HTML, PyQt5, and designed robust error handling and API management systems across all applications.",
        github: "https://github.com/mimi-netizen/ChatGPT-App-Development",
        website: null
    },
    11: {
        title: "Face Recognition System",
        category: "MACHINE_LEARNING",
        image: "./assets/project_images/fr.gif",
        description: "I created a face recognition system using Python, OpenCV, and SQLite. This project captures video from a webcam, detects faces in real-time, and recognizes individuals by retrieving their information from a SQLite database. I implemented features such as dataset creation for training and model training scripts, allowing for efficient face recognition. This work not only enhanced my skills in computer vision and database management but also provided a practical application of machine learning techniques.",
        github: "https://github.com/mimi-netizen/Face-recognition",
        website: null
    },
    12: {
        title: "Hive",
        category: "E_COMMERCE",
        image: "./assets/project_images/outer.jpg",
        description: "I created Hive, a web platform that enables users to buy and sell various services, such as housekeeping, tutoring, and wellness treatments. Built with Django, this project showcases my skills in web development, allowing potential customers to connect with service providers seamlessly. I implemented features like user authentication, service listings, and payment integration, enhancing the overall user experience. This project not only deepened my understanding of Django and Python but also demonstrated my ability to develop practical applications that meet user needs.",
        github: "https://github.com/mimi-netizen/Hive",
        website: "https://hive-81qm.onrender.com/"
    },
    13: {
        title: "Python and Machine Learning in Financial Analysis",
        category: "OTHER",
        image: "./assets/project_images/fin.png",
        description: "This project covers a range of topics, including time series modeling, portfolio optimization, risk assessment, and credit risk prediction. I implemented various methodologies such as GARCH models for volatility forecasting and deep learning applications for financial predictions. This work not only enhanced my skills in data analysis and machine learning but also provided practical insights into financial modeling and risk management strategies.",
        github: "https://github.com/mimi-netizen/Python-and-Machine-Learning-in-Financial-Analysis",
        website: null
    },
    14: {
        title: "React Weather App",
        category: "WEB_DEVELOPMENT",
        image: "./assets/project_images/weather.gif",
        description: "This project allows users to seamlessly check weather forecasts for various locations, showcasing my skills in front-end development and API integration. The application is designed to be user-friendly and visually appealing, adapting well to different screen sizes. By leveraging React's component-based architecture, I created an efficient and maintainable codebase, enhancing my understanding of modern web development practices.",
        github: "https://github.com/mimi-netizen/react-weather-app",
        website: "https://react-weather-app-two-brown.vercel.app/"
    }
};

// Initialize project details if on the details page
if (window.location.pathname.includes('project-details.html')) {
    loadProjectDetails();
}

// Contact Form Handling
document
  .getElementById("contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch(this.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then((response) =>
        response.ok
          ? alert("Thanks for your message! I'll get back to you soon.")
          : Promise.reject("Submission failed")
      )
      .catch(() => alert("Oops! There was a problem sending your message."));
  });

// Newsletter Form
document
  .getElementById("newsletter-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing with: ${email}`);
    this.reset();
  });

// Back to Top Button
window.addEventListener("scroll", () => {
  document
    .getElementById("back-to-top")
    .classList.toggle("visible", window.scrollY > 300);
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Scroll Progress
window.addEventListener("scroll", () => {
  const scrollProgress = document.querySelector(".scroll-progress");
  const scrolled =
    (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) *
    100;
  scrollProgress.style.setProperty("--scroll", `${scrolled}%`);
});

// Custom Cursor
document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.createElement("div");
  cursor.classList.add("custom-cursor");
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  document.addEventListener("mousedown", () => cursor.classList.add("active"));
  document.addEventListener("mouseup", () => cursor.classList.remove("active"));
});

// Chat Widget Implementation
document.addEventListener("DOMContentLoaded", function () {
  const chat = {
    toggle: document.getElementById("chat-toggle"),
    panel: document.getElementById("chat-panel"),
    input: document.getElementById("chat-input"),
    form: document.getElementById("chat-form"),
    messages: document.getElementById("chat-messages"),
    fileInput: document.getElementById("chat-file"),
    filePreview: document.getElementById("file-preview"),
    fileName: document.getElementById("file-name"),
    ws: null,
  };

  if (!chat.toggle) return;

  // Initialize WebSocket
  function initWebSocket() {
    if (chat.ws) return;

    chat.ws = new WebSocket("ws://localhost:5000");

    chat.ws.onopen = () => {
      console.log("WebSocket Connected");
      // Make sure the welcome message is displayed in the chat panel
      chat.messages.innerHTML = `
        <div class="flex flex-col">
          <div class="bg-blue-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%] self-start">
            <p class="text-sm text-gray-800 dark:text-white">Hi there! How can I help you today?</p>
          </div>
        </div>
      `;
    };

    chat.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received:", data);
        
        if (data.type === "message") {
          addMessage(data.text, "bot");
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    chat.ws.onclose = () => {
      console.log("WebSocket disconnected. Reconnecting...");
      chat.ws = null;
      setTimeout(initWebSocket, 3000);
    };
  }

  // Toggle Chat Panel
  chat.toggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    chat.panel.classList.toggle("hidden");
    const openIcon = chat.toggle.querySelector(".open-icon");
    const closeIcon = chat.toggle.querySelector(".close-icon");
    
    // Invert the logic: show message icon when panel is visible
    openIcon.classList.toggle("hidden", !chat.panel.classList.contains("hidden"));
    closeIcon.classList.toggle("hidden", chat.panel.classList.contains("hidden"));

    if (!chat.panel.classList.contains("hidden")) {
      chat.input.focus();
      if (!chat.ws) initWebSocket();
    }
  });

  // Message Handling
  chat.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = chat.input.value.trim();
    if (message) {
      addMessage(message, "user");
      sendMessage(message);
      chat.input.value = "";
    }
  });

  // File Handling
  chat.fileInput.addEventListener("change", () => {
    const file = chat.fileInput.files[0];
    if (file) {
      chat.fileName.textContent = file.name;
      chat.filePreview.classList.remove("hidden");
    }
  });

  function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "flex flex-col mb-4";

    const bubble = document.createElement("div");
    bubble.className =
      sender === "user"
        ? "bg-blue-500 text-white rounded-lg p-3 max-w-[80%] self-end"
        : "bg-blue-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%] self-start";

    bubble.innerHTML = `<p class="text-sm">${text}</p>`;
    messageDiv.appendChild(bubble);
    chat.messages.appendChild(messageDiv);
    chat.messages.scrollTop = chat.messages.scrollHeight;
  }

  function sendMessage(message) {
    if (chat.ws?.readyState === WebSocket.OPEN) {
      chat.ws.send(JSON.stringify({ type: "message", text: message }));
    }
  }
});

// Update Footer Year
document.getElementById("current-year").textContent = new Date().getFullYear();
