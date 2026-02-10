import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import Home from '@/app/pages/Home';
import AboutUs from '@/app/pages/AboutUs';
import IndustriesPage from '@/app/pages/Industries';
import IndustryDetail from '@/app/pages/IndustryDetail';
import Contact from '@/app/pages/Contact';
import FluidSealingSimplified from '@/app/pages/FluidSealingSimplified';
import FluidSealingPost from '@/app/pages/FluidSealingPost';
import Products from '@/app/pages/Products';
import ProductCategoryLanding from '@/app/pages/ProductCategoryLanding';
import ProductCategory from '@/app/pages/ProductCategory';
import ProductDetail from '@/app/pages/ProductDetail';
import PrivacyPolicy from '@/app/pages/PrivacyPolicy';
import TermsOfService from '@/app/pages/TermsOfService';
import CookiePolicy from '@/app/pages/CookiePolicy';
import DesignDeck from '@/app/pages/DesignDeck';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Design Deck - Full screen without header/footer */}
        <Route path="/deck" element={<DesignDeck />} />

        {/* All other routes with header/footer */}
        <Route path="*" element={
          <div className="min-h-screen bg-[#2b2a29]">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/industries" element={<IndustriesPage />} />
              <Route path="/industries/:slug" element={<IndustryDetail />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:categorySlug/:subcategorySlug/:productSlug" element={<ProductDetail />} />
              <Route path="/products/:categorySlug/:subcategorySlug" element={<ProductCategory />} />
              <Route path="/products/:categorySlug" element={<ProductCategoryLanding />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/fluid-sealing-simplified" element={<FluidSealingSimplified />} />
              <Route path="/fluid-sealing-simplified/:id" element={<FluidSealingPost />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}
