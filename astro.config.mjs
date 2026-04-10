import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/motel-management-book-free-chapter/'),
    }),
  ],
  site: 'https://motelcoach.com.au',
  trailingSlash: 'always',
  output: 'static'
});
