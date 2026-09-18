# लोकमदत 2.0 — first migration

This is a Node/Next.js server-rendered foundation for Lokmadat. It reads the existing Supabase `news` table and `news-images` storage.

## Why this fixes social thumbnails
Each `/news/<id>` request is rendered on the server and `generateMetadata()` produces article-specific Open Graph/Twitter title, description and image metadata. WhatsApp/Facebook crawlers no longer depend on client-side JavaScript to discover the article image.

## Test
1. Copy `.env.example` to `.env.local` and add the existing Supabase publishable key.
2. `npm install`
3. `npm run dev`
4. Test `/` and `/news/<existing-news-UUID>`.

## Deployment
Deploy to a Node-capable host such as Vercel. Do not move `metrocitynews.co.in` until the temporary deployment is tested.

This package is a foundation, not a replacement of the current live site. The current GitHub Pages site remains untouched.
