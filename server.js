const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: `Nowe zgłoszenie ze strony`,
            html: `
                <h2>Nowe zgłoszenie ze strony</h2>
                <p><strong>Imię i Nazwisko:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Wiadomość:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        const autoReplyOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Dziękujemy za kontakt',
            html: `
                <h2>Dziękujemy za wiadomość!</h2>
                <p>Drogi/Droga ${name},</p>
                <p>Dziękujemy za zainteresowanie naszymi usługami. Otrzymaliśmy Twoją wiadomość i odpowiemy najszybciej jak to możliwe.</p>
                <br>
                <p>Pozdrawiamy,</p>
                <p>Zespół Portfolio</p>
            `
        };

        await transporter.sendMail(autoReplyOptions);

        res.status(200).json({ message: 'Wiadomość została wysłana pomyślnie' });
    } catch (error) {
        console.error('Błąd wysyłania wiadomości:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas wysyłania wiadomości' });
    }
});

app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});