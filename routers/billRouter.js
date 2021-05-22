const Router = require("express");
require("dotenv").config();
const router = new Router();
const { Bill, Customer, Works, Recipient } = require("../models/models");
const html_to_pdf = require("html-pdf-node");
const mailgun = require("mailgun-js");
const createHTML = require("../htmlGenerator");
const customValidation = require("../middleware/validation");
const billSchema = require("../schema/billSchema");

const DOMAIN = process.env.DOMAIN_URL || "";
const API_KEY = process.env.API_KEY || "";

const mg = mailgun({
  apiKey: API_KEY,
  domain: DOMAIN,
});

router.post("/", billSchema, customValidation, async (req, res) => {
  const { recipientEmail, customerEmail, works, recipientsCompany } = req.body;
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
        recipientsCompany: recipientsCompany,
      });
    }
    const bill = await Bill.create({
      recipientId: recipient.toJSON().id,
      customerId: customer.toJSON().id,
    });
    const newWorks = await Works.bulkCreate(
      works.map((w) => ({ ...w, billId: bill.toJSON().id }))
    );

    const today = new Date(Date.now()).toLocaleDateString();

    function totalPrices(newWorks) {
      return newWorks.reduce((a, b) => a + b.price, 0);
    }

    function sumWorks(newWorks) {
      let arr = [];
      newWorks.forEach((element) => {
        arr.push(element.workPerformed);
      });
      return arr;
    }

    function sumPrices(newWorks) {
      let arr = [];
      newWorks.forEach((element) => {
        arr.push(element.price);
      });
      return arr;
    }

    const data = {
      invoiceDate: today,
      invoiceNumber: "1",
      clientName: customer.firstName,
      clientLastName: customer.lastName,
      customerEmail: customerEmail,
      recipientEmail: recipientEmail,
      recipientsCompany: recipientsCompany,
      works1: sumWorks(newWorks)[0] || "-",
      prices1: sumPrices(newWorks)[0] || "-",
      works2: sumWorks(newWorks)[1] || "-",
      prices2: sumPrices(newWorks)[1] || "-",
      works3: sumWorks(newWorks)[2] || "-",
      prices3: sumPrices(newWorks)[2] || "-",
      works4: sumWorks(newWorks)[3] || "-",
      prices4: sumPrices(newWorks)[3] || "-",
      totalPrice: totalPrices(newWorks),
    };

    return res.send(data);

    let htmlFile = createHTML(data);

    let options = { format: "A4" };
    let file = { content: htmlFile };
    html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
      var attch = new mg.Attachment({
        data: pdfBuffer,
        filename: "Invoice",
        contentType: "application/pdf",
      });
      const data = {
        from: "Incoming invoice <me@samples.mailgun.org>",
        to: "postmailer21@gmail.com, YOU@YOUR_DOMAIN_NAME",
        subject: "Invoice recieved",
        text: `Here is invoice in the attached file. With best regards, ${customer.firstName} ${customer.lastName}`,
        attachment: [attch],
      };
      mg.messages().send(data, function (error, body) {
        console.log(body);
      });
      return res.status(200).send("E-mail has been sent");
    });
  } catch (er) {
    console.log(er);
  }
});

module.exports = router;
