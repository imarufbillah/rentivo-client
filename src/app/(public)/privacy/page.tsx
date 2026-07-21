import Link from "next/link";

const PrivacyPage = () => {
  return (
    <div className="min-h-dvh mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: July 19, 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            1. Information We Collect
          </h2>
          <p>
            When you use Rentivo, we collect information you provide directly,
            such as your name, email address, and payment information when you
            create an account or make a rental transaction. We also collect
            usage data including your browsing history, saved properties, and
            search preferences to power our AI recommendation engine.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            2. How We Use Your Information
          </h2>
          <p>
            We use your information to provide and improve our services,
            process payments, send you rental-related communications, and
            generate personalized AI recommendations. Your browsing patterns
            help our recommendation engine learn your preferences and suggest
            better properties over time.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            3. Data Sharing
          </h2>
          <p>
            We do not sell your personal information to third parties. We may
            share your data with property owners when you initiate a rental
            inquiry, and with payment processors (Stripe) to handle
            transactions securely. We may also share anonymized, aggregated
            data for analytics purposes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            4. Data Security
          </h2>
          <p>
            We implement industry-standard security measures to protect your
            personal information. All payment data is processed through Stripe
            and never stored on our servers. We use encryption, secure
            authentication, and regular security audits to keep your data safe.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            5. Cookies and Tracking
          </h2>
          <p>
            Rentivo uses essential cookies for authentication and session
            management. We also use analytics cookies to understand how users
            interact with our platform, which helps us improve the user
            experience and our AI recommendations.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            6. Your Rights
          </h2>
          <p>
            You have the right to access, update, or delete your personal
            information at any time through your profile settings. You can
            also request a copy of all data we hold about you by contacting
            our support team.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            7. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please
            contact us at support@rentivo.com or visit our{" "}
            <Link href="/contact" className="text-primary underline">
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
