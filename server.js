const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/send-email', (req, res) => {

    const {name, email, message} = req.body;

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
        subject: "Koras View Contact",
        text: `${name} ${email} ${message}`
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