import fs from "fs";
import path from "path";
import handlebars from "handlebars";

function createHTML(props) {
  let templateHtml = fs.readFileSync(
    path.join(process.cwd(), "invoice.html"),
    "utf8"
  );
  let template = handlebars.compile(templateHtml);
  let html = template(props);
  return html;
}

export default createHTML;
