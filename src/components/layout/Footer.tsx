import Link from "next/link";

export const Footer = () => (
  <footer className="border-t bg-muted/50">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-sm font-semibold">Rentivo</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            AI-powered property rental platform.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Browse</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/properties" className="hover:text-foreground">Properties</Link></li>
            <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Account</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/login" className="hover:text-foreground">Sign in</Link></li>
            <li><Link href="/register" className="hover:text-foreground">Sign up</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Legal</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li><span className="cursor-default">Privacy</span></li>
            <li><span className="cursor-default">Terms</span></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Rentivo. All rights reserved.
      </div>
    </div>
  </footer>
);
