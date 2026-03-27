import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [tailwind(), sitemap()],
  site: 'https://motelcoach.com.au',
  trailingSlash: 'always',
  output: 'static',
  
  redirects: {
    '/hospitality-coaching': '/motel-consultancy/',
    '/hospitality-management': '/motel-management/',
    '/motel-room-pick-up': '/blog/what-is-motel-room-pick-up/',
    '/how-to-run-a-motel': '/motel-management/',
    '/motel-front-desk-quick-reference-guide': '/motel-management/',
    '/learn-motel-mangement': '/motel-management-training-course/',
    '/motel-management-course': '/motel-management-training-course/',
    '/motel-marketing-review': '/motel-marketing/',
    '/motel-management-australia': '/motel-management/',
    '/contact-1': '/contact/',
    '/motel-websites-design': '/motel-website-design/',
    '/motel-seo-guide': '/blog/motel-seo/',
    
    '/motel-management-blog/optimize-bookingdotcom-for-more-bookings': '/blog/booking-review-rank/',
    '/blog/optimize-bookingdotcom-for-more-bookings': '/blog/booking-review-rank/',
    
    '/motel-management-blog/guestpoint-pms-account-troublshooting': '/blog/guestpoint-pms-account-troublshooting/',
    '/motel-management-blog/learn-google-hotel-ads': '/blog/learn-google-hotel-ads/',
    
    '/motel-resources-member': '/',
    '/introduction-motel-mangement': '/motel-management-training-course/',
    '/-motel-courses': '/courses/',
    '/store-DTIgm': '/',
    '/home': '/',
  }
});