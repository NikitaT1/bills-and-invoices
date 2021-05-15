const Router = require("express");
const router = new Router();
const { Bill } = require("../models/models");
const html_to_pdf = require("html-pdf-node");

router.get("/", async (req, res) => {
  //const { workPerformed, price } = req.body;
  try {
    // const type = await Bill.create({ workPerformed, price });

    let options = { format: "A4" };
    let file = { content: "<h1>Welcome to html-pdf-node</h1>" };
    html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
      res.file(pdfBuffer);
    });

    //return res.json(type);
  } catch (er) {
    console.log(er);
  }
});

module.exports = router;
