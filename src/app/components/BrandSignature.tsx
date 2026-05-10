'use client';

import { motion } from 'motion/react';
import { Play, BookOpen, Video, Users } from 'lucide-react';
import Link from 'next/link';
import fluidSealingContent from '@/data/fluidSealingContent.json';

interface Post {
  id: number;
  title: string;
  description: string;
  linkedInPostLink: string;
  linkedInEmbedUrl?: string;
  youtubeLink: string;
  date: string;
}

export function BrandSignature() {
  // Get the first 3 posts for display on home page
  const videoSeries: Post[] = fluidSealingContent.posts.slice(0, 3);

  // Function to extract YouTube video ID and construct thumbnail URL
  const getYouTubeThumbnail = (youtubeLink: string) => {
    const videoId = youtubeLink.split('/embed/')[1]?.split('?')[0];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Truncate description to approximately 2 lines (about 100 characters)
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <section className="relative bg-[#252423] py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center space-x-3 mb-6"
          >
            <h2
              className="text-white"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.1', letterSpacing: '-0.02em' }}
            >
              Fluid Sealing{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#e31e24] via-blue-500 to-purple-500">
                Simplified
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-lg mb-4"
          >
            Free educational video series breaking down complex fluid sealing concepts into simple, actionable knowledge
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center space-x-2 text-sm text-gray-500"
          >
            <span>Powered by</span>
            <span className="text-[#e31e24] font-semibold" style={{ fontFamily: 'SwitzerlandCondBlack, Switzerland, sans-serif', fontSize:'15px', marginTop:'3px'}}>INMARCO</span>
          </motion.div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {videoSeries.map((video, index) => (
            <Link key={video.id} href={`/fluid-sealing-simplified/${video.id}`} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0 }}
                whileHover={{ y: -10 }}
                className="group relative bg-[#1a1918] rounded-xl overflow-hidden border border-gray-800 hover:border-[#e31e24]/50 transition-all duration-500 cursor-pointer h-full flex flex-col"
              >
                {/* Video Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-gray-900">
                  {video.linkedInEmbedUrl ? (
                    /* LinkedIn Embed Preview */
                    <>
                      <iframe
                        src={`${video.linkedInEmbedUrl}?compact=1`}
                        className="absolute inset-0 w-full h-full pointer-events-none object-cover"
                        title={video.title}
                        style={{ transform: 'scale(1)', transformOrigin: 'top left' }}
                      />
                      {/* Overlay to prevent interaction */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors pointer-events-auto"></div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div
                          className="w-16 h-16 rounded-full bg-[#e31e24] flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </motion.div>
                      </div>
                    </>
                  ) : (
                    /* YouTube Thumbnail */
                    <>
                      <img
                        src={getYouTubeThumbnail(video.youtubeLink)}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
                        <motion.div
                          className="w-16 h-16 rounded-full bg-[#e31e24] flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </motion.div>
                      </div>
                    </>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white text-lg font-light group-hover:text-[#e31e24] transition-colors">
                      {video.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                    {truncateDescription(video.description)}
                  </p>

                  {/* Date and Watch More Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800 mt-auto">
                    <span className="text-xs text-gray-500">{formatDate(video.date)}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-1 text-[#e31e24] text-sm hover:text-white transition-colors"
                    >
                      <span>Watch</span>
                      <Play className="w-3 h-3" fill="currentColor" />
                    </motion.button>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#e31e24]/10 to-transparent pointer-events-none transition-opacity duration-500"></div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Stats and CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative"
        >
          {/* Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#e31e24]/20 via-blue-500/20 to-purple-500/20 blur-2xl opacity-30"></div>

          <div className="relative bg-gradient-to-br from-[#1a1918] via-[#0f0f0f] to-[#1a1918] border-2 border-[#e31e24]/30 rounded-2xl p-10 lg:p-14 shadow-2xl">
            {/* Accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#e31e24] to-transparent"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: Video, value: '6', label: 'Videos', color: 'from-red-500 to-red-600' },
                  { icon: Users, value: '10K+', label: 'Learners', color: 'from-blue-500 to-blue-600' },
                  { icon: BookOpen, value: 'Free', label: 'Always', color: 'from-purple-500 to-purple-600' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.1, delay: 0 }}
                    whileHover={{ y: -5 }}
                    className="relative group"
                  >
                    {/* Background glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br  opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-lg`}></div>

                    <div className="relative bg-[#2b2a29]/50 backdrop-blur-sm border border-gray-800 group-hover:border-[#e31e24]/50 rounded-lg p-6 text-center transition-all duration-300">
                      <motion.div
                        transition={{ duration: 0 }}
                      >
                        <stat.icon className="w-10 h-10 text-[#e31e24] mx-auto mb-4" />
                      </motion.div>
                      <div className="text-4xl text-white mb-2 font-light">{stat.value}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Right: CTA */}
              <div className="text-center lg:text-left">
                <motion.h3
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="text-3xl text-white mb-4 font-light leading-tight"
                >
                  Ready to master <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e31e24] to-purple-500">fluid sealing</span>?
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className="text-gray-400 mb-8 leading-relaxed"
                >
                  Access our complete library of educational videos and become an expert
                </motion.p>
                <Link href="/fluid-sealing-simplified">
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(227, 30, 36, 0.6)" }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-10 py-5 bg-gradient-to-r from-[#e31e24] to-[#c41a20] text-white font-medium tracking-wide overflow-hidden flex items-center space-x-3 mx-auto lg:mx-0 group shadow-lg shadow-[#e31e24]/20"
                  >
                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                    <Play className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
                    <span className="relative z-10 text-lg">Watch Now</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
