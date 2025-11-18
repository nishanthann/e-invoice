"use server";
import { sendEmail } from "@/app/utils/brevo";
import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/hook";
import { invoiceSchema, InvoiceFormData } from "@/app/utils/zodSchema";
// import { revalidatePath } from "next/cache";

import z from "zod";

export async function createInvoiceAction(formData: InvoiceFormData) {
  try {
    // Get the authenticated user
    const session = await requireUser();

    if (!session?.user?.id) {
      return {
        success: false as const,
        status: "error" as const,
        message: "User not authenticated",
        errors: {},
      };
    }

    // Validate the data with Zod
    const parsedData = invoiceSchema.parse(formData);

    // Prepare payload for Prisma
    const payload = {
      invoiceName: parsedData.invoiceName,
      total: parsedData.total,
      invoiceNumber: parsedData.invoiceNumber,
      status: parsedData.status,
      currency: parsedData.currency,

      fromName: parsedData.fromName,
      fromEmail: parsedData.fromEmail,
      fromAddress: parsedData.fromAddress,

      clientName: parsedData.clientName,
      clientEmail: parsedData.clientEmail,
      clientAddress: parsedData.clientAddress,

      date: new Date(parsedData.date),
      dueDate: parsedData.dueDate,

      invoiceItemDescription: parsedData.invoiceItemDescription,
      invoiceItemquantity: Number(parsedData.invoiceItemquantity),
      invoiceItemRate: Number(parsedData.invoiceItemRate),

      note: parsedData.note,
      userId: session.user.id,
    };

    // Create the invoice in DB
    const invoice = await prisma.invoice.create({
      data: payload,
    });
    // ✅ Send email to client after invoice creation
    await sendEmail({
      to: parsedData.clientEmail,
      subject: `Invoice #${parsedData.invoiceNumber} from ${parsedData.fromName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .invoice-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .footer { padding: 20px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Invoice #${parsedData.invoiceNumber}</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${parsedData.clientName}</strong>,</p>
              <p>Your invoice has been generated and is ready for payment.</p>
              
              <div class="invoice-details">
                <h3>Invoice Details:</h3>
                <p><strong>From:</strong> ${parsedData.fromName}</p>
                <p><strong>Amount:</strong> ${parsedData.total.toLocaleString(
                  "en-US",
                  { style: "currency", currency: parsedData.currency }
                )}</p>
                <p><strong>Due Date:</strong> Net ${parsedData.dueDate} days</p>
                <p><strong>Description:</strong> ${
                  parsedData.invoiceItemDescription
                }</p>
              </div>
              
              <p>Please contact ${parsedData.fromName} at ${
        parsedData.fromEmail
      } for payment details.</p>
            </div>
            <div class="footer">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        INVOICE #${parsedData.invoiceNumber}
        
        Hello ${parsedData.clientName},
        
        Your invoice has been generated:
        
        From: ${parsedData.fromName}
        Amount: ${parsedData.total.toLocaleString("en-US", {
          style: "currency",
          currency: parsedData.currency,
        })}
        Due: Net ${parsedData.dueDate} days
        Description: ${parsedData.invoiceItemDescription}
        
        Please contact ${parsedData.fromName} at ${
        parsedData.fromEmail
      } for payment details.
        
        Thank you for your business!
      `,
    });

    return {
      success: true as const,
      invoice,
      message: "Invoice created successfully",
    };
  } catch (error) {
    console.error("Error creating invoice:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        status: "validation_error" as const,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }

    // Handle Prisma unique constraint errors (like duplicate invoice number)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return {
        success: false as const,
        status: "error" as const,
        message: "Invoice number already exists",
        errors: { invoiceNumber: ["Invoice number must be unique"] },
      };
    }

    return {
      success: false as const,
      status: "error" as const,
      message: "Failed to create invoice",
      errors: {},
    };
  }
}
export async function updateInvoiceAction(
  invoiceId: string,
  data: InvoiceFormData
) {
  try {
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        invoiceName: data.invoiceName,
        invoiceNumber: data.invoiceNumber,
        status: data.status,
        currency: data.currency,
        fromName: data.fromName,
        fromEmail: data.fromEmail,
        fromAddress: data.fromAddress,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientAddress: data.clientAddress,
        date: new Date(data.date),
        dueDate: data.dueDate,
        invoiceItemDescription: data.invoiceItemDescription,
        invoiceItemquantity: Number(data.invoiceItemquantity),
        invoiceItemRate: Number(data.invoiceItemRate),
        total: data.total,
        note: data.note?.trim() || null,
      },
    });

    // revalidatePath("/dashboard/invoices");

    return {
      success: true,
      invoice: updatedInvoice,
    };
  } catch (error) {
    console.error("Error updating invoice:", error);
    return {
      success: false,
      message: "Failed to update invoice",
      status: "error",
    };
  }
}

export async function DeleteInvoice(invoiceId: string) {
  try {
    const session = await requireUser();

    if (!invoiceId) {
      return {
        success: false,
        message: "Invoice ID is required",
      };
    }

    // Check if invoice exists and belongs to the user
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session?.user?.id,
      },
    });

    if (!invoice) {
      return {
        success: false,
        message: "Invoice not found",
      };
    }

    // Delete the invoice
    await prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
    });

    // Revalidate the invoices page

    return {
      success: true,
      message: "Invoice deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return {
      success: false,
      message: "Failed to delete invoice",
    };
  }
}

export async function MarkInvoicePaid(invoiceId: string) {
  try {
    const session = await requireUser();

    if (!invoiceId) {
      return {
        success: false,
        message: "Invoice ID is required",
      };
    }

    // Make sure invoice belongs to logged-in user
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoice) {
      return {
        success: false,
        message: "Invoice not found",
      };
    }

    // Update invoice status
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: "PAID" }, // 👈 enum update
    });

    return {
      success: true,
      message: "Invoice marked as paid!",
    };
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    return {
      success: false,
      message: "Failed to mark invoice as paid",
    };
  }
}

export async function markInvoicePaidAction(id: string) {
  try {
    await prisma.invoice.update({
      where: { id },
      data: { status: "PAID" },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
