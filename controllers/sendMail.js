const nodemailer = require('nodemailer')

const {
  MAIL_PASSWORD,
  MAIL_ADDRESS
} = process.env





async function sendEmail(to, url, txt) {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: MAIL_ADDRESS,
        pass: MAIL_PASSWORD
      }
    });

    let mailOptions = {
      from: "ToDoTracker",
      to,
      subject: txt,
      text: `
      ToDoTracker MSG for ${txt}:
      ${url}
      `
    };


    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error is " + error);
        resolve(false); // or use rejcet(false) but then you will have to handle errors
      }
      else {
        console.log('Email sent: ' + info.response);
        resolve(true);
      }
    });
  }
  )
}


module.exports = { sendEmail }