import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => {
        const excluded = [
          '/motel-management-book-free-chapter/',
          '/blog/motel-seo/',
        ];
        return !excluded.some((path) => page.endsWith(path));
      },
    }),
  ],
  site: 'https://motelcoach.com.au',
  trailingSlash: 'always',
  output: 'static'
});
