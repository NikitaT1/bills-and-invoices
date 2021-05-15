const Router = require("express");
const router = new Router();
const { Bill } = require("../models/models");
const html_to_pdf = require("html-pdf-node");
const mailgun = require("mailgun-js");

const DOMAIN = "_";
const mg = mailgun({
  apiKey: "_",
  domain: DOMAIN,
});

router.post("/", async (req, res) => {
  const { workPerformed, price } = req.body;
  try {
    const type = await Bill.create({ workPerformed, price });

    let options = { format: "A4" };
    let file = { content: "<h1>Welcome to html-pdf-node</h1>" };
    html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
      var attch = new mg.Attachment({
        data: pdfBuffer,
        filename: "filename",
        contentType: "application/pdf",
      });
      const data = {
        from: "Excited User <me@samples.mailgun.org>",
        to: "nik.tati1@gmail.com, YOU@YOUR_DOMAIN_NAME",
        subject: "Hello",
        text: "Testing some Mailgun awesomness!!!!!!",
        attachment: [attch],
      };
      mg.messages().send(data, function (error, body) {
        console.log(body);
      });
    });

    //return res.json(type);
  } catch (er) {
    console.log(er);
  }
});

module.exports = router;
