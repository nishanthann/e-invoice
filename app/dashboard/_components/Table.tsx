import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceActions } from "./InvoicActions";
import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/hook";
import { Badge } from "@/components/ui/badge";

async function getInvoices(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      invoiceNumber: true,
      status: true,
      clientName: true,
      createdAt: true,
      dueDate: true,
      total: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

export default async function TableDemo() {
  const session = await requireUser();
  const data = await getInvoices(session.user?.id as string);
  return (
    <Table>
      <TableCaption>A list of your active and past subscriptions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Invoice ID</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">
              #{invoice.invoiceNumber}
            </TableCell>
            <TableCell>{invoice.clientName}</TableCell>
            <TableCell>
              {invoice.total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </TableCell>
            <TableCell>
              <Badge
                variant={"outline"}
                className={`${
                  invoice.status === "PAID"
                    ? "text-green-600 font-medium"
                    : "text-yellow-600 font-medium"
                }`}
              >
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>
              {invoice.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </TableCell>
            <TableCell className="text-right">
              Net {invoice.dueDate} days
            </TableCell>
            <TableCell className="text-right">
              <InvoiceActions invoiceId={invoice.id} status={invoice.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          {/* <TableCell colSpan={2}>Total Revenue</TableCell>
          <TableCell>
            {data
              .filter((invoice) => invoice.status === "PAID")
              .reduce((total, invoice) => total + invoice.total, 0)
              .toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
          </TableCell>
          <TableCell colSpan={4}></TableCell> */}
        </TableRow>
      </TableFooter>
    </Table>
  );
}
