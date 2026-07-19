import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <p className="text-8xl font-bold text-primary/20">404</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mx-auto max-w-md text-lg text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or doesn&apos;t exist.
        </p>
        <div className="flex items-center justify-center gap-3 pt-4">
          <Link href="/">
            <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              Back to home
            </Button>
          </Link>
          <Link href="/properties">
            <Button variant="outline" className="rounded-full">
              Browse properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
