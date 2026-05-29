-- Run this SQL in your Supabase SQL Editor

-- 1. Create the bio_links table
CREATE TABLE IF NOT EXISTS public.bio_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    url TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.bio_links ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public can view active links
CREATE POLICY "Public can view active bio links" 
ON public.bio_links FOR SELECT USING (is_active = true);

-- 4. Policy: Admins can do anything
CREATE POLICY "Admins can insert bio links" ON public.bio_links FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update bio links" ON public.bio_links FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete bio links" ON public.bio_links FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Seed Initial Data
INSERT INTO public.bio_links (title, subtitle, url, featured, order_index)
VALUES 
('Main Portfolio Website', 'ghiifa.dev', 'https://ghiffa.dev', true, 1),
('LinkedIn Profile', 'Professional Network', 'https://linkedin.com/in/haikal-jibran-al-ghiffarry', false, 2),
('GitHub Repositories', 'Open Source & Code', 'https://github.com/ghiffa', false, 3),
('Instagram', '@haikaljibrn__', 'https://instagram.com/haikaljibrn__', false, 4),
('Send an Email', 'haikaljibran.dev@gmail.com', 'mailto:haikaljibran.dev@gmail.com', false, 5);
