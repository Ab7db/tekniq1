# Royal E-Commerce Suite

Build an ultra-luxurious, visually mesmerizing E-Commerce Web Application built with React (TypeScript), Vite, Tailwind CSS, Framer Motion, Lucide Icons, and a complete Supabase backend.



---



### 🎨 1. Ultra-Premium Visual Design & Luxury Aesthetics

- **Theme & Color Palette:**

  - Background: Deep Royal Charcoal / Onyx Obsidian (`#0B0C10` to `#121318`) with subtle frosted glassmorphism overlays.

  - Accents: Metallic Radiant Gold (`#D4AF37`, `#F5D77F`) and Champagne Bronze gradients.

  - Text & Elements: Crisp Ivory White (`#F9FAFB`) and muted satin slate (`#94A3B8`).

  - Cards: High-end translucent glassmorphism (`backdrop-blur-xl bg-white/[0.03] border border-gold-500/20 hover:border-gold-500/50 transition-all`).

- **Typography:**

  - Arabic: Elegant modern typography (Cairo / Tajawal / Readex Pro).

  - English: High-end luxury serif/sans pairing (Cinzel / Playfair Display for headings, Inter for UI text).



---



### ✨ 2. Mesmerizing Animations & Micro-Interactions (Framer Motion)

- **Hero Section:**

  - Interactive 3D tilt floating hero banner with glowing gold ambient light particles.

  - Smooth staggered reveal animations for titles, subtitles, and CTA buttons on page load.

- **Product Cards & Galleries:**

  - Smooth scale-up hover effects with dynamic gold ambient glow behind the card.

  - Smooth image zoom on hover and interactive multi-angle image thumbnail switcher.

  - Quick "Add to Cart" magnetic floating button with ripple click effect.

- **Cart & Modals:**

  - Smooth slide-in Spring physics for the side shopping cart drawer.

  - Dynamic checkout progress bar with glowing active step states.

  - Pulsing status badges for Low Stock alerts and Flash Sales.

- **Page Transitions & Skeletons:**

  - Seamless page transitions with zero flickering.

  - Shimmering golden-slate skeleton loaders while fetching data from Supabase.



---



### 🌐 3. Full Bilingual Support (Arabic & English - i18n & RTL/LTR)

- Built-in instant Language Switcher (AR / EN) in the header with persistent state (localStorage).

- **Arabic (RTL):** Fully optimized Right-to-Left layout, typography, mirror animations, and Arabic currency formatting (`ر.ع` / `OMR`).

- **English (LTR):** Standard Left-to-Right layout with tailored spacing and alignments.

- All UI strings, notifications, cart summaries, and admin dashboard elements must be 100% localized.



---



### 🗄️ 4. Supabase Database & Business Architecture

Implement the complete Supabase backend integration:

1. **`profiles` Table:** `id`, `full_name`, `phone`, `role` ('admin', 'customer'), `created_at`.

2. **`categories` Table:** `id`, `name_ar`, `name_en`, `slug`, `image_url`.

3. **`products` Table:** `id`, `name_ar`, `name_en`, `description_ar`, `description_en`, `price`, `cost_price` (for profit calculation), `discount_price`, `stock_quantity`, `low_stock_threshold` (default 5), `category_id`, `images` (array of URLs), `is_featured`, `created_at`.

4. **`orders` Table:** `id`, `user_id`, `customer_name`, `customer_phone`, `delivery_address`, `location_lat`, `location_lng`, `map_url`, `total_amount`, `total_cost`, `total_profit`, `status` ('pending', 'processing', 'shipped', 'delivered', 'cancelled'), `payment_method`, `created_at`.

5. **`order_items` Table:** `id`, `order_id`, `product_id`, `quantity`, `unit_price`, `unit_cost`.

6. **`notifications` Table:** `id`, `title`, `message`, `type` ('low_stock', 'new_order'), `is_read`, `created_at`.

7. **Storage:** Public bucket `product-images` with RLS policies allowing Admin upload/edit/delete.



---



### 🛍️ 5. Smart Geolocation Checkout & WhatsApp Automation

1. **Automatic GPS Detection:** One-click button on checkout using `navigator.geolocation` that captures exact coordinates and converts them to a live Google Maps link (`https://maps.google.com/?q={lat},{lng}`).

2. **Order Placement:**

   - Write order and items to Supabase and decrement product stock immediately.

   - Trigger automated WhatsApp message generation directed to the Admin number:

     * Structured template: Order ID, Client Name, Phone, Items list, Total Price, Delivery Address, and the Direct Google Maps Link.

     * Open WhatsApp via `https://wa.me/{admin_phone}?text=...`.

   - Send live in-app notification to the Admin.



---



### 👑 6. Luxury Admin Dashboard (`/admin`)

- **Visual Analytics:** Real-time KPI cards with glowing borders (Total Revenue, Total Net Profit = `Revenue - Cost`, Total Orders, Registered Users).

- **Interactive Charts:** Revenue and sales volume trends.

- **Inventory & Low Stock System:** Visual badge warnings when stock drops below threshold, with automatic notification alerts.

- **Product Management:** Full CRUD (Arabic/English names & descriptions, price, cost price, stock, and multi-image upload directly to Supabase Storage).

- **Orders & Tracking:** View orders, customer details, calculated profit per order, status update dropdowns, and one-click button to open customer location on Google Maps.

- **Customer Directory:** View customer list and purchase history.



---



### ⚡ 7. Quality & Integrity

- All buttons, drawers, forms, language toggles, and database queries must be fully functional with zero dead links or mock static buttons.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://luxury-silk.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/94d901f6-8b12-4911-be77-f378b6029c7c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
