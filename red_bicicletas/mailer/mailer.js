const nodemailer = require('nodemailer');

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'khalid.daniel@ethereal.email',
        pass: 'fRXEahvr4M7AgAg7jB'
    }
};

module.exports = nodemailer.createTransport(mailConfig);