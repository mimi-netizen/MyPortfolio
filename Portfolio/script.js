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

// Project filtering
function filterProjects(category) {
  const projects = document.querySelectorAll(".project-container");
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });

  projects.forEach((project) => {
    const projectCategory = project.dataset.category;
    if (category === "all" || projectCategory === category) {
      project.style.opacity = "1";
      project.style.transform = "scale(1)";
      project.style.display = "block";
    } else {
      project.style.opacity = "0";
      project.style.transform = "scale(0.8)";
      setTimeout(() => {
        project.style.display = "none";
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

  // Toggle Chat Panel
  chat.toggle.addEventListener("click", (e) => {
    e.preventDefault();
    chat.panel.classList.toggle("hidden");
    chat.toggle
      .querySelectorAll("svg")
      .forEach((icon) => icon.classList.toggle("hidden"));
    if (!chat.panel.classList.contains("hidden")) {
      chat.input.focus();
      initWebSocket();
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

  function initWebSocket() {
    if (chat.ws) return;

    chat.ws = new WebSocket("ws://localhost:5000");

    chat.ws.onopen = () => console.log("WebSocket Connected");

    chat.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "message") addMessage(data.text, "bot");
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

  function sendMessage(message) {
    if (chat.ws?.readyState === WebSocket.OPEN) {
      chat.ws.send(JSON.stringify({ type: "message", text: message }));
    }
  }
});

// Update Footer Year
document.getElementById("current-year").textContent = new Date().getFullYear();
