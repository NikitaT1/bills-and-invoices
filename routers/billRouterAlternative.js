const Router = require("express");
require("dotenv").config();
const router = new Router();
const { Bill, Customer, Works, Recipient } = require("../models/models");
const html_to_pdf = require("html-pdf-node");
const mailgun = require("mailgun-js");
const createHTML = require("../htmlGenerator");
const nodeMailer = require("nodemailer");

const DOMAIN = process.env.DOMAIN_URL || "";
const API_KEY = process.env.API_KEY || "";

const mg = mailgun({
  apiKey: API_KEY,
  domain: DOMAIN,
});

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    type: "login",
    user: "postmailer21@gmail.com",
    pass: "postmailer2021",
  },
});

router.post("/", async (req, res) => {
  const { recipientEmail, customerEmail, works } = req.body;
  try {
    // const customer = await Customer.findOne({
    //   where: { email: customerEmail },
    // });
    // let recipient = await Recipient.findOne({
    //   where: { email: recipientEmail },
    // });
    // if (!recipient) {
    //   recipient = await Recipient.create({
    //     email: recipientEmail,
    //     recipientCompany: "company",
    //   });
    // }
    // const bill = await Bill.create({
    //   recipientId: recipient.toJSON().id,
    //   customerId: customer.toJSON().id,
    // });
    // const newWorks = await Works.bulkCreate(
    //   works.map((w) => ({ ...w, billId: bill.toJSON().id }))
    // );

    // //const timeElapsed = Date.now();
    // const today = new Date(Date.now()).toLocaleDateString();

    // function sumPrice(newWorks) {
    //   return newWorks.reduce((a, b) => a + b.price, 0);
    // }

    // function sumWorks(newWorks) {
    //   let arr = [];
    //   newWorks.forEach((element) => {
    //     arr.push(element.workPerformed);
    //   });
    //   return arr;
    // }

    // const data = {
    //   invoiceDate: today,
    //   invoiceNumber: "1",
    //   clientName: customer.firstName,
    //   clientLastName: customer.lastName,
    //   clientCompany: "clientCompany",
    //   works: "clientCompany",
    //   price: 7,
    //   work: "work",
    //   totalPrice: sumPrice(newWorks),
    //   recipientName: recipient.recipientsCompany,
    //   recipientCompany: "Computer Science",
    // };

    const data = {
      invoiceDate: "today",
      invoiceNumber: "1",
      clientName: "customer.firstName",
      clientLastName: "customer.lastName",
      clientCompany: "clientCompany",
      works: "clientCompany",
      price: 7,
      work: "work",
      totalPrice: "sumPrice",
      recipientName: "recipient.recipientsCompany",
      recipientCompany: "Computer Science",
    };

    // return res.json(data);

    let htmlFile = createHTML(data);

    let options = { format: "A4" };
    let file = { content: htmlFile };
    html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
      // var attch = new mg.Attachment({
      //   data: pdfBuffer,
      //   filename: "filename.pdf",
      //   contentType: "application/pdf",
      // });
      transporter.sendMail({
        from: "postmailer21@yandex.ru",
        to: "nik.tati1@gmail.com",
        subject: "An Attached File",
        text: "Check out this attached pdf file",
        attachments: [
          {
            filename: "filename.pdf",
            href: URL.createObjectURL(pdfBuffer),
            contentType: "application/pdf",
          },
        ],
        function(err, info) {
          if (err) {
            console.error(err);
            res.send(err);
          } else {
            console.log(info);
            res.send(info);
          }
        },
      });
    });
  } catch (er) {
    console.log(er);
  }
});

module.exports = router;
