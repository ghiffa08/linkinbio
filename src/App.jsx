import React, { useEffect } from 'react';
import useSWR from 'swr';
import { gsap } from 'gsap';
import { supabase } from './lib/supabaseClient';
import { slugify } from './utils/slugify';
import { useInstagramFeed } from './hooks/useInstagramFeed';
import { InstagramFeed } from './components/InstagramFeed';

const fetchLinks = async () => {
  const { data, error } = await supabase
    .from('bio_links')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data;
};

const fetchPersonalInfo = async () => {
  const { data, error } = await supabase.from('personal_info').select('*').single();
  if (error) throw error;
  return data;
};

const fetchSettings = async () => {
  const { data, error } = await supabase.from('general_settings').select('*').single();
  if (error) throw error;
  return data;
};

const fetchLatestProject = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export default function App() {
  const { data: links, isLoading: isLinksLoading } = useSWR('bio_links', fetchLinks);
  const { data: info, isLoading: isInfoLoading } = useSWR('personal_info', fetchPersonalInfo);
  const { data: settings, isLoading: isSettingsLoading } = useSWR('general_settings', fetchSettings);
  const { data: latestProject, isLoading: isProjectLoading } = useSWR('latest_project', fetchLatestProject);
  const { data: instagramPosts, error: instagramError, isLoading: isInstagramLoading } = useInstagramFeed();

  const isLoading = isLinksLoading || isInfoLoading || isSettingsLoading || isProjectLoading || isInstagramLoading;

  // Initialize GSAP Animations when data is ready
  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      // Small delay to ensure React has fully committed the DOM
      gsap.fromTo('.anim-fade-down', 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.05, delay: 0.05 }
      );

      gsap.fromTo('.anim-slide-up', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.05, delay: 0.15 }
      );
    });

    return () => ctx.revert(); // Cleanup GSAP context on unmount
  }, [isLoading]);

  const directoryLinks = links?.filter(l => !l.featured) || [];

  // Parse Personal Info safely
  const fullName = info?.full_name || 'HAIKAL JIBRAN';
  const nameParts = fullName.split(' ');
  const headline_1 = nameParts.slice(0, 2).join(' ');
  const headline_2 = nameParts.slice(2).join(' ');
  
  const appName = settings?.app_name || 'GHIFFA.DEV';
  const email = info?.email || 'haikaljibran.dev@gmail.com';
  const phone = info?.phone_number || '+6285156958580';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --bg: #FAFAFA;
          --text: #111111;
          --grid-line: #E5E5E5;
          --accent: #3B82F6;
        }

        body {
          background-color: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .hairline-b { border-bottom: 1px solid var(--grid-line); }
        .hairline-t { border-top: 1px solid var(--grid-line); }
        .hairline-r { border-right: 1px solid var(--grid-line); }
        .hairline-l { border-left: 1px solid var(--grid-line); }
        
        ::selection { background: var(--text); color: var(--bg); }
        
        /* Noise Overlay for Editorial Vibe */
        .bg-noise {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none;
          z-index: 50;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}} />

      <div className="bg-noise"></div>

      <div className="min-h-screen flex justify-center w-full bg-[#FAFAFA] p-0 sm:p-4 md:p-8">
        
        <div className="w-full max-w-[480px] min-h-screen sm:min-h-0 bg-[#FAFAFA] flex flex-col relative sm:hairline-l sm:hairline-r sm:border-[#E5E5E5] sm:shadow-2xl sm:shadow-black/5 overflow-hidden">
          
          {/* 1. TOP BAR */}
          <header className="flex justify-between items-center p-4 hairline-b anim-fade-down opacity-0 font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase">
            <div>[ VOL. 01 ]</div>
            <div className="text-center">{appName}</div>
            <div className="text-right">KUNINGAN</div>
          </header>

          {isLoading ? (
            <div className="flex-1 p-6 space-y-8 animate-pulse">
              <div className="flex justify-center"><div className="h-16 w-3/4 bg-gray-200" /></div>
              <div className="flex justify-center"><div className="h-4 w-1/2 bg-gray-200" /></div>
              <div className="h-32 w-full bg-gray-200 mt-12" />
              <div className="h-32 w-full bg-gray-200 mt-4" />
              <div className="space-y-4 mt-8">
                {[1,2,3].map(i => <div key={i} className="h-16 w-full bg-gray-200" />)}
              </div>
            </div>
          ) : (
            <>
              {/* 2. HERO / PROFILE */}
              <section className="pt-12 pb-8 px-6 text-center anim-fade-down opacity-0">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-[0.85] mb-4">
                  {headline_1}
                  {headline_2 && (
                    <>
                      <br />
                      <span className="text-gray-400">{headline_2}</span>
                    </>
                  )}
                </h1>

                <div className="sr-only">
                  Welcome to the official digital links directory of Haikal Jibran Al-Ghiffarry. As an IoT Engineer and Full-stack Developer from Universitas Kuningan, I bridge the gap between hardware and software. Find my official website, GitHub, LinkedIn, and latest projects below.
                </div>
                
                <div className="font-mono text-xs text-[#3B82F6] uppercase tracking-widest mb-4">
                  {info?.headline || 'Building the bridge between bits and atoms.'}
                </div>
                
                <p className="text-sm font-medium text-gray-600 px-4">
                  {info?.role || 'IoT Engineer | Fullstack Developer'}
                </p>
              </section>

              {/* 3. LATEST PROJECT */}
              {latestProject && (
                <section className="px-6 py-4 anim-slide-up opacity-0">
                  <div className="font-mono text-[10px] text-gray-400 mb-2 uppercase tracking-widest">
                    [ LATEST PROJECT ]
                  </div>
                  <a 
                    href={`https://ghiffa.dev/project/${slugify(latestProject.title)}`} 
                    target="_blank" rel="noreferrer"
                    className="block relative overflow-hidden group hairline-t hairline-b hairline-l hairline-r bg-[#111111] text-[#FAFAFA] p-6 hover:bg-[#3B82F6] transition-colors duration-500"
                  >
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2 relative z-10 truncate">
                      {latestProject.title}
                    </h2>
                    <p className="font-mono text-xs text-gray-400 group-hover:text-blue-100 relative z-10 transition-colors truncate">
                      {latestProject.category} ↗
                    </p>
                    <div className="absolute -right-4 -bottom-4 text-8xl font-black text-white opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12 pointer-events-none">
                      P
                    </div>
                  </a>
                </section>
              )}

              {/* 4. INSTAGRAM FEED */}
              <InstagramFeed posts={instagramPosts} error={instagramError} />

              {/* 5. LINK LIST */}
              {directoryLinks.length > 0 && (
                <section className="flex-1 flex flex-col mt-4 anim-slide-up opacity-0">
                  <div className="px-6 font-mono text-[10px] text-gray-400 mb-2 uppercase tracking-widest">
                    [ DIRECTORY ]
                  </div>
                  
                  <ul className="flex flex-col w-full hairline-t list-none p-0 m-0">
                    <li>
                      <a 
                        href="https://ghiffa.dev" 
                        target="_blank" rel="noreferrer"
                        className="group flex items-center justify-between p-5 sm:p-6 hairline-b hover:bg-[#111111] hover:text-[#FAFAFA] transition-colors duration-300"
                      >
                        <div className="flex items-center space-x-4 sm:space-x-6">
                          <span className="font-mono text-xs text-gray-400 group-hover:text-[#3B82F6] transition-colors">
                            00.
                          </span>
                          <div>
                            <h3 className="font-bold text-lg uppercase tracking-tight mb-0.5">
                              Official Website
                            </h3>
                            <p className="font-mono text-[10px] text-gray-500 group-hover:text-gray-400 uppercase">
                              ghiffa.dev Portfolio
                            </p>
                          </div>
                        </div>
                        
                        {/* Arrow Icon */}
                        <div className="text-gray-300 group-hover:text-[#FAFAFA] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 font-mono text-lg">
                          ↗
                        </div>
                      </a>
                    </li>
                    {directoryLinks.map((link, idx) => (
                      <li key={link.id}>
                        <a 
                          href={link.url}
                          target="_blank" rel="noreferrer"
                          className="group flex items-center justify-between p-5 sm:p-6 hairline-b hover:bg-[#111111] hover:text-[#FAFAFA] transition-colors duration-300"
                        >
                          <div className="flex items-center space-x-4 sm:space-x-6">
                            <span className="font-mono text-xs text-gray-400 group-hover:text-[#3B82F6] transition-colors">
                              {String(idx + 1).padStart(2, '0')}.
                            </span>
                            <div>
                              <h3 className="font-bold text-lg uppercase tracking-tight mb-0.5">
                                {link.title}
                              </h3>
                              <p className="font-mono text-[10px] text-gray-500 group-hover:text-gray-400 uppercase">
                                {link.subtitle}
                              </p>
                            </div>
                          </div>
                          
                          {/* Arrow Icon */}
                          <div className="text-gray-300 group-hover:text-[#FAFAFA] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 font-mono text-lg">
                            ↗
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 6. FOOTER */}
              <footer className="mt-auto p-6 hairline-t flex flex-col items-center justify-center bg-[#FAFAFA] anim-slide-up opacity-0">
                <div className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2 text-center">
                  © {new Date().getFullYear()} {fullName}
                </div>
                <div className="flex space-x-4 font-mono text-[10px] text-[#111111] font-bold">
                  <a href={`mailto:${email}`} className="hover:text-[#3B82F6] border-b border-transparent hover:border-[#3B82F6] transition-colors uppercase">EMAIL</a>
                  {phone && (
                    <>
                      <span>/</span>
                      <a href={`tel:${phone}`} className="hover:text-[#3B82F6] border-b border-transparent hover:border-[#3B82F6] transition-colors uppercase">PHONE</a>
                    </>
                  )}
                </div>
              </footer>
            </>
          )}

        </div>
      </div>
    </>
  );
}
