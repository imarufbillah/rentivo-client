import Link from "next/link";

const TermsPage = () => {
  return (
    <div className="min-h-dvh mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: July 19, 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using Rentivo, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do
            not use our platform. We reserve the right to update these terms
            at any time, and continued use constitutes acceptance of any
            changes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            2. User Accounts
          </h2>
          <p>
            You must be at least 18 years old to create an account. You are
            responsible for maintaining the security of your account
            credentials and for all activities that occur under your account.
            You agree to provide accurate and complete information when
            creating your account.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            3. Property Listings
          </h2>
          <p>
            Property owners are solely responsible for the accuracy of their
            listings. Rentivo reviews listings for quality but does not
            guarantee the availability, pricing, or condition of any property.
            Renters should verify all details directly with the owner before
            making any commitments.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            4. Payments
          </h2>
          <p>
            All payments are processed through Stripe. Rentivo does not store
            your payment information. Rent and deposit amounts are set by
            property owners. Refund policies are determined by the property
            owner and the terms of the rental agreement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            5. Prohibited Conduct
          </h2>
          <p>
            You agree not to: misuse the platform or attempt to access it
            through unauthorized means; post false, misleading, or fraudulent
            listings; harass or spam other users; or use the platform for any
            illegal purpose. Violation of these terms may result in account
            suspension or termination.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            6. Limitation of Liability
          </h2>
          <p>
            Rentivo is a platform that connects renters with property owners.
            We are not a party to any rental agreement and are not liable for
            any disputes between renters and owners. Our liability is limited
            to the maximum extent permitted by law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            7. Termination
          </h2>
          <p>
            We may suspend or terminate your account at any time if you
            violate these terms or engage in conduct that we reasonably
            believe is harmful to the platform or other users. You may also
            delete your account at any time through your profile settings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-foreground">
            8. Contact
          </h2>
          <p>
            For questions about these Terms of Service, contact us at
            support@rentivo.com or visit our{" "}
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

export default TermsPage;
