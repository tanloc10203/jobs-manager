const nodemailer = require("nodemailer");
const configs = require("../config");
const kickbox = require("kickbox")
  .client(
    "live_73006b9ba90fc062b1b180e198f122c04ec9afe164c41a378231aa411f52432f"
  )
  .kickbox();

async function checkEmail(email) {
  return new Promise((resovle, reject) => {
    kickbox.verify(email, (error, response) => {
      if (response.body.result === "deliverable") resovle(true);
      resovle(false);
    });
  });
}

const sendEmailVerifyAccount = async ({ subject, html, to }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: configs.email.username, // generated ethereal user
      pass: configs.email.password, // generated ethereal password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: `"Jobs Manager 👻" <${configs.email.username}>`, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: html,
  });
};

module.exports = {
  checkEmail,
  sendEmailVerifyAccount,
};
