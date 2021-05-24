import Router from "express";
require("dotenv").config();
import { Bill, Customer, Works, Recipient } from "../models/models";
import { Worker, Job } from "bullmq";

const router = new Router();

export const connection = new IORedis({});
const app = express();
const worker = new Worker(
  "bill_create",
  async (recipientEmail, customerEmail, works, recipientsCompany) => {
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

      return data;
    } catch (er) {
      console.log(er);
    }
  },
  {}
);
