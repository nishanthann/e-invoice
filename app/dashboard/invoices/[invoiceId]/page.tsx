import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/hook";
import { notFound } from "next/navigation";
import EditInvoiceComponent from "../../_components/EditInvoice";

async function getData(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  });

  if (!data) {
    return notFound();
  }
  return data;
}
type Params = Promise<{ invoiceId: string }>;
export default async function Page({ params }: { params: Params }) {
  const { invoiceId } = await params;
  const session = await requireUser();
  const data = await getData(invoiceId, session.user?.id as string);

  const invoiceData = { ...data, note: data.note ?? "" };
  return <EditInvoiceComponent invoiceData={invoiceData} />;
}
