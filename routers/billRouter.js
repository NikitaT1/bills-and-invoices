import Router from "express";
import mailgun from "mailgun-js";
import customValidation from "../middleware/validation";
import billSchema from "../schema/billSchema";
import htmlPdfGenerator from "../htmlPdfGenerator/htmlPdfGererator";
import sendEmail from "../sendEmail";
const config = require("../config");
const { Queue } = require("bullmq");
const worker = require("./worker");

const { Bill, Customer, Works, Recipient } = require("../models/models");
require("dotenv").config();

const router = new Router();
const DOMAIN = process.env.DOMAIN_URL || "";
const API_KEY = process.env.API_KEY || "";

const mg = mailgun({
  apiKey: API_KEY,
  domain: DOMAIN,
});

router.post("/", billSchema, customValidation, async (req, res) => {
  // const bill = await myQueue.add('billCreator', { recipientEmail, customerEmail, works, recipientsCompany });
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

    const data = [
      {
        invoiceDate: today,
        invoiceNumber: "1",
        clientName: customer.firstName,
        clientLastName: customer.lastName,
        customerEmail: customerEmail,
        recipientEmail: recipientEmail,
        recipientsCompany: recipientsCompany,
        works: sumWorks(newWorks),
        prices: sumPrices(newWorks),
        totalPrice: totalPrices(newWorks),
      },
    ];

    const queue = new Queue(config.queueName, {
      connection: config.connection,
    });

    (async () => {
      await queue.add("someTaskName", students);

      console.log(`someTaskName`);
    })();

    worker.on("completed", (job) => console.info(`Completed job`, job));
    worker.on("failed", (job, err) => console.info(`Failed job`, job, err));

    htmlPdfGenerator(data);

    sendEmail();

    return res.send(data);

    //let htmlFile = createHTML(data);

    // let options = { format: "A4" };
    // let file = { content: htmlFile };
    // html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
    //   var attch = new mg.Attachment({
    //     data: pdfBuffer,
    //     filename: "Invoice",
    //     contentType: "application/pdf",
    //   });
    //   const data = {
    //     from: "Incoming invoice <me@samples.mailgun.org>",
    //     to: "postmailer21@gmail.com, YOU@YOUR_DOMAIN_NAME",
    //     subject: "Invoice recieved",
    //     text: `Here is invoice in the attached file. With best regards, ${customer.firstName} ${customer.lastName}`,
    //     attachment: [attch],
    //   };
    //   mg.messages().send(data, function (error, body) {
    //     console.log(body);
    //   });
    //   return res.status(200).send("E-mail has been sent");
    // });
  } catch (er) {
    console.log(er);
  }
});

export default router;

//express
/*
mailgun

import { Queue } from 'bullmq';

============Create queque
const myQueue = new Queue('foo');

============add steps to cue

async function addJobs(){
    await myQueue.add('getPDF', html);  
}
await addJobs();


============manage steps and pass results

const worker = new Worker(queueName, async job => {
    // Will print { foo: 'bar'} for the first job
    // and { qux: 'baz' } for the second.
    console.log(job.data);
});
*/

// const mailSender = (buffer, mail) => {

// }

//==============================================

// const { recipientEmail, customerEmail, works, recipientsCompany } = req.body;
// const bill =  await myQueue.add('bill_create', { recipientEmail, customerEmail, works, recipientsCompany });
// await myQueue.add('create_HTML', { data });
// // await myQueue.add('send_PDF', { htmlFile });
// // try {
// //   const customer = await Customer.findOne({
// //     where: { email: customerEmail },
// //   });
// //   let recipient = await Recipient.findOne({
// //     where: { email: recipientEmail },
// //   });
// //   if (!recipient) {
// //     recipient = await Recipient.create({
// //       email: recipientEmail,
// //       recipientsCompany: recipientsCompany,
// //     });
// //   }
// //   const bill = await Bill.create({
// //     recipientId: recipient.toJSON().id,
// //     customerId: customer.toJSON().id,
// //   });
// //   const newWorks = await Works.bulkCreate(
// //     works.map((w) => ({ ...w, billId: bill.toJSON().id }))
// //   );

// //   const today = new Date(Date.now()).toLocaleDateString();

// //   function totalPrices(newWorks) {
// //     return newWorks.reduce((a, b) => a + b.price, 0);
// //   }

// //   function sumWorks(newWorks) {
// //     let arr = [];
// //     newWorks.forEach((element) => {
// //       arr.push(element.workPerformed);
// //     });
// //     return arr;
// //   }

// //   function sumPrices(newWorks) {
// //     let arr = [];
// //     newWorks.forEach((element) => {
// //       arr.push(element.price);
// //     });
// //     return arr;
// //   }

// //   const data = {
// //     invoiceDate: today,
// //     invoiceNumber: "1",
// //     clientName: customer.firstName,
// //     clientLastName: customer.lastName,
// //     customerEmail: customerEmail,
// //     recipientEmail: recipientEmail,
// //     recipientsCompany: recipientsCompany,
// //     works1: sumWorks(newWorks)[0] || "-",
// //     prices1: sumPrices(newWorks)[0] || "-",
// //     works2: sumWorks(newWorks)[1] || "-",
// //     prices2: sumPrices(newWorks)[1] || "-",
// //     works3: sumWorks(newWorks)[2] || "-",
// //     prices3: sumPrices(newWorks)[2] || "-",
// //     works4: sumWorks(newWorks)[3] || "-",
// //     prices4: sumPrices(newWorks)[3] || "-",
// //     totalPrice: totalPrices(newWorks),
// //   };

//   //return res.send(data);

//   let htmlFile = createHTML(data);

//   let options = { format: "A4" };
//   let file = { content: htmlFile };
//   html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
//     var attch = new mg.Attachment({
//       data: pdfBuffer,
//       filename: "Invoice",
//       contentType: "application/pdf",
//     });
//     const data = {
//       from: "Incoming invoice <me@samples.mailgun.org>",
//       to: "postmailer21@gmail.com, YOU@YOUR_DOMAIN_NAME",
//       subject: "Invoice recieved",
//       text: `Here is invoice in the attached file. With best regards, ${customer.firstName} ${customer.lastName}`,
//       attachment: [attch],
//     };
//     mg.messages().send(data, function (error, body) {
//       console.log(body);
//     });
//     return res.status(200).send("E-mail has been sent");
//   });
// } catch (er) {
//   console.log(er);
// }
// });
