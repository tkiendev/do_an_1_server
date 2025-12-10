const nodemailer = require("nodemailer");

module.exports.sendAutoEmail = async (subject, text, toEmail) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASSWORD_EMAIL_APPP,
        },
    });
    await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: toEmail,
        subject: subject,
        text: text,
        // html: "<b>Hello world?</b>", 
    });
}