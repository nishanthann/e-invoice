import { prisma } from "@/app/utils/db";

import { requireUser } from "@/app/utils/hook";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { ChartLineDefault } from "./Graph";

async function getInvoiceData(userId: string) {
  const rawData = await prisma.invoice.findMany({
    where: {
      status: "PAID",
      userId: userId,
      createdAt: {
        lte: new Date(),
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const aggregated = rawData.reduce((acc: { [key: string]: number }, curr) => {
    const date = new Date(curr.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    acc[date] = (acc[date] || 0) + curr.total;

    return acc;
  }, {});
  const transformData = Object.entries(aggregated)
    .map(([date, amount]) => ({
      date,
      amount,
      originalDate: new Date(date + "," + new Date().getFullYear()),
    }))
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
    .map(({ date, amount }) => ({ date, amount }));
  return transformData;
}

export default async function InvoiceGraph() {
  const session = await requireUser();
  const data = await getInvoiceData(session.user?.id as string);
  console.log(data);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paid Invoices</CardTitle>
        <CardDescription>
          Invoices which have been paid in last 30 days
        </CardDescription>
        <CardContent>
          <ChartLineDefault chartData={data} />
        </CardContent>
      </CardHeader>
    </Card>
  );
}
