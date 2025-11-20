// app/onboarding/page.tsx
"use client";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, MapPin, Phone, Loader2, UserCheck } from "lucide-react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "../utils/zodSchema";
import { OnboardingFormData } from "../utils/zodSchema";
import { completeOnboarding } from "./action";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      telephone: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("address", data.address);
      formData.append("telephone", data.telephone || "");

      await completeOnboarding(null, formData);
    } catch (error) {
      // setServerError("Failed to save profile. Please try again.");
      console.error("Onboarding error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-lg mb-4">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Complete your profile</h1>
          <p className="text-muted-foreground">
            Tell us a bit more about yourself
          </p>
        </div>

        {/* Onboarding Card */}
        <Card className="w-full shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Profile Information
            </CardTitle>
            <CardDescription className="text-center">
              We just need a few more details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Server Error */}
              {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{serverError}</p>
                </div>
              )}

              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name *
                  </Label>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="h-12 px-4 text-base"
                      />
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name *
                  </Label>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className="h-12 px-4 text-base"
                      />
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Address *
                </Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="address"
                      type="text"
                      placeholder="123 Main St, City, State, ZIP"
                      className="h-12 px-4 text-base"
                    />
                  )}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Telephone */}
              <div className="space-y-2">
                <Label
                  htmlFor="telephone"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Telephone Number{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Controller
                  name="telephone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="telephone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="h-12 px-4 text-base"
                    />
                  )}
                />
                {errors.telephone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.telephone.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {"We'll only use this for important account notifications"}
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-medium transition-all duration-200"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Complete Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            You can update this optional information later in your profile
            settings
          </p>
        </div>
      </div>
    </div>
  );
}
