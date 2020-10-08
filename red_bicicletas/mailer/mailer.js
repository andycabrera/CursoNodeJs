const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

let mailConfig;

if(process.env.NODE_ENV === 'producction'){
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    }
    mailConfig = sgTransport(options);
}else {
    if(process.env.NODE_ENV === 'staging'){
        console.log('XXXXXXXXXXXXXXX');
        const options = {
            auth: {
                epi_key: process.env.SENDGRID_API_KEY
            }
        }
        mailConfig = sgTransport(options);
    }else{
        mailConfig = {
            host: 'smtp.ethereal.email',
            port:587,
            auth: {
                user: process.env.ethereal_user,
                pass: process.env.ethereal_pwd
            }
        };
    }
}

module.exports = nodemailer.createTransport(mailConfig);