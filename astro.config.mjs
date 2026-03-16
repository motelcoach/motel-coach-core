import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap()],
  site: 'https://motelcoach.com.au',

  redirects: {
    '/hospitality-coaching': '/motel-consultancy',
    '/hospitality-courses-australia': '/motel-management-training-course',
    '/hospitality-diplomas-degrees-australia': '/motel-management-training-course',
    '/hospitality-management': '/motel-management',
    '/hospitality-training-australia': '/motel-management-training-course',
    '/motel-room-pick-up': '/blog/what-is-motel-room-pick-up',
    '/how-to-run-a-motel': '/motel-management',
    '/motel-front-desk-quick-reference-guide': '/motel-management',
    '/how-to-manage-a-small-motel': '/motel-management',
    '/motel-management-book-free-shortened': '/motel-management-book-free',
    '/learn-motel-mangement': '/motel-management-training-course',
    '/motel-marketing-review': '/motel-marketing',
    '/motel-management-australia': '/motel-management',
    '/motel-management-blog': '/blog',
    '/blog/test-page-load-motel': '/blog/hotel-motel-website-speed',
    '/improve-motel-occupancy-1': '/hospitality-coaching',
    '/blog/motel-marketing-course-yx5mj': '/blog/motel-marketing-checklist',
    '/blog/Blog-Post-Title-One-zd2kp-rktlj': '/blog/motel-front-desk-checklist',
    '/motel-management-books-Wrmc2': '/motel-management-books',
    '/motel-operational-review': '/motel-consultancy',
    '/motel-marketing-course': '/motel-marketing-basics',
    '/managing-motel-room-inventory-dbjab': '/motel-management-21-day-transition-strategy',
    '/hotel-motel-management-course': '/motel-management-training-course',
  },
});
