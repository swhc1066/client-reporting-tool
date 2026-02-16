import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function HomePage() {
  try {
    const { user } = await getUser();
    if (user) redirect("/dashboard");
  } catch {
    // Supabase not configured or error; show landing.
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Client Reporting Tool</CardTitle>
          <CardDescription>
            Sign in with your company email or create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
