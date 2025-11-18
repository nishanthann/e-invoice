// app/onboarding/action.ts
"use server";

import { requireUser } from "../utils/hook";
import { redirect } from "next/navigation";
import { onboardingSchema } from "../utils/zodSchema";
import { prisma } from "../utils/db";

export async function completeOnboarding(
  prevState: unknown,
  formData: FormData
) {
  const session = await requireUser();

  if (!session?.user?.id) {
    return {
      status: "error" as const,
      message: "User not authenticated",
      errors: {},
    };
  }

  // Extract form data
  const rawData = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    address: formData.get("address") as string,
    telephone: formData.get("telephone") as string,
  };

  // Validate with Zod
  const validationResult = onboardingSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      status: "error" as const,
      message: "Please fix the validation errors",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, address, telephone } = validationResult.data;

  // Update user in database
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName,
      lastName,
      address,
      telephone: telephone || null,
      hasCompletedOnboarding: true,
    },
  });

  // Redirect to dashboard on success - this will throw an error internally
  redirect("/dashboard");
}
