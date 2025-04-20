const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the Portfolio directory
app.use(express.static(path.join(__dirname, 'Portfolio')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Portfolio', 'index.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'Portfolio', 'projects.html'));
});

app.get('/project-details', (req, res) => {
    res.sendFile(path.join(__dirname, 'Portfolio', 'project-details.html'));
});

// Fallback route
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'Portfolio', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
