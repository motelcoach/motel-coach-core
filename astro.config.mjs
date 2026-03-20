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
    '/motel-management-book-free-shortened': '/motel-management-book-free-chapter',
    '/learn-motel-mangement': '/motel-management-training-course',
    '/motel-marketing-review': '/motel-marketing',
    '/motel-management-australia': '/motel-management',
    '/motel-management-blog': '/blog',
    '/blog/test-page-load-motel': '/blog/hotel-motel-website-speed',
    '/improve-motel-occupancy-1': '/motel-consultancy',
    '/blog/motel-marketing-course-yx5mj': '/blog/motel-marketing-checklist',
    '/blog/Blog-Post-Title-One-zd2kp-rktlj': '/blog/front-desk-training-checklist',
    '/blog/motel-front-desk-checklist': '/blog/front-desk-training-checklist',
    '/motel-management-books-Wrmc2': '/motel-management-books',
    '/motel-operational-review': '/motel-consultancy',
    '/blog/motel-marketing-course': '/blog/motel-marketing-basics',
    '/managing-motel-room-inventory-dbjab': '/blog/motel-management-21-day-transition-strategy',
    '/blog/front-desk-training-hospitality': '/blog/front-desk-training-checklist',
    '/blog/hospitality-careers-getting-started': '/blog/motel-manager-career',
    '/blog/motel-manager-duties': '/blog/motel-manager-career',
    '/blog/a-day-in-life-of-motel-manager': '/blog/motel-manager-career',
    '/blog/increase-bookingdotcom-rank-checklist': '/blog/booking-review-rank',
    '/blog/motel-marketing-basics': '/blog/motel-marketing-checklist',
    '/motel-receptionist-jobs': '/blog/motel-receptionist-jobs',
    '/home': '/',
    '/what-does-a-motel-manager-do': '/blog/what-does-a-motel-manager-do',
    '/improve-motel-occupancy': '/blog/improve-motel-occupancy',
    '/blog/motel-room-inventory-management-guide': '/blog/managing-motel-room-inventory',
    '/blog/optimize-bookingdotcom-for-more-bookings.md': '/blog/booking-review-rank',
    '/motel-management-course-purchase': '/motel-management-training-course',
    '/front-desk-training-guide-motel': '/blog/front-desk-training-checklist.md',
    '/motel-websites-design': '/motel-website-design',
    '/faq': '/',
    '/motel-resources': '/',
    '/blog/motel-manager-career': '/blog/what-does-a-motel-manager-do',
    '/motel-management-book-free-shortened': '/motel-management-book'
  },
});
