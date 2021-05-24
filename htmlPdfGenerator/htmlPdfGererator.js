import express from "express";
import ejs from "ejs";
import pdf from "html-pdf";
import path from "path";
import { Queue } from "bullmq";
import { queueName } from "../config";
let app = express();

function htmlPdfGenerator(props) {
  // const queue = new Queue('htmlPdfGenerator', {
  //   defaultJobOptions: {
  //     // attempts: 5,
  //     // backoff: { type: 'exponential', delay: 3000 },
  //   },
  //   //...opts,
  // })

  ejs.renderFile(
    path.join(__dirname, "../views/", "invoice2.ejs"),
    { data: props },
    (err, data) => {
      let options = {
        height: "11.25in",
        width: "8.5in",
        header: {
          height: "20mm",
        },
        footer: {
          height: "20mm",
        },
      };
      pdf.create(data, options).toFile("report.pdf", function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("File created successfully");
        }
      });
    }
  );
}

export default htmlPdfGenerator;

// app.get("/generateReport", (req, res) => {
// 	ejs.renderFile(path.join(__dirname, './views/', "report-template.ejs"), {
//         students: students
//     }, (err, data) => {
//         if (err) {
//             res.send(err);
//         } else {
//             let options = {
//                 "height": "11.25in",
//                 "width": "8.5in",
//                 "header": {
//                     "height": "20mm",
//                 },
//                 "footer": {
//                     "height": "20mm",
//                 },

//             };
//             pdf.create(data, options).toFile("report.pdf", function (err, data) {
//                 if (err) {
//                     res.send(err);
//                 } else {
//                     res.send("File created successfully");
//                 }
//             });
//         }
//     });
// })
