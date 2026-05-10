'use client';

import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import fluidSealingData from '@/data/fluidSealingContent.json';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface Post {
  id: number;
  title: string;
  description: string;
  linkedInPostLink: string;
  linkedInEmbedUrl?: string;
  youtubeLink: string;
  date: string;
}

export default function FluidSealingSimplified() {
  const posts: Post[] = fluidSealingData.posts;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getLinkedInThumbnail = (post: Post) => {
    // Use LinkedIn post image if embed URL exists
    // LinkedIn doesn't provide a direct thumbnail URL, so we'll use a placeholder
    // or you can provide custom thumbnails for each post
    if (post.linkedInEmbedUrl) {
      // For now, we'll use a placeholder - you can add custom thumbnail URLs to the JSON
      return post.linkedInEmbedUrl; // This will be handled by iframe preview
    }
    // Fallback to YouTube thumbnail
    const videoId = post.youtubeLink.split('/embed/')[1]?.split('?')[0];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  return (
    <main className="bg-[#2b2a29]">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="h-[2px] w-12 bg-[#e31e24] mb-6"></div>
            <h1 className="text-white mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
              Fluid Sealing Simplified
            </h1>
            <p className="text-gray-300 text-xl">
              Expert insights, technical guides, and industry knowledge to help you understand and optimize your industrial sealing solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-24 bg-[#2b2a29]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-[2px] w-12 bg-[#e31e24]"></div>
              <span className="text-sm tracking-widest text-gray-400 uppercase">Knowledge Hub</span>
            </div>
            <h2 className="text-white text-4xl lg:text-5xl tracking-tight">
              Latest Insights & Resources
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`/fluid-sealing-simplified/${post.id}`}
                  className="block bg-[#1a1918] rounded-lg overflow-hidden border border-gray-800 hover:border-[#e31e24] transition-all duration-300 group h-full"
                >
                  {/* Thumbnail Area */}
                  <div className="relative aspect-video flex items-center justify-center overflow-hidden bg-black">
                    {post.linkedInEmbedUrl ? (
                      /* LinkedIn Embed Preview */
                      <>
                        <iframe
                          src={`${post.linkedInEmbedUrl}?compact=1`}
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          title={post.title}
                          style={{ transform: 'scale(1)', transformOrigin: 'top left' }}
                        />
                        {/* Overlay to prevent interaction and add play button */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 pointer-events-auto"></div>

                        {/* Play Button Overlay */}
                        <div className="relative z-10 w-20 h-20 rounded-full bg-[#e31e24] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg pointer-events-none">
                          <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </>
                    ) : (
                      /* YouTube Thumbnail Fallback */
                      <>
                        <ImageWithFallback
                          src={getLinkedInThumbnail(post)}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
                        <div className="relative z-10 w-20 h-20 rounded-full bg-[#e31e24] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </>
                    )}

                    {/* Article Number Badge */}
                    <div className="absolute top-4 right-4 bg-[#e31e24] text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg z-20">
                      #{post.id}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                      <Calendar className="w-4 h-4 text-[#e31e24]" />
                      <span>{formatDate(post.date)}</span>
                    </div>

                    <h3 className="text-white text-xl mb-3 tracking-tight leading-tight group-hover:text-[#e31e24] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    <div className="flex items-center space-x-2 text-[#e31e24] text-sm font-medium group-hover:space-x-3 transition-all">
                      <span>Read More & Watch</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-white text-3xl lg:text-4xl mb-6 tracking-tight">
                Need Expert Guidance?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Our technical team is ready to help you select the right sealing solution for your specific application.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-[#e31e24] text-white rounded-lg hover:bg-[#c41a20] transition-colors duration-300 text-sm uppercase tracking-wide font-semibold"
                >
                  Contact Our Experts
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-[#e31e24] text-[#e31e24] rounded-lg hover:bg-[#e31e24] hover:text-white transition-colors duration-300 text-sm uppercase tracking-wide font-semibold"
                >
                  Browse Products
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
