import { Hero } from '@/app/components/Hero';
import { Hero1 } from '@/app/components/Hero1';
import { CompanyOverview } from '@/app/components/CompanyOverview';
import { Sustainability } from '@/app/components/Sustainability';
import { ProductCategories } from '@/app/components/ProductCategories';
import { BrandSignature } from '@/app/components/BrandSignature';
import { WhyInmarco } from '@/app/components/WhyInmarco';
import { CTASection } from '@/app/components/CTASection';

export default function Home() {
  return (
    <main>
      <Hero1 />
      <CompanyOverview />
      <Sustainability />
      <ProductCategories />
      <WhyInmarco />
      <BrandSignature />
      <CTASection />
    </main>
  );
}
