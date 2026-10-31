import React from 'react';
import useSWR from 'swr';
import { 
  Globe, 
  Mail, 
  Flame, 
  ArrowUpRight, 
  Layers,
  Code2
} from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { slugify } from './utils/slugify';
import { useInstagramFeed } from './hooks/useInstagramFeed';
import { InstagramFeed } from './components/InstagramFeed';

// Brand SVGs matching ghiffa.dev
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

const getLinkIcon = (title = '', url = '') => {
  const lower = (title + ' ' + url).toLowerCase();
  if (lower.includes('github')) return <GithubIcon className="w-4 h-4 text-neutral-800" />;
  if (lower.includes('linkedin')) return <LinkedinIcon className="w-4 h-4 text-[#0A66C2]" />;
  if (lower.includes('instagram')) return <InstagramIcon className="w-4 h-4 text-[#E1306C]" />;
  if (lower.includes('skillstreak')) return <Flame className="w-4 h-4 text-[#FF5500]" />;
  if (lower.includes('mail') || lower.includes('@')) return <Mail className="w-4 h-4 text-neutral-800" />;
  if (lower.includes('portfolio') || lower.includes('website') || lower.includes('ghiffa.dev')) return <Globe className="w-4 h-4 text-[#FF5500]" />;
  return <Layers className="w-4 h-4 text-neutral-500" />;
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

  const info = rawInfo || DEFAULT_INFO;
  const links = rawLinks && rawLinks.length > 0 ? rawLinks : DEFAULT_LINKS;
  const latestProject = rawProject || DEFAULT_PROJECT;

  const directoryLinks = links.filter(l => !l.featured);

  const fullName = info.full_name || 'Haikal Jibran Al-Ghiffarry';
  const role = info.role || 'IoT Engineer & Fullstack Web Developer';
  const email = info.email || 'hello@ghiffa.dev';

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-[#09090B] font-sans antialiased selection:bg-[#FF5500] selection:text-white flex justify-center py-0 sm:py-8 px-0 sm:px-4">
      
      {/* Central Solid Clean Container */}
      <main className="w-full max-w-[460px] min-h-screen sm:min-h-0 bg-white sm:rounded-3xl sm:border sm:border-neutral-200/80 sm:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] px-5 sm:px-7 py-8 flex flex-col justify-between">
        
        <div>
          {/* 1. ULTRA MINIMALIST PROFILE HEADER */}
          <header className="flex flex-col items-center text-center pb-6">
            
            {/* Avatar Photo with Solid Status Beacon */}
            <div className="relative mb-3.5">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-100 ring-1 ring-neutral-200">
                <img
                  src="/ghiffa.webp"
                  alt={fullName}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span 
                className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" 
                title="Available for projects" 
              />
            </div>

            {/* Name & Domain */}
            <h1 className="text-xl sm:text-[22px] font-bold tracking-tight text-neutral-900 m-0">
              {fullName}
            </h1>
            
            <p className="font-mono text-[11px] text-neutral-500 tracking-wide mt-1">
              ghiffa.dev • Kuningan, ID
            </p>

            <p className="text-[13px] text-neutral-600 max-w-[320px] leading-relaxed mt-2.5 font-normal">
              {role} — building the bridge between bits and atoms.
            </p>

            {/* Minimal Monochrome Social Icon Row */}
            <div className="flex items-center gap-1.5 mt-4">
              <a
                href={`mailto:${email}`}
                aria-label="Email"
                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/ghiffa08"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/haikal-jibran-al-ghiffarry"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/haikaljibraan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </header>

          {/* 2. SOLID CARDS & DIRECTORY */}
          <div className="flex flex-col gap-2.5 pt-2">
            
            {/* Flagship Platform: skillstreak.id (Solid High-Contrast Obsidian Card) */}
            <a
              href="https://skillstreak.id"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-2xl bg-[#09090B] text-white border border-neutral-850 hover:border-neutral-700 transition-all duration-200 no-underline"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#FF5500] flex items-center justify-center shrink-0">
                    <Flame className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white tracking-tight">skillstreak.id</span>
                  <span className="font-mono text-[9px] uppercase tracking-wider bg-neutral-800 text-orange-400 font-semibold px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="text-[12px] text-neutral-400 leading-relaxed m-0 font-normal">
                Gamified coding platform with interactive streaks & real-time XP evaluations.
              </p>
            </a>

            {/* Latest Selected Work: Solid Clean Card */}
            {latestProject && (
              <a 
                href={`https://ghiffa.dev/project/${slugify(latestProject.title)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-950 transition-all duration-200 no-underline"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0 group-hover:bg-[#FF5500] group-hover:text-white transition-colors">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#FF5500] font-semibold block truncate">
                      {latestProject.category || 'SELECTED WORK'}
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-black truncate m-0">
                      {latestProject.title}
                    </h3>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-black transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>
            )}

            {/* Direct Links (Solid Clean Rows) */}
            {directoryLinks.map((link) => (
              <a 
                key={link.id}
                href={link.url}
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-950 hover:bg-neutral-50/40 transition-all duration-200 no-underline"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white shrink-0 transition-colors">
                    {getLinkIcon(link.title, link.url)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-black truncate m-0">
                      {link.title}
                    </h3>
                    {link.subtitle && (
                      <p className="font-mono text-[10px] text-neutral-500 truncate m-0">
                        {link.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-black transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>
            ))}

            {/* Instagram Feed (if loaded) */}
            <InstagramFeed posts={instagramPosts} error={instagramError} />

          </div>
        </div>

        {/* 3. ULTRA MINIMALIST FOOTER */}
        <footer className="pt-8 mt-6 border-t border-neutral-100 text-center">
          <p className="font-mono text-[11px] text-neutral-400 m-0">
            © {new Date().getFullYear()} {fullName}
          </p>
          <div className="flex items-center justify-center gap-3 font-mono text-[10px] text-neutral-500 mt-1.5">
            <a 
              href={`mailto:${email}`} 
              className="hover:text-neutral-950 transition-colors no-underline"
            >
              {email}
            </a>
            <span>•</span>
            <a 
              href="https://ghiffa.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-neutral-950 transition-colors no-underline"
            >
              ghiffa.dev
            </a>
          </div>
        </footer>

      </main>
    </div>
  );
}
