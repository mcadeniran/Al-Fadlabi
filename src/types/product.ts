export type ProductGender = 'women' | 'men' | 'unisex';

export type ProductTranslation = {
  locale: 'en' | 'ar';
  name: string;
  brand: string;
  description: string;

  concentration: string | null;
  detailsSize: string | null;
  longevity: string | null;
  badge: string | null;
};

export type ProductImage = {
  id: string;
  imageUrl: string;
  sortOrder: number;
};

export type ProductSize = {
  id: string;
  ml: number;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
};

export type ProductNoteType = 'top' | 'heart' | 'base';

export type ProductNoteTranslation = {
  locale: 'en' | 'ar';
  name: string;
};

export type ProductNote = {
  id: string;
  type: ProductNoteType;
  sortOrder: number;
  translations: ProductNoteTranslation[];
};

export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
};

export type Product = {
  id: string;
  slug: string;
  gender: ProductGender;

  isActive: boolean;
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;

  category: ProductCategory | null;

  translations: ProductTranslation[];
  images: ProductImage[];
  sizes: ProductSize[];
  notes: ProductNote[];

  createdAt: string;
};

// export type Locale = 'en' | 'ar';

// export type ProductGender = 'women' | 'men' | 'unisex';

// export type ProductSize = {
//   ml: number;
//   price: number;
//   compareAtPrice?: number;
// };

// export type Product = {
//   id: string;

//   slug: string;

//   name: Record<Locale, string>;

//   brand: Record<Locale, string>;

//   description: Record<Locale, string>;

//   category: Record<Locale, string>;

//   gender: ProductGender;

//   sizes: ProductSize[];

//   image: string;

//   images?: string[];

//   featured?: boolean;

//   newArrival?: boolean;

//   bestseller?: boolean;

//   inStock: boolean;

//   createdAt: string;

//   badge?: Record<Locale, string>;

//   notes?: {
//     top: Record<Locale, string>[];
//     heart: Record<Locale, string>[];
//     base: Record<Locale, string>[];
//   };

//   details?: {
//     size: string;
//     concentration: string;
//     longevity: Record<Locale, string>;
//   };
// };
