import Link from "next/link";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Find Your Perfect Rental
        </h1>
        <p className="text-lg text-muted-foreground">
          AI-powered property recommendations tailored to your preferences.
          Browse listings, save favorites, and let our assistant help you find home.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/properties">
            <Button size="lg" className="w-full sm:w-auto">
              Browse Properties
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
