import { Layout } from "@/components/layout/Layout";
import {
  HeroSection,
  ServicesSection,
  GallerySection,
  TestimonialsSection,
  AboutSection,
  CTASection,
} from "@/components/home";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <GallerySection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
