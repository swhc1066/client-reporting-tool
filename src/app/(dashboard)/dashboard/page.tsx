import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Welcome</h2>
      <p className="text-muted-foreground">
        Select a client to present their financial data in presentation mode.
      </p>
      <Button asChild>
        <Link href="/clients">View clients</Link>
      </Button>
    </div>
  );
}
