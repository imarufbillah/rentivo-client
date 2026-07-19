import { Brain, Users, Shield, Rocket } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">About Rentivo</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We are on a mission to make finding your next rental home simple,
          smart, and stress-free.
        </p>
      </div>

      <div className="mt-16 space-y-16">
        <section>
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="mt-4 text-muted-foreground">
            Rentivo was built with a simple idea: finding a rental property
            should not feel like a second job. We combine cutting-edge AI
            technology with a clean, intuitive interface to match renters with
            properties they will actually love. No more scrolling through
            hundreds of irrelevant listings. Our AI learns what you like and
            surfaces the ones that matter.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">What We Offer</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="flex gap-4 rounded-xl border p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">AI-Powered Matching</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Our recommendation engine learns from your behavior to suggest
                  properties tailored to your preferences.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl border p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Smart Chat Assistant</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Have questions? Our AI assistant knows the listings and can
                  help you find exactly what you need.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl border p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Verified Listings</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Every property on Rentivo is reviewed to ensure accuracy,
                  quality, and legitimacy.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl border p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Rocket className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Seamless Payments</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pay rent and deposits securely through our Stripe-powered
                  payment system.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="mt-4 text-muted-foreground">
            Rentivo started as a project to explore how AI can solve real-world
            problems in the rental market. What began as a technical experiment
            grew into a full-featured platform that demonstrates the power of
            combining modern web development with large language models. We
            believe the future of property rental is intelligent, personalized,
            and accessible to everyone.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
