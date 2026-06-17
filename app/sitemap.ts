import { MetadataRoute } from 'next';
import productsData from '@/data/productsData.json';
import industriesData from '@/data/industries.json';
import fluidSealingContent from '@/data/fluidSealingContent.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.inmarco.com'; // Replace with your actual domain

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/industries`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fluid-sealing-simplified`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Industry pages
  const industryPages: MetadataRoute.Sitemap = industriesData.industries.map((industry) => ({
    url: `${baseUrl}/industries/${industry.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Product category pages
  const categoryPages: MetadataRoute.Sitemap = productsData.categories.map((category) => ({
    url: `${baseUrl}/products/${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Individual product pages
  const productPages: MetadataRoute.Sitemap = [];
  const products = (productsData as any).products || [];
  const subcategories = (productsData as any).subcategories || [];

  products.forEach((product: any) => {
    const subcategory = subcategories.find((sub: any) => sub.id === product.subcategoryId);
    const category = productsData.categories.find((cat: any) => cat.id === subcategory?.categoryId);

    if (category && subcategory && product.id) {
      productPages.push({
        url: `${baseUrl}/products/${category.id}/${subcategory.id}/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    }
  });

  // Fluid Sealing Simplified blog posts
  const blogPages: MetadataRoute.Sitemap = fluidSealingContent.posts.map((post) => ({
    url: `${baseUrl}/fluid-sealing-simplified/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...industryPages, ...categoryPages, ...productPages, ...blogPages];
}
