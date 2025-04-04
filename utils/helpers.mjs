import bcrypt from "bcrypt";
const saltRounds = 10;
import PDFDocument from "pdfkit";
import { logoImage } from "./data.mjs";
export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);

  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

export const createPdf = (invoice, dataCallback, endCallback) => {
  let doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
  doc.on("data", dataCallback);
  doc.on("end", endCallback);
  generateHeader(doc, invoice.docDetails);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
};

function generateHeader(doc, docDetails) {
  const logoBuffer = Buffer.from(logoImage, "base64");
  const { doctorName, doctorNumber, doctorDesignation, doctorSubtext } =
    docDetails;
  doc
    .image(logoBuffer, 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text(doctorName, 110, 57)
    .fontSize(10)
    .text(doctorNumber, 200, 50, { align: "right" })
    .text(doctorDesignation, 200, 65, { align: "right" })
    .text(doctorSubtext, 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(formatCurrency(invoice.subtotal), 150, customerInformationTop + 30)
    .font("Helvetica-Bold")
    .text("For:", 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.name, 340, customerInformationTop)
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  let currentPosition = 330;

  doc.font("Helvetica-Bold");
  const headerHeight = generateTableRow(
    doc,
    currentPosition,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  
  currentPosition += headerHeight + 10;
  generateHr(doc, currentPosition);
  currentPosition += 10;
  doc.font("Helvetica");

  for (let i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const rowHeight = generateTableRow(
      doc,
      currentPosition,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    currentPosition += rowHeight + 10;
    generateHr(doc, currentPosition);
    currentPosition += 10;
  }

  currentPosition += 10;
  generateTableRow(
    doc,
    currentPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  currentPosition += 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    currentPosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(invoice.subtotal)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 },
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal,
) {
  // Calculate the height of wrapped text
  const descriptionHeight = doc.heightOfString(description, {
    width: 130,
    align: 'left'
  });
  
  doc
    .fontSize(10)
    .text(item, 50, y, {
      width: 100,
      align: 'left'
    })
    .text(description, 150, y, {
      width: 130,
      align: 'left'
    })
    .text(unitCost, 280, y, { 
      width: 90, 
      align: "right" 
    })
    .text(quantity, 370, y, { 
      width: 90, 
      align: "right" 
    })
    .text(lineTotal, 460, y, { 
      width: 90, 
      align: "right" 
    });

  return descriptionHeight;
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
  return "Rs " + cents?.toFixed(2)||0;
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}
