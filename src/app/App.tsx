import { Header } from '@/app/components/Header';
import { Hero } from '@/app/components/Hero';
import { CompanyOverview } from '@/app/components/CompanyOverview';
import { Sustainability } from '@/app/components/Sustainability';
import { ProductCategories } from '@/app/components/ProductCategories';
import { BrandSignature } from '@/app/components/BrandSignature';
import { WhyInmarco } from '@/app/components/WhyInmarco';
import { CTASection } from '@/app/components/CTASection';
import { Footer } from '@/app/components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#2b2a29]">
      <Header />
      <main>
        <Hero />
        <CompanyOverview />
        <Sustainability />
        <ProductCategories />
        <WhyInmarco />
        <BrandSignature />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
