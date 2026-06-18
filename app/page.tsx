import dynamic from 'next/dynamic';
import { Hero } from '@/app/components/Hero';
import { CompanyOverview } from '@/app/components/CompanyOverview';

// Lazy load below-the-fold components for faster initial load
const Sustainability = dynamic(() => import('@/app/components/Sustainability').then(mod => ({ default: mod.Sustainability })), {
  loading: () => <div className="h-96" />, // Placeholder to prevent layout shift
});

const ProductCategories = dynamic(() => import('@/app/components/ProductCategories').then(mod => ({ default: mod.ProductCategories })), {
  loading: () => <div className="h-96" />,
});

const WhyInmarco = dynamic(() => import('@/app/components/WhyInmarco').then(mod => ({ default: mod.WhyInmarco })), {
  loading: () => <div className="h-96" />,
});

const BrandSignature = dynamic(() => import('@/app/components/BrandSignature').then(mod => ({ default: mod.BrandSignature })), {
  loading: () => <div className="h-96" />,
});

const CTASection = dynamic(() => import('@/app/components/CTASection').then(mod => ({ default: mod.CTASection })), {
  loading: () => <div className="h-64" />,
});

export default function Home() {
  return (
    <main>
      <Hero />
      <CompanyOverview />
      <Sustainability />
      <ProductCategories />
      <WhyInmarco />
      <BrandSignature />
      <CTASection />
    </main>
  );
}
