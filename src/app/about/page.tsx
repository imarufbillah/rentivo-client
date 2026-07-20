import { Brain, Users, Shield, Rocket } from "lucide-react";
import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";

const AboutPage = () => {
  return (
    <div className="min-h-dvh mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <AppBreadcrumb segments={[{ label: "About" }]} />
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-balance">
          About Rentivo
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-pretty text-muted-foreground">
          We are on a mission to make finding your next rental home simple,
          smart, and stress-free.
        </p>
      </div>

      <div className="mt-16 space-y-16">
        <section>
          <h2 className="font-display text-2xl font-bold">Our Mission</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Rentivo was built with a simple idea: finding a rental property
            should not feel like a second job. We combine cutting-edge AI
            technology with a clean, intuitive interface to match renters with
            properties they will actually love. No more scrolling through
            hundreds of irrelevant listings. Our AI learns what you like and
            surfaces the ones that matter.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold">What We Offer</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: Brain,
                title: "AI-Powered Matching",
                desc: "Our recommendation engine learns from your behavior to suggest properties tailored to your preferences.",
              },
              {
                icon: Users,
                title: "Smart Chat Assistant",
                desc: "Have questions? Our AI assistant knows the listings and can help you find exactly what you need.",
              },
              {
                icon: Shield,
                title: "Verified Listings",
                desc: "Every property on Rentivo is reviewed to ensure accuracy, quality, and legitimacy.",
              },
              {
                icon: Rocket,
                title: "Seamless Payments",
                desc: "Pay rent and deposits securely through our Stripe-powered payment system.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border bg-card p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold">Our Story</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
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
