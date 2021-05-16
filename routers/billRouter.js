const Router = require("express");
const router = new Router();
const { Bill, Customer, Works, Recipient } = require("../models/models");
const html_to_pdf = require("html-pdf-node");
const mailgun = require("mailgun-js");
const createHTML = require("../htmlGenerator");

const DOMAIN = "_";
const mg = mailgun({
  apiKey: "_",
  domain: DOMAIN,
});

router.post("/", async (req, res) => {
  // const { recipientEmail, customerEmail, works } = req.body;
  try {
    const data = {
      invoiceDate: "16/05/2021",
      invoiceNumber: "1",
      clientName: "clientName",
      clientLastName: "clientLastName",
      clientCompany: "clientCompany",
      price: 7,
      work: "work",
      totalPrice: 28,
      recipientName: "recipientName",
      recipientCompany: "Computer Science",
    };

    let htmlFile = createHTML(data);

    let options = { format: "A4" };
    let file = { content: htmlFile };
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
  } catch (er) {
    console.log(er);
  }
});

module.exports = router;
