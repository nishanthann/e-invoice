// app/login/login-button.tsx
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2, UserCheck } from "lucide-react";
interface iAppProp {
  text: string;
  text2: string;
}

export default function SubmitButton({ text, text2 }: iAppProp) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-12 text-base font-medium "
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {text2}
        </>
      ) : (
        <>
          <UserCheck className="w-4 h-4 mr-2" />
          {text}
        </>
      )}
    </Button>
  );
}
