import TableDemo from "../_components/Table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function InvoicePage() {
  return (
    <div className="p-4">
      <Card className="p-2">
        <CardHeader className="flex flex-row items-center justify-between mt-5">
          <div>
            <CardTitle className="text-xl font-semibold">Invoices</CardTitle>
            <CardDescription>
              Manage your invoices and billing history
            </CardDescription>
          </div>

          <Button asChild>
            <Link href="/dashboard/invoices/create">
              <Plus />
              Create Invoice
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          <TableDemo />
        </CardContent>
      </Card>
    </div>
  );
}
