const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'savaliyaabhi912@gmail.com',
        pass: 'lrrd dtfd verk fdbn' // Ensure this is the correct app password for your Gmail account
    }
});

// Send email route
router.post('/', (req, res) => {
    const { firstName, lastName, phone, email, destination, days, nights, adults, children, budget, additionalInfo } = req.body;

    // Log received form data for debugging
    console.log('Form data received:', req.body);

    if (!firstName || !lastName || !phone || !email || !destination) {
        return res.status(400).send('All fields are required');
    }

    const mailOptions = {
        from: email,
        to: 'abhisavaliya143@gmail.com',
        subject: 'Travel Inquiry',
        text: `Name: ${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email}\nDestination: ${destination}\nDays: ${days}\nNights: ${nights}\nAdults: ${adults}\nChildren: ${children}\nBudget: ${budget}\nAdditional Information: ${additionalInfo}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Internal Server Error');
        } else {
            console.log('Email sent:', info.response);
            res.redirect('/'); // Redirect to index.html
        }
    });
});


module.exports = router;
