import React, { useState } from 'react';
import useSWR from 'swr';
import { 
  Globe, 
  Mail, 
  Flame, 
  ArrowUpRight, 
  Sparkles,
  Layers,
  Code2
} from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { slugify } from './utils/slugify';
import { useInstagramFeed } from './hooks/useInstagramFeed';
import { InstagramFeed } from './components/InstagramFeed';

// Brand SVGs matching ghiffa.dev portfolio
const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

// Map link items to appropriate icons
const getLinkIcon = (title = '', url = '') => {
  const lower = (title + ' ' + url).toLowerCase();
  if (lower.includes('github')) return <GithubIcon className="w-4 h-4 text-[#18181B]" />;
  if (lower.includes('linkedin')) return <LinkedinIcon className="w-4 h-4 text-[#0A66C2]" />;
  if (lower.includes('instagram')) return <InstagramIcon className="w-4 h-4 text-[#E1306C]" />;
  if (lower.includes('skillstreak')) return <Flame className="w-4 h-4 text-[#FF5500]" />;
  if (lower.includes('mail') || lower.includes('@')) return <Mail className="w-4 h-4 text-[#EA4335]" />;
  if (lower.includes('portfolio') || lower.includes('website') || lower.includes('ghiffa.dev')) return <Globe className="w-4 h-4 text-[#FF5500]" />;
  return <Layers className="w-4 h-4 text-gray-500" />;
};

const DEFAULT_INFO = {
  full_name: 'Haikal Jibran Al-Ghiffarry',
  headline: 'Building the bridge between bits and atoms.',
  role: 'IoT Engineer & Fullstack Web Developer',
  email: 'hello@ghiffa.dev',
  phone_number: '+6285156958580',
};

const DEFAULT_LINKS = [
  { id: '1', title: 'Main Portfolio Website', subtitle: 'ghiffa.dev', url: 'https://ghiffa.dev', featured: false },
  { id: '2', title: 'LinkedIn Profile', subtitle: 'Professional Network', url: 'https://linkedin.com/in/haikal-jibran-al-ghiffarry', featured: false },
  { id: '3', title: 'GitHub Repositories', subtitle: 'Open Source & Code', url: 'https://github.com/ghiffa08', featured: false },
  { id: '4', title: 'Instagram', subtitle: '@haikaljibraan', url: 'https://instagram.com/haikaljibraan', featured: false },
  { id: '5', title: 'Send an Email', subtitle: 'hello@ghiffa.dev', url: 'mailto:hello@ghiffa.dev', featured: false },
];

