import { sendEmail } from "@/app/utils/brevo";
import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/hook";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const session = await requireUser();

    // Await the params Promise first
    const { invoiceId } = await params;

    console.log("Invoice ID:", invoiceId); // Debug log

    if (!invoiceId) {
      return NextResponse.json(
        { message: "Invoice ID is required" },
        { status: 400 }
      );
    }

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session?.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }

    await sendEmail({
      to: invoiceData.clientEmail,
      subject: `Reminder: Invoice #${invoiceData.invoiceNumber} from ${invoiceData.fromName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FFA500; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .invoice-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #FFA500; }
            .footer { padding: 20px; text-align: center; color: #666; }
            .urgent { color: #D32F2F; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Payment Reminder</h1>
              <p>Invoice #${invoiceData.invoiceNumber}</p>
            </div>
            <div class="content">
              <p>Hello <strong>${invoiceData.clientName}</strong>,</p>
              <p>This is a friendly reminder that the following invoice is <span class="urgent">outstanding</span>:</p>

              <div class="invoice-details">
                <h3>Invoice Details:</h3>
                <p><strong>From:</strong> ${invoiceData.fromName}</p>
                <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>
                <p><strong>Invoice Name:</strong> ${invoiceData.invoiceName}</p>
                <p><strong>Amount Due:</strong> ${invoiceData.total.toLocaleString(
                  "en-US",
                  { style: "currency", currency: invoiceData.currency }
                )}</p>
                <p><strong>Due Date:</strong> Net ${
                  invoiceData.dueDate
                } days</p>
                <p><strong>Description:</strong> ${
                  invoiceData.invoiceItemDescription
                }</p>
                <p><strong>Status:</strong> ${invoiceData.status}</p>
              </div>

              <p>Please arrange for payment at your earliest convenience.</p>
              <p>If you have already made the payment, please disregard this reminder.</p>

              <p>For any questions or concerns, please contact <strong>${
                invoiceData.fromName
              }</strong> at
              <a href="mailto:${invoiceData.fromEmail}">${
        invoiceData.fromEmail
      }</a>.</p>
            </div>
            <div class="footer">
              <p>Thank you for your prompt attention to this matter.</p>
              <p><em>This is an automated reminder</em></p>
            </div>
          </div>
        </body>
        </html>
      `,

      text: "Reminder",
    });

    return NextResponse.json(
      {
        message: "Reminder email sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending reminder email:", error);

    return NextResponse.json(
      {
        message: "Failed to send reminder email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
