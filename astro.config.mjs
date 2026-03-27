export default defineConfig({
  integrations: [tailwind(), sitemap()],
  site: 'https://motelcoach.com.au',
  trailingSlash: 'always',
  output: 'static',
});