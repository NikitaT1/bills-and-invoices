import express from "express";
import ejs from "ejs";
import pdf from "html-pdf";
import path from "path";
let app = express();

function htmlPdfGenerator(props) {
  console.log("props:", props.data);
  ejs.renderFile(
    path.join(__dirname, "../views/", "invoice2.ejs"),
    { data: props.data },
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
