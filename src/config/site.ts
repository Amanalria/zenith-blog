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
  author: 'Aman Alria',
  authorRole: 'Chief Editor & Film Journalist',
  email: 'amanalha07@gmail.com',
  language: 'en',
  postsPerPage: 10,
  
  // Navigation links (Right-aligned in desktop header)
  nav: [
    { name: 'Home', href: '/' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],

  // Primary categories for movie portal
  categories: [
    { name: 'Bollywood', slug: 'bollywood' },
    { name: 'Hollywood', slug: 'hollywood' },
    { name: 'South Cinema', slug: 'south-cinema' },
    { name: 'OTT & Web Series', slug: 'ott-web-series' },
    { name: 'Cinema News', slug: 'cinema-news' },
    { name: 'Movie Reviews', slug: 'movie-reviews' },
  ],

  // Footer legal links (AdSense & compliance)
  legalLinks: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Cookie Policy', href: '/cookie-consent' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ],

  // AdSense configuration (toggle active to true when your publisher ID is ready)
  ads: {
    active: false,
    publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
  }
};
