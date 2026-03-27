import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [tailwind(), sitemap()],
  site: 'https://motelcoach.com.au',
  trailingSlash: 'always',
  output: 'static',
  redirects: {
    // Top Priority / Brand Fixes
    '/home': '/',
    '/contact-1': '/contact/',
    '/motel-websites-design': '/motel-website-design/',
    '/blog/how-tripadvisor-rankings-calculated-67c6s': '/blog/how-tripadvisor-rankings-calculated/',
    '/blog/managing-motel-room-inventory-dbjab': '/blog/managing-motel-room-inventory/',
    '/hospitality-coaching': '/motel-consultancy/',
    '/hospitality-management': '/motel-management/',
    '/how-to-run-a-motel': '/motel-management/',
    '/motel-front-desk-quick-reference-guide': '/motel-management/',
    '/how-to-manage-a-small-motel': '/motel-management/',
    '/introduction-motel-mangement': '/motel-management-training-course/',
    '/motel-management-course': '/motel-management-training-course/',
    '/-motel-courses': '/courses/',
    '/motel-management-books-Wrmc2': '/motel-management-book/',
    '/motel-management-blog/optimize-bookingdotcom-for-more-bookings': '/blog/booking-review-rank/',
    '/blog/optimize-bookingdotcom-for-more-bookings': '/blog/booking-review-rank/',
    '/motel-management-blog/guestpoint-pms-account-troublshooting': '/blog/guestpoint-pms-account-troublshooting/',
    '/motel-management-blog/motel-maintenance-schedule': '/blog/motel-maintenance-schedule/',
    '/motel-management-blog/learn-google-hotel-ads': '/blog/learn-google-hotel-ads/',
    '/motel-management-blog/increase-bookingdotcom-rank-checklist': '/blog/booking-review-rank/',
    '/motel-management-blog/Blog Post Title One-zd2kp-rktlj': '/blog/front-desk-training-checklist/',
    '/blog/Blog-Post-Title-One-zd2kp-rktlj': '/blog/front-desk-training-checklist/',
    '/front-desk-training-guide-motel': '/blog/front-desk-training-checklist/'
  }
});