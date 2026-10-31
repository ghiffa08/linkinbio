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
  if (error && (!posts || posts.length === 0)) {
    return null;
  }

  const visiblePosts = posts?.slice(0, 4) || [];

  if (visiblePosts.length === 0) {
    return null;
  }

  return (
    <section className="px-5 sm:px-6 pb-4 pt-1 anim-slide-up">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
          // Instagram Journal
        </span>
        <a
          href="https://instagram.com/haikaljibraan"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-gray-500 hover:text-[#FF5500] transition-colors"
        >
          @haikaljibraan ↗
        </a>
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
              className="flex gap-3.5 p-3 sm:p-3.5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-md transition-all duration-300 group select-none no-underline"
            >
              {/* Clean square visual matching portfolio cards */}
              <div className="w-18 h-18 sm:w-20 sm:h-20 aspect-square rounded-xl overflow-hidden bg-neutral-900 shrink-0 relative">
                <img
                  src={imgSrc}
                  alt={post.caption || 'Instagram Post'}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 ease-out"
                />
                {post.media_type === 'VIDEO' && (
                  <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-xs text-white font-mono text-[8px] px-1.5 py-0.5 rounded-sm">
                    ▶
                  </div>
                )}
              </div>

              {/* Text metadata and caption */}
              <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] font-semibold text-gray-400 group-hover:text-[#FF5500] transition-colors">
                      {formatDate(post.timestamp)}
                    </span>
                    {post.media_type === 'CAROUSEL_ALBUM' && (
                      <span className="font-mono text-[8px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
                        CAROUSEL
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] font-semibold text-gray-900 group-hover:text-[#FF5500] line-clamp-2 leading-snug transition-colors">
                    {post.caption || 'View full post and discussion on Instagram.'}
                  </p>
                </div>
                
                <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-400 group-hover:text-[#FF5500] mt-1.5 flex items-center gap-1 transition-colors">
                  <span>View Post</span>
                  <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">↗</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
