const express = require('express');
const path = require('path');
const emailRouter = require('./api/email');
require('dotenv').config(); // Load environment variables from .env
const nodemailer = require("nodemailer");
const app = express();
const PORT = process.env.PORT || 9120;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes to serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
},()=>{console.log("index called")});

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
const transporter = nodemailer.createTransport(
  {
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // Use environment variable
      pass: process.env.GMAIL_PASS, // Use environment variable
    },
  },
  () => {
    console.log("it is in");
  }
);
// Use the email router
app.post('/send-email', (req,res)=>{
   const {
    firstName,
    lastName,
    phone,
    email,
    destination,
    days,
    nights,
    adults,
    children,
    budget,
    additionalInfo,
  } = req.body;

  console.log("Form data received:", req.body);

  if (!firstName || !lastName || !phone || !email || !destination) {
    return res.status(400).send("All fields are required");
  }

  const mailOptions = {
    from: email,
    to: "abhisavaliya143@gmail.com", // Set recipient email directly
    subject: "Travel Inquiry",
    text: `Name: ${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email}\nDestination: ${destination}\nDays: ${days}\nNights: ${nights}\nAdults: ${adults}\nChildren: ${children}\nBudget: ${budget}\nAdditional Information: ${additionalInfo}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send(`Internal Server Error: ${error.message}`);
    } else {
      console.log("Email sent:", info.response);
      res.redirect("/");
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
