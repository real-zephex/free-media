import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clapperboard, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center space-y-6 p-4 text-center">
      <div className="rounded-full bg-muted p-6">
        <Clapperboard className="h-16 w-16 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tight">
          404 — Reel Missing
        </h2>
        <p className="max-w-md text-muted-foreground text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
      </div>

      <Button variant="outline" size="lg" asChild className="gap-2 min-w-[200px]">
        <Link href="/">
          <Home className="h-5 w-5" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
