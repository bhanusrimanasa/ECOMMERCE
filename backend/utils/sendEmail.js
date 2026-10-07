const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const port = Number(process.env.SMPT_PORT) || 465;

  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: port,
    secure: port === 465, // true for port 465, false for port 587 or 2525
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;