"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      <Button
        asChild
        variant={"ghost"}
        className={cn(
          "w-full justify-start",
          pathname === "/dashboard" && "bg-primary/30 "
        )}
      >
        <Link href="/dashboard">
          <Home className="h-5 w-5 mr-2" />
          Dashboard
        </Link>
      </Button>

      <Button
        asChild
        variant={"ghost"}
        className={cn(
          "w-full justify-start",
          pathname.startsWith("/dashboard/invoices") && "bg-primary/30"
        )}
      >
        <Link href="/dashboard/invoices">
          <FileText className="h-5 w-5 mr-2" />
          Invoices
        </Link>
      </Button>
    </nav>
  );
}
