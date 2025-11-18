import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  const { invoiceId } = await params;
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    select: {
      invoiceName: true,
      total: true,
      invoiceNumber: true,
      status: true,
      currency: true,
      fromName: true,
      fromEmail: true,
      fromAddress: true,
      clientName: true,
      clientEmail: true,
      clientAddress: true,
      date: true,
      dueDate: true,
      invoiceItemDescription: true,
      invoiceItemquantity: true,
      invoiceItemRate: true,
      note: true,
      userId: true,
    },
  });
  if (!data) {
    return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
  }
  const invoiceDate = new Date(data.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  pdf.setFont("Helvetica", "normal");

  // ---------- HEADER ----------
  pdf.setFontSize(26);
  pdf.setTextColor(30, 70, 200); // Blue title
  pdf.text("E-INVOICE", 15, 20);

  pdf.setTextColor(0, 0, 0); // Reset to black
  pdf.setFontSize(12);
  pdf.text(`Invoice #${data.invoiceNumber}`, 15, 30);
  pdf.text(`Status: ${data.status}`, 15, 36);

  // ---------- FROM / BILL TO ----------
  pdf.setFontSize(14);
  pdf.setTextColor(30, 30, 30);
  pdf.text("From:", 15, 50);

  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  pdf.text(data.fromName || "", 15, 56);
  pdf.text(data.fromEmail || "", 15, 62);
  pdf.text(data.fromAddress || "", 15, 68);

  pdf.setFontSize(14);
  pdf.setTextColor(30, 30, 30);
  pdf.text("Bill To:", 120, 50);

  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  pdf.text(data.clientName || "", 120, 56);
  pdf.text(data.clientEmail || "", 120, 62);
  pdf.text(data.clientAddress || "", 120, 68);

  // ---------- DATES ----------
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Invoice Date: ${invoiceDate}`, 15, 85);
  pdf.text(`Due in: ${data.dueDate} days`, 15, 91);

  // ---------- ITEM TABLE ----------
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Item Details", 15, 110);

  // Draw underline under "Item Details"
  pdf.setDrawColor(0, 0, 0);
  pdf.line(15, 112, 195, 112); // x1,y1,x2,y2

  // Table Header Background
  pdf.setFillColor(230, 230, 230); // Light gray
  pdf.rect(15, 115, 180, 10, "F"); // x, y, width, height, fill

  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Description", 18, 122);
  pdf.text("Qty", 120, 122);
  pdf.text("Rate", 140, 122);
  pdf.text("Amount", 170, 122);

  const itemY = 135;

  const amount =
    Number(data.invoiceItemquantity) * Number(data.invoiceItemRate);

  // Item row
  pdf.setTextColor(0, 0, 0);
  pdf.text(data.invoiceItemDescription || "", 18, itemY);
  pdf.text(String(data.invoiceItemquantity), 120, itemY);
  pdf.text(String(data.invoiceItemRate), 140, itemY);
  pdf.text(String(amount), 170, itemY);

  // ---------- TOTAL ----------
  pdf.setFontSize(16);
  pdf.setTextColor(200, 0, 0); // Red total
  pdf.text(`Total: ${data.currency} ${data.total}`, 15, 160);

  // ---------- NOTES ----------
  if (data.note) {
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Notes:", 15, 180);

    pdf.setTextColor(70, 70, 70);
    pdf.text(data.note, 15, 188, { maxWidth: 180 });
  }

  //   return NextResponse.json(data);

  // Return the PDF file
  const pdfBytes = pdf.output("arraybuffer");

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=invoice-${data.invoiceNumber}.pdf`,
    },
  });
}
