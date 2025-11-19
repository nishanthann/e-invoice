"use server";

import { toast } from "sonner";
import { signOut } from "../utils/auth";

export async function signOutAction() {
  await signOut();
  toast.success("Signed out successfully");
}
