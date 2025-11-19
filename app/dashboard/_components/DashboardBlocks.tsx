import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, Wallet } from "lucide-react";

async function getData(userId: string) {
  const [data, openInvoices, paidInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      select: {
        total: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PENDING",
      },
      select: {
        id: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PAID",
      },
      select: {
        id: true,
      },
    }),
  ]);
  return { data, openInvoices, paidInvoices };
}

export default async function DashboardBlocks() {
  const session = await requireUser();
  const { data, openInvoices, paidInvoices } = await getData(
    session.user?.id as string
  );
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
      {/* Total Invoices */}
      <Card className="p-4 ">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.length || 0}</p>
          <p className="text-xs text-muted-foreground">+12 this month</p>
        </CardContent>
      </Card>

      {/* Pending Payments */}
      <Card className="p-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Payments
          </CardTitle>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{openInvoices.length || 0}</p>
          <p className="text-xs text-muted-foreground">Due soon</p>
        </CardContent>
      </Card>

      {/* Paid Invoices */}
      <Card className="p-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
          <CheckCircle className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{paidInvoices.length || 0}</p>
          <p className="text-xs text-muted-foreground">All settled</p>
        </CardContent>
      </Card>

      {/* Revenue */}
      <Card className="p-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <Wallet className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            <span className="mr-1">LKR</span>
            {data.reduce((acc, invoice) => acc + invoice.total, 0)}.00
          </p>
          <p className="text-xs text-muted-foreground">+4.5% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
}
