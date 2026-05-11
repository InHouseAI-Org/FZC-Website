'use client';

import { motion } from 'motion/react';
import { Calendar, Linkedin, Youtube, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import fluidSealingData from '@/data/fluidSealingContent.json';

interface Post {
  id: number;
  title: string;
  description: string;
  linkedInPostLink: string;
  linkedInEmbedUrl?: string;
  youtubeLink: string;
  date: string;
}

export default function FluidSealingPost() {
  const { id } = useParams();
  const router = useRouter();
  const posts: Post[] = fluidSealingData.posts;
  const post = posts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <main className="bg-[#2b2a29] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl mb-4">Post Not Found</h1>
          <Link href="/fluid-sealing-simplified" className="text-[#e31e24] hover:underline">
            Back to Fluid Sealing Simplified
          </Link>
        </div>
      </main>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get related posts (exclude current post)
  const relatedPosts = posts.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <main className="bg-[#2b2a29]">
      {/* Hero Section */}
      <section className="relative py-16 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-15">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/fluid-sealing-simplified"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-[#e31e24] transition-colors mt-32 mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to All Articles</span>
            </Link>

            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#e31e24]" />
                <span>{formatDate(post.date)}</span>
              </div>
              <span className="text-gray-600">|</span>
              <span className="text-[#e31e24] font-medium">Article #{post.id}</span>
            </div>

            <h1 className="text-white mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.2', letterSpacing: '-0.01em' }}>
              {post.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 bg-[#2b2a29]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* LinkedIn Embed - if available */}
            {post.linkedInEmbedUrl ? (
              <div className="bg-[#1a1918] rounded-lg p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-6 h-6 text-[#0077b5]" />
                    <span className="text-white font-semibold">LinkedIn Post</span>
                  </div>
                  <a
                    href={post.linkedInPostLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-[#0077b5] transition-colors flex items-center space-x-1"
                  >
                    <span>View on LinkedIn</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={`${post.linkedInEmbedUrl}?compact=1`}
                    height="600"
                    width="100%"
                    frameBorder="0"
                    allowFullScreen={true}
                    title={post.title}
                    className="w-full"
                  />
                </div>
              </div>
            ) : (
              /* YouTube Embed - fallback */
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video shadow-2xl">
                <iframe
                  src={post.youtubeLink}
                  title={post.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-[#2b2a29]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#1a1918] p-8 lg:p-12 rounded-lg"
          >
            <h2 className="text-white text-2xl mb-6 tracking-tight">About This Article</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {post.description}
            </p>

            <div className="border-t border-gray-800 pt-8">
              <h3 className="text-white text-xl mb-6 tracking-tight">Share & Connect</h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href={post.linkedInPostLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0077b5] text-white rounded-lg hover:bg-[#006399] transition-colors duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="text-sm font-medium">View on LinkedIn</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-24 bg-[#1a1918]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-[2px] w-12 bg-[#e31e24]"></div>
                <span className="text-sm tracking-widest text-gray-400 uppercase">Continue Learning</span>
              </div>
              <h2 className="text-white text-3xl lg:text-4xl tracking-tight">
                Related Articles
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={`/fluid-sealing-simplified/${relatedPost.id}`}
                    className="block bg-[#2b2a29] rounded-lg overflow-hidden border border-gray-800 hover:border-[#e31e24] transition-all duration-300 group"
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                        <Calendar className="w-4 h-4 text-[#e31e24]" />
                        <span>{formatDate(relatedPost.date)}</span>
                      </div>

                      <h3 className="text-white text-xl mb-3 tracking-tight leading-tight group-hover:text-[#e31e24] transition-colors">
                        {relatedPost.title}
                      </h3>

                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                        {relatedPost.description}
                      </p>

                      <div className="mt-4 flex items-center space-x-2 text-[#e31e24] text-sm font-medium">
                        <span>Read More</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-[#2b2a29]">
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
