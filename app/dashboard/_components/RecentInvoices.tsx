import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/hook";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,

      clientName: true,
      clientEmail: true,
      total: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });
  return data;
}

export async function RecentInvoices() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
        <CardDescription>
          Invoices which have been added recently
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-10">
            No recent invoices found.
          </div>
        ) : (
          data.map((invoice) => (
            <div className="flex items-center gap-4 mt-3" key={invoice.id}>
              <Avatar className="hidden sm:flex size-9">
                <AvatarFallback>
                  {invoice.clientName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <p className="text-sm font-medium">{invoice.clientName}</p>
                <p className="text-sm text-muted-foreground">
                  {invoice.clientEmail}
                </p>
              </div>

              <div className="ml-auto font-medium">+LKR {invoice.total}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
