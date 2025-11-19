import { Separator } from "@/components/ui/separator";

import { SidebarNav } from "./_components/sidebar-nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/MoodToggle";
import { prisma, signOut } from "../utils/auth";
import { requireUser } from "../utils/hook";
import { redirect } from "next/navigation";
import Link from "next/link";

async function getUser(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      address: true,
      telephone: true,
      hasCompletedOnboarding: true,
    },
  });

  // If user HAS NOT completed onboarding → redirect them
  if (!data?.hasCompletedOnboarding) {
    redirect("/onboarding");
  }
  return data; // ✅ RETURN USER
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireUser();
  const data = await getUser(session?.user?.id as string);
  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:flex border-r bg-background p-4">
          <div>
            {/* Logo & Name */}
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-2xl text-primary-foreground font-semibold">
                E
              </div>
              <span className="text-2xl font-semibold">Invoicer</span>
            </Link>

            <Separator className="mb-8" />

            {/* Menu */}
            <SidebarNav />
          </div>

          {/* User Section */}
        </aside>

        {/* Main Content */}
        {/* Main Content Area */}
        <main className="p-6 flex flex-col">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between h-10 ">
            {/* Left: Sheet Trigger (mobile only) */}
            <div className="md:hidden -mt-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-4 w-64">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-2xl text-primary-foreground font-semibold">
                        E
                      </div>
                      <span className="text-2xl font-semibold">Invoicer</span>
                    </SheetTitle>
                  </SheetHeader>
                  <Separator className="mb-4" />
                  <SidebarNav />
                </SheetContent>
              </Sheet>
            </div>

            {/* Right: Dropdown Menu (always visible) */}
            <div className="ml-auto flex flex-row items-center gap-4">
              <div className="-mt-6">
                <ModeToggle />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 ml-auto -mt-6 border border-primary "
                  >
                    <User className="h-5 w-5" />
                    {/* <span className="font-medium">{user.name}</span> */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full">
                  <DropdownMenuLabel> {data?.firstName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <form
                      className="w-full"
                      action={async () => {
                        "use server";
                        await signOut();
                      }}
                    >
                      <Button type="submit" className="w-full justify-start">
                        <LogOut className="h-4 w-4 mr-2 text-red-600" />
                        Sign Out
                      </Button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Separator className="mb-4 " />

          {/* Main Page Content */}
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </>
  );
}
