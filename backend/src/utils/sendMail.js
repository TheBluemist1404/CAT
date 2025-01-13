const nodemailer = require('nodemailer');

module.exports.sendMail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true, // use false for STARTTLS; true for SSL on port 465
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });
};
