
CREATE TABLE public.promotional_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  target_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  cta_link TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.promotional_videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promotional_videos TO authenticated;
GRANT ALL ON public.promotional_videos TO service_role;
ALTER TABLE public.promotional_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "promo videos public read" ON public.promotional_videos FOR SELECT USING (is_active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "promo videos admin write" ON public.promotional_videos FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "promo videos storage read" ON storage.objects FOR SELECT USING (bucket_id = 'promo-videos');
CREATE POLICY "promo videos storage insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'promo-videos' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "promo videos storage update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'promo-videos' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "promo videos storage delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'promo-videos' AND public.has_role(auth.uid(),'admin'));
