const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

function createHTML(props) {
  let templateHtml = fs.readFileSync(
    path.join(process.cwd(), "invoice.html"),
    "utf8"
  );
  let template = handlebars.compile(templateHtml);
  let html = template(props);
  return html;
}

module.exports = createHTML;
