import nodemailer from "nodemailer";

export async function sendEmailTo(to, title, teks) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "email lo",
      pass: "pasword",
    },
  });

  const mailOptions = {
    from: to,
    to: to,
    subject: title,
    text: teks,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      return err;
    } else {
      return info;
    }
  });
}
