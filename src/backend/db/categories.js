/**
 * Category Database can be added here.
 * You can add category of your wish with different attributes
 * */

export const categories = [
  {
    _id: '35abdf47-0dae-40fc-b201-a981e9daa3d4',
    categoryName: 'laptop',
    displayName: 'Laptops',
    categoryImage:
      'https://res.cloudinary.com/dtbd1y4en/image/upload/v1683908106/redmi-book-15_ksizgp.jpg',
    description: 'High-performance laptops for work, gaming, and everyday use',
    icon: '💻',
    isActive: true,
    sortOrder: 1,
    subcategories: [
      {
        id: 'gaming-laptops',
        name: 'Gaming Laptops',
        description: 'High-performance laptops for gaming'
      },
      {
        id: 'business-laptops',
        name: 'Business Laptops',
        description: 'Professional laptops for work'
      },
      {
        id: 'ultrabooks',
        name: 'Ultrabooks',
        description: 'Thin and lightweight laptops'
      }
    ],
    seo: {
      metaTitle: 'Best Laptops - Gaming, Business & Ultrabooks',
      metaDescription: 'Discover our wide range of laptops including gaming, business, and ultrabooks from top brands.',
      keywords: ['laptops', 'gaming laptops', 'business laptops', 'ultrabooks']
    }
  },
  {
    _id: 'fab4d8a9-84cd-49bb-9479-ff73e5bcf0fc',
    categoryName: 'tv',
    displayName: 'Smart TVs',
    categoryImage:
      'https://res.cloudinary.com/dtbd1y4en/image/upload/v1683918874/oneplus-55U1S_pl3nko.jpg',
    description: 'Smart TVs with stunning picture quality and streaming capabilities',
    icon: '📺',
    isActive: true,
    sortOrder: 2,
    subcategories: [
      {
        id: '4k-tvs',
        name: '4K Ultra HD TVs',
        description: 'Ultra high definition televisions'
      },
      {
        id: 'smart-tvs',
        name: 'Smart TVs',
        description: 'Internet-connected televisions'
      },
      {
        id: 'oled-tvs',
        name: 'OLED TVs',
        description: 'Organic LED display televisions'
      }
    ],
    seo: {
      metaTitle: 'Smart TVs - 4K, OLED & Ultra HD Television',
      metaDescription: 'Shop the latest smart TVs with 4K resolution, OLED technology, and streaming capabilities.',
      keywords: ['smart tv', '4k tv', 'oled tv', 'television']
    }
  },
  {
    _id: 'a9c05f11-bb6a-4501-9390-3201ed9f9448',
    categoryName: 'smartwatch',
    displayName: 'Smartwatches',
    categoryImage:
      'https://res.cloudinary.com/dtbd1y4en/image/upload/v1683911006/apple-watch-ultra_ony1kc.jpg',
    description: 'Advanced smartwatches for fitness tracking and connectivity',
    icon: '⌚',
    isActive: true,
    sortOrder: 3,
    subcategories: [
      {
        id: 'fitness-watches',
        name: 'Fitness Watches',
        description: 'Watches focused on health and fitness tracking'
      },
      {
        id: 'luxury-watches',
        name: 'Luxury Smartwatches',
        description: 'Premium smartwatches with elegant design'
      },
      {
        id: 'sports-watches',
        name: 'Sports Watches',
        description: 'Rugged watches for outdoor activities'
      }
    ],
    seo: {
      metaTitle: 'Smartwatches - Fitness, Luxury & Sports Watches',
      metaDescription: 'Explore our collection of smartwatches for fitness tracking, luxury style, and sports activities.',
      keywords: ['smartwatch', 'fitness watch', 'apple watch', 'wearable']
    }
  },
  {
    _id: 'a71bd701-eca8-41a8-a385-e1ec91a03697',
    categoryName: 'earphone',
    displayName: 'Audio & Headphones',
    categoryImage:
      'https://res.cloudinary.com/dtbd1y4en/image/upload/v1683955385/oneplus-nord-buds_b9yphw.jpg',
    description: 'Premium audio devices including earphones, headphones, and speakers',
    icon: '🎧',
    isActive: true,
    sortOrder: 4,
    subcategories: [
      {
        id: 'wireless-earbuds',
        name: 'Wireless Earbuds',
        description: 'True wireless earbuds for freedom of movement'
      },
      {
        id: 'noise-cancelling',
        name: 'Noise Cancelling',
        description: 'Headphones with active noise cancellation'
      },
      {
        id: 'gaming-headsets',
        name: 'Gaming Headsets',
        description: 'Professional gaming headphones with microphone'
      }
    ],
    seo: {
      metaTitle: 'Headphones & Earphones - Wireless, Gaming & Noise Cancelling',
      metaDescription: 'Premium audio devices including wireless earbuds, gaming headsets, and noise-cancelling headphones.',
      keywords: ['headphones', 'earphones', 'wireless earbuds', 'gaming headset']
    }
  },
  {
    _id: '16080c75-5573-4626-9b89-37c670907c02',
    categoryName: 'mobile',
    displayName: 'Smartphones',
    categoryImage:
      'https://res.cloudinary.com/dtbd1y4en/image/upload/v1683957585/oneplus-nord-CE-3-lite_weksou.jpg',
    description: 'Latest smartphones with cutting-edge technology and features',
    icon: '📱',
    isActive: true,
    sortOrder: 5,
    subcategories: [
      {
        id: 'flagship-phones',
        name: 'Flagship Phones',
        description: 'Premium smartphones with latest technology'
      },
      {
        id: 'budget-phones',
        name: 'Budget Phones',
        description: 'Affordable smartphones with great value'
      },
      {
        id: 'gaming-phones',
        name: 'Gaming Phones',
        description: 'Smartphones optimized for mobile gaming'
      }
    ],
    seo: {
      metaTitle: 'Smartphones - Flagship, Budget & Gaming Mobile Phones',
      metaDescription: 'Discover the latest smartphones including flagship, budget-friendly, and gaming phones from top brands.',
      keywords: ['smartphone', 'mobile phone', 'android', 'iphone']
    }
  },
  {
    _id: 'new-category-accessories',
    categoryName: 'accessories',
    displayName: 'Accessories',
    categoryImage:
      'https://images.pexels.com/photos/163117/keyboard-mouse-technology-computer-163117.jpeg',
    description: 'Essential tech accessories and peripherals',
    icon: '🔌',
    isActive: true,
    sortOrder: 6,
    subcategories: [
      {
        id: 'chargers-cables',
        name: 'Chargers & Cables',
        description: 'Power adapters, USB cables, and charging accessories'
      },
      {
        id: 'cases-covers',
        name: 'Cases & Covers',
        description: 'Protective cases and covers for devices'
      },
      {
        id: 'keyboards-mice',
        name: 'Keyboards & Mice',
        description: 'Computer peripherals and input devices'
      }
    ],
    seo: {
      metaTitle: 'Tech Accessories - Chargers, Cases, Keyboards & More',
      metaDescription: 'Complete your tech setup with our range of accessories including chargers, cases, keyboards, and mice.',
      keywords: ['tech accessories', 'chargers', 'cases', 'keyboards', 'mice']
    }
  }
];