const nodeMailer = require('nodemailer');

const sendMailUtility =async (EmailTo, EmailText, EmailSubject) => {


    const transporter = nodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_ACC,
                    pass: process.env.MAIL_PASS
                }

            } )
    const mailOptions = {
        from: 'Fashionary MERN <jonywebdev19@gmail.com>',
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    }

    return await  transporter.sendMail(mailOptions);
}

module.exports = sendMailUtility;