/**
 * Universal Site Configuration
 * Change this file to adapt the entire script to any domain or brand without touching template code!
 */
export const siteConfig = {
  name: 'ZENITH',
  // Optional custom logo image URL (e.g. '/images/logo.png'). If empty, site name text is used!
  logoImage: '', 
  siteTitle: 'ZENITH - Modern Web & Systems Journal',
  description: 'In-depth tutorials, technical guides, performance architecture, and modern digital insights.',
  url: 'https://zenith-blog.pages.dev', // Production domain
  author: 'Editorial Team',
  authorRole: 'Systems & Web Research',
  email: 'editorial@example.com',
  language: 'en',
  postsPerPage: 10,
  
  // Navigation links (Right-aligned in desktop header) - Add your custom pages here!
  nav: [
    { name: 'Home', href: '/' },
  ],

  // Primary categories - Add your custom categories here!
  categories: [] as Array<{ name: string; slug: string }>,

  // Footer legal links (AdSense & compliance)
  legalLinks: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ],

  // AdSense configuration (toggle active to true when your publisher ID is ready)
  ads: {
    active: false,
    publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
  }
};
