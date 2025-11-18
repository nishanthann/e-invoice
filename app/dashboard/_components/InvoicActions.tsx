"use client";

import {
  MoreHorizontal,
  Edit,
  Download,
  Mail,
  Trash,
  CheckCircle,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteInvoice, MarkInvoicePaid } from "../invoices/create/action";

type InvoiceActionsProps = {
  invoiceId: string;
  status: "PENDING" | "PAID";
};

export function InvoiceActions({ invoiceId, status }: InvoiceActionsProps) {
  const router = useRouter();

  // Replace with real server actions later
  const handleSendReminder = async () => {
    const promise = fetch(`/api/email/${invoiceId}`, {
      method: "POST",
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send reminder");
      }
      return data;
    });

    toast.promise(promise, {
      loading: "Sending reminder...",
      success: "Reminder email sent successfully!",
      error: (err) => err.message || "Failed to send reminder email",
    });
  };
  const handleMarkPaid = async () => {
    const promise = MarkInvoicePaid(invoiceId).then((res) => {
      if (!res.success) {
        throw new Error(res.message);
      }

      router.refresh();
      return res;
    });

    toast.promise(promise, {
      loading: "Marking invoice as paid...",
      success: "Invoice marked as paid!",
      error: (err) => err.message || "Failed to mark as paid",
    });
  };

  const handleDelete = async () => {
    const promise = DeleteInvoice(invoiceId).then((res) => {
      if (!res.success) {
        throw new Error(res.message || "Failed to delete");
      }
      router.refresh();
      return res;
    });

    toast.promise(promise, {
      loading: "Deleting invoice...",
      success: "Invoice deleted successfully",
      error: (err) => err.message || "Failed to delete invoice",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Edit Invoice */}
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/invoices/${invoiceId}`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Invoice
        </DropdownMenuItem>

        {/* Download PDF */}
        <DropdownMenuItem asChild>
          <Link href={`/api/invoice/${invoiceId}`} target="_blank">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Link>
        </DropdownMenuItem>

        {/* Send Reminder Email */}
        <DropdownMenuItem onClick={handleSendReminder}>
          <Mail className="h-4 w-4 mr-2" />
          Send Reminder
        </DropdownMenuItem>

        {/* Mark as Paid */}
        <DropdownMenuItem
          onClick={status === "PAID" ? undefined : handleMarkPaid}
          disabled={status === "PAID"}
          className={status === "PAID" ? "opacity-50 pointer-events-none" : ""}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {status === "PAID" ? "Already Paid" : "Mark as Paid"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Delete Invoice */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onSelect={(e) => e.preventDefault()} // <-- IMPORTANT FIX
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Invoice
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                invoice.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setShowDeleteDialog(arg0: boolean) {
  throw new Error("Function not implemented.");
}
