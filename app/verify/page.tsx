import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Check your email
          </h1>
          <p className="text-lg text-muted-foreground">
            We sent you a magic link to sign in
          </p>
        </div>

        {/* Verification Card */}
        <Card className="w-full">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl">
              Magic link sent successfully
            </CardTitle>
            <CardDescription className="text-base">
              Click the link in the email we sent to your inbox to access your
              account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Instructions */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Link expires soon</p>
                  <p className="text-sm text-muted-foreground">
                    For security, the magic link will expire in 15 minutes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <CheckCircle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Secure & passwordless</p>
                  <p className="text-sm text-muted-foreground">
                    No passwords to remember or type
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Link>
              </Button>

              <div className="text-center">
                <Button variant="link" className="text-sm">
                  {"Didn't receive the email?"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Having trouble?{" "}
            <Link
              href="#"
              className="font-medium hover:underline underline-offset-4"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
