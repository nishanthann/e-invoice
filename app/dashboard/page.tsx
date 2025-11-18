import { requireUser } from "../utils/hook";
import DashboardBlocks from "./_components/DashboardBlocks";
import InvoiceGraph from "./_components/InvoiceGraph";

export default async function Dahboard() {
  await requireUser();
  return (
    <div className="mt-4">
      <DashboardBlocks />
      <div className="grid gap-4 lg:grid-cols-3 md:gap-8 mt-5">
        <div className="lg:col-span-2">
          <InvoiceGraph />
        </div>
        <div></div>
      </div>
    </div>
  );
}
