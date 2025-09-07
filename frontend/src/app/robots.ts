import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/marketplace',
          '/services',
          '/pricing',
          '/about',
          '/contact',
          '/blog',
          '/product',
          '/faq',
          '/terms',
          '/privacy',
          '/legal'
        ],
        disallow: [
          '/dashboard',
          '/vendor',
          '/admin',
          '/cart',
          '/checkout',
          '/login',
          '/signup',
          '/auth',
          '/api',
          '/_next',
          '/downloads',
          '/private'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/marketplace',
          '/services', 
          '/pricing',
          '/about',
          '/contact',
          '/blog',
          '/product'
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/marketplace',
          '/services',
          '/pricing', 
          '/about',
          '/contact',
          '/blog',
          '/product'
        ],
        crawlDelay: 2,
      }
    ],
    sitemap: 'https://autopilot.monster/sitemap.xml',
    host: 'https://autopilot.monster'
  }
}