const DEFAULT_PROJECT = {
  title: 'Kredit Raksa Analytica',
  category: 'FEATURED WORK',
};

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
  const { data: rawLinks } = useSWR('bio_links', fetchLinks, { fallbackData: DEFAULT_LINKS });
  const { data: rawInfo } = useSWR('personal_info', fetchPersonalInfo, { fallbackData: DEFAULT_INFO });
  const { data: rawProject } = useSWR('latest_project', fetchLatestProject, { fallbackData: DEFAULT_PROJECT });
  const { data: instagramPosts, error: instagramError } = useInstagramFeed();

  const [aiActive, setAiActive] = useState(false);

  const info = rawInfo || DEFAULT_INFO;
  const links = rawLinks && rawLinks.length > 0 ? rawLinks : DEFAULT_LINKS;
  const latestProject = rawProject || DEFAULT_PROJECT;

  const directoryLinks = links.filter(l => !l.featured);

  const fullName = info.full_name || 'Haikal Jibran Al-Ghiffarry';
  const headline = info.headline || 'Building the bridge between bits and atoms.';
  const role = info.role || 'IoT Engineer & Fullstack Web Developer';
  const email = info.email || 'hello@ghiffa.dev';
  const phone = info.phone_number || '+6285156958580';

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-[#141414] font-sans antialiased selection:bg-[#FF5500] selection:text-white flex justify-center p-0 sm:p-5 md:p-8">
      
      {/* Outer Shell: Dot Grid Canvas Container with clean border on larger screens */}
      <div className="w-full max-w-[540px] min-h-screen sm:min-h-0 bg-white sm:rounded-3xl flex flex-col relative sm:border sm:border-gray-200/80 sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] overflow-hidden">
        
        {/* Architectural Dot-Grid Background Canvas matching ghiffa.dev */}
        <div className="absolute inset-0 bg-architectural-dots pointer-events-none opacity-90 z-0" />

        {/* 1. TOP STATUS BAR (Figma / Minimalist Header) */}
        <header className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
              ghiffa.dev / links
            </span>
          </div>

          {/* AI Mode Pill Toggle matching portfolio hero */}
          <button
            type="button"
            onClick={() => setAiActive(!aiActive)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100/90 hover:bg-gray-200/80 border border-gray-200 text-[10px] font-mono font-semibold transition-all cursor-pointer shadow-2xs"
            title="Toggle AI Persona Mode"
          >
            <Sparkles className={`w-3 h-3 ${aiActive ? 'text-[#FF5500]' : 'text-gray-400'}`} />
            <span className={aiActive ? 'text-[#FF5500]' : 'text-gray-600'}>
              AI Mode: {aiActive ? 'ON' : 'OFF'}
            </span>
          </button>
        </header>

        <div className="relative z-10 flex-1 flex flex-col pb-6">
          
          {/* 2. HERO FIGMA CANVAS IDENTIFIER */}
          <section className="pt-8 pb-6 px-6 text-center relative">
            
            {/* Figma Bounding Box wrapping ghiffa.dev */}
            <div className="inline-block relative px-6 py-3.5 mb-4 select-none">
              <div className="figma-bbox bg-white/40 backdrop-blur-2xs">
                {/* 8 Figma resize handles */}
                <span className="figma-handle -top-1 -left-1" />
                <span className="figma-handle -top-1 left-1/2 -translate-x-1/2" />
                <span className="figma-handle -top-1 -right-1" />
                <span className="figma-handle top-1/2 -left-1 -translate-y-1/2" />
                <span className="figma-handle top-1/2 -right-1 -translate-y-1/2" />
                <span className="figma-handle -bottom-1 -left-1" />
                <span className="figma-handle -bottom-1 left-1/2 -translate-x-1/2" />
                <span className="figma-handle -bottom-1 -right-1" />
              </div>

              {/* Multiplayer Cursor Badge pinned to bounding box */}
              <div className="absolute -top-3.5 -right-2 sm:-right-3 flex items-center gap-1 bg-[#FF5500] text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-[3px] shadow-sm z-30 pointer-events-none">
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16">
                  <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
                </svg>
                <span>{aiActive ? 'Claude 3.7 (AI)' : 'Ghiffa (Lead)'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141414] font-sans m-0 leading-tight">
                ghiffa.dev
              </h1>
            </div>

            {/* Subtitle / Bio details */}
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight mb-1.5">
              {fullName}
            </h2>
            
            <p className="font-mono text-xs text-[#FF5500] font-semibold mb-2">
              {aiActive ? '// Autonomous Full-Stack AI Engineer Persona' : headline}
            </p>
            
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              {role} • Kuningan, West Java, ID
            </p>

            {/* Quick Contact & Social Floating Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200/90 text-xs font-medium text-gray-700 hover:text-black hover:border-gray-400 shadow-2xs hover:shadow-xs transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-[#EA4335]" />
                <span>Email</span>
              </a>
              <a
                href="https://github.com/ghiffa08"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200/90 text-xs font-medium text-gray-700 hover:text-black hover:border-gray-400 shadow-2xs hover:shadow-xs transition-all"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/haikal-jibran-al-ghiffarry"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200/90 text-xs font-medium text-gray-700 hover:text-black hover:border-gray-400 shadow-2xs hover:shadow-xs transition-all"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span>LinkedIn</span>
              </a>
            </div>
          </section>

          {/* 3. FEATURED PLATFORM: SKILLSTREAK.ID (Signature Flame Orange Banner) */}
          <section className="px-5 sm:px-6 py-2">
            <div className="font-mono text-[10px] text-gray-400 mb-2 px-1 uppercase tracking-widest font-semibold">
              // Flagship Platform
            </div>
            <a
              href="https://skillstreak.id"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block p-5 rounded-2xl bg-[#111111] text-white border border-neutral-800 shadow-md hover:shadow-xl hover:border-[#FF5500]/50 transition-all duration-300 overflow-hidden no-underline"
            >
              {/* Orange glowing aura */}
              <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-[#FF5500]/20 blur-2xl group-hover:bg-[#FF5500]/35 transition-all pointer-events-none" />

              <div className="flex items-start justify-between gap-4 mb-2.5 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF5500] flex items-center justify-center shadow-xs">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-orange-400 font-bold block">
                      Gamified Coding Platform
                    </span>
                    <h2 className="text-lg font-bold tracking-tight text-white m-0">
                      skillstreak.id
                    </h2>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-[#FF5500] text-white flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed mb-4 relative z-10 font-normal">
                The fastest path from zero to deployable engineer, built like a game and engineered for the real world.
              </p>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping shrink-0" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-orange-300 font-semibold">
                    Live Platform
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#FF5500] hover:bg-[#E64D00] px-3 py-1 rounded-full shadow-xs transition-colors">
                  Explore ↗
                </span>
              </div>
            </a>
          </section>

          {/* 4. LATEST SELECTED WORK CARD */}
          {latestProject && (
            <section className="px-5 sm:px-6 py-2">
              <div className="font-mono text-[10px] text-gray-400 mb-2 px-1 uppercase tracking-widest font-semibold">
                // Latest Selected Work
              </div>
              <a 
                href={`https://ghiffa.dev/project/${slugify(latestProject.title)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block p-4 bg-white rounded-2xl border border-gray-150 hover:border-gray-300 shadow-xs hover:shadow-md transition-all duration-300 select-none no-underline"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-800 shrink-0 group-hover:bg-[#FF5500]/10 group-hover:text-[#FF5500] transition-colors">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#FF5500] font-semibold block truncate">
                        {latestProject.category || 'FEATURED WORK'}
                      </span>
                      <h3 className="text-sm font-bold text-gray-950 group-hover:text-[#FF5500] transition-colors truncate m-0">
                        {latestProject.title}
                      </h3>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-black transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>
              </a>
            </section>
          )}

          {/* 5. DIRECTORY LINKS (Custom Bio Links) */}
          {directoryLinks.length > 0 && (
            <section className="px-5 sm:px-6 py-2">
              <div className="font-mono text-[10px] text-gray-400 mb-2.5 px-1 uppercase tracking-widest font-semibold">
                // Directory & Socials
              </div>
              
              <div className="flex flex-col gap-2.5">
                {directoryLinks.map((link) => (
                  <a 
                    key={link.id}
                    href={link.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-3.5 bg-white rounded-2xl border border-gray-150 hover:border-gray-300 shadow-xs hover:shadow-md transition-all duration-300 no-underline"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gray-50 text-gray-700 group-hover:bg-orange-50 group-hover:text-[#FF5500] flex items-center justify-center shrink-0 transition-colors">
                        {getLinkIcon(link.title, link.url)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#FF5500] transition-colors truncate m-0">
                          {link.title}
                        </h3>
                        {link.subtitle && (
                          <p className="font-mono text-[10px] text-gray-500 truncate m-0">
                            {link.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-black transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* 6. INSTAGRAM FEED SECTION */}
          <InstagramFeed posts={instagramPosts} error={instagramError} />

          {/* 7. CLEAN FOOTER */}
          <footer className="mt-auto pt-6 px-6 border-t border-gray-150/80 flex flex-col items-center justify-center text-center">
            <div className="font-mono text-[11px] text-gray-400 mb-2">
              © {new Date().getFullYear()} {fullName}
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] font-semibold text-gray-600">
              <a 
                href={`mailto:${email}`} 
                className="hover:text-[#FF5500] transition-colors no-underline"
              >
                {email}
              </a>
              {phone && (
                <>
                  <span>•</span>
                  <a 
                    href={`tel:${phone}`} 
                    className="hover:text-[#FF5500] transition-colors no-underline"
                  >
                    {phone}
                  </a>
                </>
              )}
            </div>
          </footer>

        </div>

      </div>
    </div>
  );
}
