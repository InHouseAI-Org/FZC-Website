import { Metadata } from 'next';
import IndustryDetailPage from '@/app/pages/IndustryDetail';
import industriesData from '@/data/industries.json';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = industriesData.industries.find((ind) => ind.slug === slug);

  if (!industry) {
    return {
      title: 'Industry Not Found',
      description: 'The requested industry page could not be found.',
    };
  }

  return {
    title: `${industry.title} Sealing Solutions`,
    description: industry.description,
    keywords: [
      industry.title,
      `${industry.title.toLowerCase()} sealing solutions`,
      `${industry.title.toLowerCase()} gaskets`,
      `${industry.title.toLowerCase()} compression packing`,
      'industrial sealing',
      'fluid sealing',
    ],
    openGraph: {
      title: `${industry.title} Sealing Solutions | Inmarco`,
      description: industry.description,
      url: `https://www.inmarco.com/industries/${industry.slug}`,
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${industry.title} Sealing Solutions`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${industry.title} Sealing Solutions | Inmarco`,
      description: industry.description,
    },
    alternates: {
      canonical: `https://www.inmarco.com/industries/${industry.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return industriesData.industries.map((industry) => ({
    slug: industry.slug,
  }));
}

export default async function IndustryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <IndustryDetailPage />;
}
