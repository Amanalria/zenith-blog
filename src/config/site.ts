/**
 * Universal Site Configuration
 * Change this file to adapt the entire script to any domain or brand without touching template code!
 */
export const siteConfig = {
  name: 'ZENITH',
  // Optional custom logo image URL (e.g. '/images/logo.png'). If empty, site name text is used!
  logoImage: '', 
  siteTitle: 'ZENITH - Modern Technology & Web Engineering Insights',
  description: 'In-depth tutorials, technical guides, performance architecture, and modern digital insights.',
  url: 'https://example.com', // Replace with your production domain
  author: 'Editorial Team',
  authorRole: 'Systems & Web Research',
  email: 'editorial@zenith-journal.io',
  language: 'en',
  postsPerPage: 10,
  
  // Navigation links (Right-aligned in desktop header)
  nav: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],

  // Primary categories
  categories: [
    { name: 'Technology', slug: 'technology' },
    { name: 'AI & Edge', slug: 'ai-edge' },
    { name: 'Architecture', slug: 'architecture' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Cloudflare', slug: 'cloudflare' },
  ],

  // Footer legal links
  legalLinks: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Disclaimer', href: '/disclaimer' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'About Us', href: '/about' },
  ],

  // AdSense configuration (toggle active to true when your publisher ID is ready)
  ads: {
    active: false,
    publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
  }
};
