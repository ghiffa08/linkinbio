import React from 'react';

/**
 * Helper to format ISO timestamp into monospace Swiss Design friendly format (e.g. "10 JUL 2026").
 */
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();
};

export function InstagramFeed({ posts, error }) {
  if (error) {
    return (
      <section className="px-6 pb-4 pt-1 anim-slide-up opacity-0">
        <div className="font-mono text-[10px] text-gray-400 mb-2 uppercase tracking-widest">
          [ INSTAGRAM JOURNAL ]
        </div>
        <div className="p-6 border border-red-200 bg-red-50/50 text-center rounded-sm">
          <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 font-bold mb-1">
            Failed to load feed
          </p>
          <p className="text-[10px] text-red-500 font-mono">
            {error.message || 'Please check your IG_ACCESS_TOKEN configuration.'}
          </p>
        </div>
      </section>
    );
  }

  const visiblePosts = posts?.slice(0, 4) || [];

  if (visiblePosts.length === 0) {
    return null;
  }

  return (
    <section className="px-6 pb-4 pt-1 anim-slide-up opacity-0">
      <div className="font-mono text-[10px] text-gray-400 mb-2 uppercase tracking-widest">
        [ INSTAGRAM JOURNAL ]
      </div>
      
      <div className="flex flex-col gap-3">
        {visiblePosts.map((post) => {
          const imgSrc = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
          return (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 p-4 bg-white border border-[#E5E5E5] hover:border-[#111111] transition-all duration-300 group"
            >
              {/* Grayscale thumbnail image that reveals color on hover */}
              <div className="w-16 h-16 aspect-square overflow-hidden bg-[#E5E5E5] flex-shrink-0 border border-[#E5E5E5] p-0.5 relative">
                <img
                  src={imgSrc}
                  alt={post.caption || 'Instagram Post'}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
                />
                {post.media_type === 'VIDEO' && (
                  <div className="absolute top-1 right-1 bg-[#111111]/80 text-white font-mono text-[8px] px-1 py-0.5 leading-none uppercase">
                    ▶
                  </div>
                )}
              </div>

              {/* Text metadata and caption */}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[9px] font-bold text-gray-400 group-hover:text-[#3B82F6] transition-colors">
                      {formatDate(post.timestamp)}
                    </span>
                    {post.media_type === 'CAROUSEL_ALBUM' && (
                      <span className="font-mono text-[7px] text-gray-400 bg-gray-50 border border-[#E5E5E5] px-1 py-0.2 uppercase scale-90">
                        CAROUSEL
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-tight line-clamp-2 text-[#111111] leading-snug group-hover:text-gray-600 transition-colors">
                    {post.caption || 'View on Instagram'}
                  </p>
                </div>
                
                <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#111111] mt-2 flex items-center gap-1 group-hover:text-[#3B82F6] transition-colors">
                  View Post <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">↗</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
