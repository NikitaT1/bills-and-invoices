const mailgun = require("mailgun-js");
const path = require("path");
require("dotenv").config();

const DOMAIN = process.env.DOMAIN_URL || "";
const API_KEY = process.env.API_KEY || "";

const mg = mailgun({
  apiKey: API_KEY,
  domain: DOMAIN,
});

async function sendEmail() {
  try {
    console.log("sendEmail ===> started");
    let filepath = path.join(__dirname, "../report.pdf");
    console.log("sendEmail ===> filepath", filepath);
    let data = {
      from: "Incoming invoice <me@samples.mailgun.org>",
      to: "postmailer21@gmail.com, YOU@YOUR_DOMAIN_NAME",
      subject: "Invoice recieved",
      text: "Testing some Mailgun awesomness!",
      attachment: filepath,
    };

    console.log("DOMAIN" + DOMAIN);
    mg.messages().send(data, function (error, body) {
      console.log(body);
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = sendEmail;
