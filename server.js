const express = require('express');
const path = require('path');
const emailRouter = require('./routes/email');

const app = express();
const PORT = 9120;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to serve the form page
app.get('/form.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

// Routes to serve other static pages
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
