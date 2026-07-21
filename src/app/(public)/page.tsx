import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Features } from "@/components/home/Features";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { PropertyTypes } from "@/components/home/PropertyTypes";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { CTASection } from "@/components/home/CTASection";

const HomePage = () => {
  return (
    <div className="min-h-dvh">
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <FeaturedProperties />
      <Features />
      <PropertyTypes />
      <Testimonials />
      <FAQ />
      <CTASection />
    </div>
  );
};

export default HomePage;
