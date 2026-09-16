import type { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 'sample-001',
    slug: 'noir-oud',
    name: {
      en: 'Noir Oud',
      ar: 'نوير عود',
    },
    brand: {
      en: 'Perfume House',
      ar: 'دار العطور',
    },
    description: {
      en: 'A deep composition of oud, amber and warm woods.',
      ar: 'تركيبة عميقة من العود والعنبر والأخشاب الدافئة.',
    },
    category: {
      en: 'Eau de Parfum',
      ar: 'ماء عطر',
    },
    gender: 'unisex',
    sizes: [
      {
        ml: 50,
        price: 85000,
      },
      {
        ml: 100,
        price: 145000,
      },
    ],
    image: '/images/noir.jpeg',
    images: [
      '/images/noir.jpeg',
      '/images/noir2.webp',
      '/images/noir3.jpeg',
      '/images/noir4.jpeg',
    ],
    featured: true,
    bestseller: true,
    inStock: true,
    createdAt: '2026-01-01',
  },

  {
    id: 'sample-002',
    slug: 'rose-velours',
    name: {
      en: 'Rose Velours',
      ar: 'روز فيلور',
    },
    brand: {
      en: 'Perfume House',
      ar: 'دار العطور',
    },
    description: {
      en: 'A refined floral fragrance with rose, musk and soft woods.',
      ar: 'عطر زهري راقٍ من الورد والمسك والأخشاب الناعمة.',
    },
    category: {
      en: 'Eau de Parfum',
      ar: 'ماء عطر',
    },
    gender: 'women',
    sizes: [
      {
        ml: 50,
        price: 78000,
      },
      {
        ml: 100,
        price: 135000,
      },
    ],
    image: '/images/rose.jpg',
    featured: true,
    newArrival: true,
    inStock: false,
    createdAt: '2026-01-02',
  },

  {
    id: 'sample-003',
    slug: 'amber-noir',
    name: {
      en: 'Amber Noir',
      ar: 'عنبر نوير',
    },
    brand: {
      en: 'Perfume House',
      ar: 'دار العطور',
    },
    description: {
      en: 'Warm amber layered with vanilla, spice and precious woods.',
      ar: 'عنبر دافئ ممزوج بالفانيليا والتوابل والأخشاب الفاخرة.',
    },
    category: {
      en: 'Eau de Parfum',
      ar: 'ماء عطر',
    },
    gender: 'unisex',
    sizes: [
      {
        ml: 50,
        price: 90000,
      },
      {
        ml: 100,
        price: 155000,
      },
    ],
    image: '/images/amber.jpeg',
    bestseller: true,
    inStock: true,
    createdAt: '2026-01-03',
  },
  {
    id: '01',
    slug: 'granados',

    name: {
      en: 'Granados',
      ar: 'غراندوس',
    },

    brand: {
      en: 'Perfume',
      ar: 'عطر',
    },

    description: {
      en: 'A deep and refined fragrance created for those who leave a lasting impression.',
      ar: 'عطر عميق وأنيق صُمم لمن يتركون انطباعًا لا يُنسى.',
    },
    sizes: [
      {
        ml: 50,
        price: 85000,
      },
      {
        ml: 100,
        price: 155000,
      },
    ],

    image: '/images/granados.webp',
    bestseller: true,
    inStock: true,
    createdAt: '2026-01-03',

    gender: 'unisex',

    badge: {
      en: 'Bestseller',
      ar: 'الأكثر مبيعًا',
    },

    notes: {
      top: [
        {
          en: 'Bergamot',
          ar: 'البرغموت',
        },
        {
          en: 'Black Pepper',
          ar: 'الفلفل الأسود',
        },
      ],

      heart: [
        {
          en: 'Rose',
          ar: 'الورد',
        },
        {
          en: 'Jasmine',
          ar: 'الياسمين',
        },
      ],

      base: [
        {
          en: 'Amber',
          ar: 'العنبر',
        },
        {
          en: 'Musk',
          ar: 'المسك',
        },
      ],
    },

    details: {
      size: '100ml',

      concentration: 'Eau de Parfum',

      longevity: {
        en: '8–10 hours',
        ar: '8–10 ساعات',
      },
    },
    category: {
      en: 'Eau de Parfum',
      ar: 'ماء عطر',
    },
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

export function getNewArrivals(): Product[] {
  return products.filter((product) => product.newArrival);
}

export function getBestsellers(): Product[] {
  return products.filter((product) => product.bestseller);
}

export function getAllProducts(): Product[] {
  return products;
}
