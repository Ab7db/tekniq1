
CREATE TYPE public.app_role AS ENUM ('admin','customer');
CREATE TYPE public.order_status AS ENUM ('pending','processing','shipped','delivered','cancelled');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role public.app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND role = _role);
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), COALESCE(NEW.raw_user_meta_data->>'phone',''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories admin write" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  price NUMERIC(12,3) NOT NULL DEFAULT 0,
  cost_price NUMERIC(12,3) NOT NULL DEFAULT 0,
  discount_price NUMERIC(12,3),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "products admin write" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  map_url TEXT,
  total_amount NUMERIC(12,3) NOT NULL DEFAULT 0,
  total_cost NUMERIC(12,3) NOT NULL DEFAULT 0,
  total_profit NUMERIC(12,3) NOT NULL DEFAULT 0,
  status public.order_status NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders own read" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders own insert" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders admin update" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,3) NOT NULL DEFAULT 0,
  unit_cost NUMERIC(12,3) NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order items read" ON public.order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "order items insert" ON public.order_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'new_order',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications admin read" ON public.notifications FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "notifications insert any auth" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "notifications admin update" ON public.notifications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.decrement_stock(_product_id uuid, _qty integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p RECORD;
BEGIN
  UPDATE public.products SET stock_quantity = GREATEST(stock_quantity - _qty, 0) WHERE id = _product_id
  RETURNING * INTO p;
  IF p.id IS NOT NULL AND p.stock_quantity <= p.low_stock_threshold THEN
    INSERT INTO public.notifications (title, message, type)
    VALUES ('Low stock', p.name_en || ' has only ' || p.stock_quantity || ' left in stock.', 'low_stock');
  END IF;
END; $$;
GRANT EXECUTE ON FUNCTION public.decrement_stock(uuid, integer) TO authenticated;

CREATE POLICY "product images public read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "product images admin write" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "product images admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "product images admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(),'admin'));

INSERT INTO public.categories (name_ar, name_en, slug, image_url) VALUES
 ('عطور فاخرة','Fine Fragrances','fragrances','https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80'),
 ('ساعات','Timepieces','timepieces','https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200&q=80'),
 ('مجوهرات','Jewellery','jewellery','https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80'),
 ('جلود','Leather Goods','leather','https://images.unsplash.com/photo-1547949003-9792a18a2601?w=1200&q=80');

INSERT INTO public.products (name_ar, name_en, description_ar, description_en, price, cost_price, discount_price, stock_quantity, category_id, images, is_featured) VALUES
 ('عود ملكي','Royal Oud Elixir','عطر شرقي فخم بلمسات العود والعنبر.','An opulent oriental blend of aged oud and amber.',129.900,54.000,109.900,12,(SELECT id FROM public.categories WHERE slug='fragrances'),ARRAY['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=80','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=80'],true),
 ('ماء الذهب','Gold Mist Parfum','رذاذ ذهبي بنفحات الياسمين والمسك.','Golden mist with jasmine and white musk.',89.500,36.000,NULL,4,(SELECT id FROM public.categories WHERE slug='fragrances'),ARRAY['https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1200&q=80'],true),
 ('ساعة أوبسيديان','Obsidian Chronograph','ساعة سويسرية بإطار ذهبي.','Swiss automatic chronograph with gold bezel.',749.000,410.000,699.000,6,(SELECT id FROM public.categories WHERE slug='timepieces'),ARRAY['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80','https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=1200&q=80'],true),
 ('طوق الشمس','Sunfire Necklace','طوق ذهبي عيار 18 بتصميم يدوي.','Handcrafted 18k gold statement necklace.',1290.000,720.000,NULL,3,(SELECT id FROM public.categories WHERE slug='jewellery'),ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=80'],true),
 ('حقيبة أونيكس','Onyx Leather Tote','حقيبة جلد إيطالي بمقابض ذهبية.','Italian leather tote with gilded hardware.',430.000,215.000,389.000,9,(SELECT id FROM public.categories WHERE slug='leather'),ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=80'],false),
 ('محفظة شامبين','Champagne Wallet','محفظة جلدية أنيقة.','Slim champagne calfskin wallet.',120.000,58.000,NULL,20,(SELECT id FROM public.categories WHERE slug='leather'),ARRAY['https://images.unsplash.com/photo-1627123424574-724758594e93?w=1200&q=80'],false);
