/**
 * Universal Site Configuration
 * Change this file to adapt the entire script to any domain or brand without touching template code!
 */
export const siteConfig = {
  name: 'TG MOVIES',
  // Optional custom logo image URL (e.g. '/images/logo.png'). If empty, site name text is used!
  logoImage: '', 
  siteTitle: 'TG Movies - Latest Movie Reviews, OTT Releases & Cinema News',
  description: 'Your ultimate destination for authentic movie reviews, box office collection reports, upcoming OTT releases, and cinema news.',
  url: 'https://tgmovies.in', // Production domain
  author: 'TG Movies Editorial',
  authorRole: 'Entertainment & Cinema Desk',
  email: 'contact@tgmovies.in',
  language: 'en',
  postsPerPage: 10,
  
  // Navigation links (Right-aligned in desktop header) - Add your custom pages here!
  nav: [
    { name: 'Home', href: '/' },
  ],

  // Primary categories for movie portal
  categories: [
    { name: 'Bollywood', slug: 'bollywood' },
    { name: 'Hollywood', slug: 'hollywood' },
    { name: 'South Cinema', slug: 'south-cinema' },
    { name: 'OTT Releases', slug: 'ott-releases' },
    { name: 'Web Series', slug: 'web-series' },
    { name: 'Movie Reviews', slug: 'movie-reviews' },
  ],

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
