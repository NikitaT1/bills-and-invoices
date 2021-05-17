const Router = require("express");
require("dotenv").config();
const router = new Router();
const { Bill, Customer, Works, Recipient } = require("../models/models");
const html_to_pdf = require("html-pdf-node");
const mailgun = require("mailgun-js");
const createHTML = require("../htmlGenerator");

const DOMAIN = process.env.DOMAIN_URL || "";
const API_KEY = process.env.API_KEY || "";

const mg = mailgun({
  apiKey: API_KEY,
  domain: DOMAIN,
});

router.post("/", async (req, res) => {
  const { recipientEmail, customerEmail, works } = req.body;
  try {
    const customer = await Customer.findOne({
      where: { email: customerEmail },
    });
    let recipient = await Recipient.findOne({
      where: { email: recipientEmail },
    });
    if (!recipient) {
      recipient = await Recipient.create({
        email: recipientEmail,
        recipientCompany: "company",
      });
    }
    const bill = await Bill.create({
      recipientId: recipient.toJSON().id,
      customerId: customer.toJSON().id,
    });
    const newWorks = await Works.bulkCreate(
      works.map((w) => ({ ...w, billId: bill.toJSON().id }))
    );

    //const timeElapsed = Date.now();
    const today = new Date(Date.now()).toLocaleDateString();

    function sumPrice(newWorks) {
      return newWorks.reduce((a, b) => a + b.price, 0);
    }

    const data = {
      invoiceDate: today,
      invoiceNumber: "1",
      clientName: customer.firstName,
      clientLastName: customer.lastName,
      clientCompany: "clientCompany",
      works: [],
      price: 7,
      work: "work",
      totalPrice: sumPrice(newWorks),
      recipientName: recipient.recipientsCompany,
      recipientCompany: "Computer Science",
    };

    return res.json(newWorks);

    // let htmlFile = createHTML(data);

    // let options = { format: "A4" };
    // let file = { content: htmlFile };
    // html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
    //   var attch = new mg.Attachment({
    //     data: pdfBuffer,
    //     filename: "filename",
    //     contentType: "application/pdf",
    //   });
    //   const data = {
    //     from: "Excited User <me@samples.mailgun.org>",
    //     to: "nik.tati1@gmail.com, YOU@YOUR_DOMAIN_NAME",
    //     subject: "Hello",
    //     text: "Testing some Mailgun awesomness!!!!!!",
    //     attachment: [attch],
    //   };
    //   mg.messages().send(data, function (error, body) {
    //     console.log(body);
    //   });
    // });
  } catch (er) {
    console.log(er);
  }
});

module.exports = router;
