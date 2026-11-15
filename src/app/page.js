
import Navbar from "@/components/navbar/navbar";
import Hero from "@/components/hero/hero";
import Features from "@/components/features/features";
import HowItWorks from "@/components/howitworks/howitworks";
import TemplateShowcase from "@/components/templateshowcase/templateshowcase";
import WhoWeFor from "@/components/whowefor/whowefor";
import Pricing from "@/components/pricing/pricing";
import FAQ from "@/components/faq/faq";
import Footer from "@/components/footer/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <TemplateShowcase />
      <WhoWeFor />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
