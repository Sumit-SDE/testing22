const express = require('express');
const path = require('path');
const emailRouter = require('./api/email');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 9120;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes to serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/form.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.get('/destination', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'destination.html'));
});

app.get('/about-us', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'aboutus.html'));
});

app.get('/contact-us', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contactus.html'));
});

app.get('/blog-us', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blogus.html'));
});

// Use the email router
app.use('/send-email', emailRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
