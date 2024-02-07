const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const { CLIENT_RENEG_WINDOW } = require('tls');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/send-email', (req, res) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: process.env.RECEIVING_EMAIL,
        subject: "Test Message",
        text: "This is a test message."
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error', error);
            res.status(500).json({ success: false, error: 'Failed to send email'});
        } else {
            console.log('Email sent', info.response);
            res.json({ success: true, message: "Email sent successfully"});
        }
    })
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});