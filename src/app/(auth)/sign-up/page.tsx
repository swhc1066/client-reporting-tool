"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your company email and a password to sign up
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sign-up-email">Email</Label>
          <Input
            id="sign-up-email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sign-up-password">Password</Label>
          <Input
            id="sign-up-password"
            type="password"
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground">
            At least 6 characters
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button asChild className="w-full">
          <Link href="/dashboard">Sign up</Link>
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline hover:text-foreground">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
