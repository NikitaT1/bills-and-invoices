import { Bill, Customer, Works, Recipient } from "../models/models";

require("dotenv").config();

async function bill({ data }) {
  const { recipientEmail, customerEmail, works, recipientsCompany } = data;
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

  function sumPrices(newWorks) {
    let arr = [];
    newWorks.forEach((element) => {
      arr.push(element.price);
    });
    return arr;
  }

  const res = [
    {
      invoiceDate: today,
      invoiceNumber: "1",
      clientName: customer.firstName,
      clientLastName: customer.lastName,
      customerEmail: customerEmail,
      recipientEmail: recipientEmail,
      recipientsCompany: recipientsCompany,
      works: newWorks,
      prices: sumPrices(newWorks),
      totalPrice: totalPrices(newWorks),
    },
  ];

  return res;
}

export default bill;
