import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.inmarco.com'; // Replace with your actual domain

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      // Specific rules for AI crawlers (GEO - Generative Engine Optimization)
      {
        userAgent: 'GPTBot', // OpenAI
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT user agents
        allow: '/',
      },
      {
        userAgent: 'Google-Extended', // Google's AI training crawler
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai', // Claude
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot', // Claude's web crawler
        allow: '/',
      },
      {
        userAgent: 'claude-web', // Claude web variants
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot', // Perplexity AI
        allow: '/',
      },
      {
        userAgent: 'Applebot-Extended', // Apple Intelligence
        allow: '/',
      },
      {
        userAgent: 'Bytespider', // ByteDance (TikTok)
        allow: '/',
      },
      {
        userAgent: 'FacebookBot', // Meta AI
        allow: '/',
      },
      {
        userAgent: 'cohere-ai', // Cohere
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
