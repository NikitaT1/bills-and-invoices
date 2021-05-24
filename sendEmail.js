import mailgun from "mailgun-js";
import path from "path";

const DOMAIN = process.env.DOMAIN_URL || "";
const API_KEY = process.env.API_KEY || "";

const mg = mailgun({
  apiKey: API_KEY,
  domain: DOMAIN,
});

function sendEmail() {
  let filepath = path.join(__dirname, "report.pdf");

  let data = {
    from: "Incoming invoice <me@samples.mailgun.org>",
    to: "postmailer21@gmail.com, YOU@YOUR_DOMAIN_NAME",
    subject: "Invoice recieved",
    text: "Testing some Mailgun awesomness!",
    attachment: filepath,
  };

  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
}

export default sendEmail;
