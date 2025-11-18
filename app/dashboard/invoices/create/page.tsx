import React from "react";
import CreateInvoiceComponent from "../../_components/CreateInvoiceComponent";
import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/hook";

async function getUserData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      address: true,
    },
  });
  return data;
}
export default async function CreateInvoice() {
  const session = await requireUser();
  const data = await getUserData(session.user?.id as string);
  return (
    <div>
      <CreateInvoiceComponent
        address={data?.address as string}
        email={data?.email as string}
        firstName={data?.firstName as string}
        lastName={data?.lastName as string}
      />
    </div>
  );
}
