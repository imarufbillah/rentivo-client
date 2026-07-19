import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Features } from "@/components/home/Features";
import { PropertyTypes } from "@/components/home/PropertyTypes";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { CTASection } from "@/components/home/CTASection";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <Features />
      <PropertyTypes />
      <Testimonials />
      <FAQ />
      <CTASection />
    </div>
  );
};

export default HomePage;
