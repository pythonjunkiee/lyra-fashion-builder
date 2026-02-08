export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  category: 'mukhawar' | 'shaila' | 'kids' | 'premium';
  collection?: string[];
  colors: string[];
  sizes: string[];
  badge?: 'NEW' | 'BESTSELLER' | 'LIMITED' | 'SALE';
  fabric: string;
  embroideryType?: string;
  inStock: boolean;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  stitchingOption?: StitchingOption;
}

export interface StitchingOption {
  type: 'basic' | 'custom';
  price: number;
  measurements?: {
    bust: number;
    waist: number;
    hips: number;
    length: number;
    sleeves: number;
  };
  notes?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

// Sample products data
export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Lyra Mukhawar – Desert Rose FG 1905",
    slug: "desert-rose-fg-1905",
    price: 295,
    description: "A stunning desert rose Mukhawar featuring delicate gold embroidery along the neckline and sleeves. Crafted from 100% premium Egyptian cotton for ultimate comfort and breathability.",
    shortDescription: "Desert rose with gold embroidery",
    images: ["/placeholder.svg"],
    category: "mukhawar",
    collection: ["everyday", "bestsellers"],
    colors: ["Desert Rose", "Gold Accent"],
    sizes: ["S", "M", "L", "XL"],
    badge: "BESTSELLER",
    fabric: "100% Egyptian Cotton",
    embroideryType: "Hand-stitched gold thread",
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "Lyra Mukhawar – Midnight Teal FG 2001",
    slug: "midnight-teal-fg-2001",
    price: 345,
    description: "An elegant midnight teal Mukhawar with intricate silver embroidery. Perfect for special occasions while maintaining everyday comfort.",
    shortDescription: "Midnight teal with silver embroidery",
    images: ["/placeholder.svg"],
    category: "mukhawar",
    collection: ["special", "new"],
    colors: ["Midnight Teal", "Silver Accent"],
    sizes: ["S", "M", "L", "XL"],
    badge: "NEW",
    fabric: "100% Premium Cotton",
    embroideryType: "Machine embroidered silver thread",
    inStock: true,
    featured: true,
  },
  {
    id: "3",
    name: "Lyra Mukhawar – Champagne Dream FG 1888",
    slug: "champagne-dream-fg-1888",
    price: 425,
    compareAtPrice: 495,
    description: "A luxurious champagne Mukhawar from our Premium Edit collection. Features hand-embroidered pearl details and silk-blend lining.",
    shortDescription: "Champagne with pearl embroidery",
    images: ["/placeholder.svg"],
    category: "premium",
    collection: ["wedding", "premium"],
    colors: ["Champagne", "Pearl White"],
    sizes: ["S", "M", "L", "XL"],
    badge: "LIMITED",
    fabric: "Cotton-Silk Blend",
    embroideryType: "Hand-embroidered pearls",
    inStock: true,
    featured: true,
  },
  {
    id: "4",
    name: "Lyra Mukhawar – Soft Blush FG 1750",
    slug: "soft-blush-fg-1750",
    price: 275,
    description: "A delicate blush pink Mukhawar perfect for everyday elegance. Features subtle tone-on-tone embroidery.",
    shortDescription: "Soft blush with subtle embroidery",
    images: ["/placeholder.svg"],
    category: "mukhawar",
    collection: ["everyday"],
    colors: ["Soft Blush"],
    sizes: ["S", "M", "L", "XL"],
    fabric: "100% Premium Cotton",
    embroideryType: "Tone-on-tone embroidery",
    inStock: true,
    featured: true,
  },
  {
    id: "5",
    name: "Little Lyra – Princess Bloom FG 501",
    slug: "princess-bloom-fg-501",
    price: 195,
    description: "A charming Mukhawar for little ones featuring playful floral embroidery. Soft, breathable cotton perfect for active kids.",
    shortDescription: "Kids floral embroidered Mukhawar",
    images: ["/placeholder.svg"],
    category: "kids",
    collection: ["kids", "new"],
    colors: ["Lavender", "Pink Accents"],
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
    badge: "NEW",
    fabric: "100% Soft Cotton",
    embroideryType: "Floral machine embroidery",
    inStock: true,
    featured: true,
  },
  {
    id: "6",
    name: "Lyra Shaila – Classic Ivory SH 100",
    slug: "classic-ivory-sh-100",
    price: 85,
    description: "A timeless ivory shaila crafted from lightweight cotton. Perfect for pairing with any Mukhawar.",
    shortDescription: "Classic ivory lightweight shaila",
    images: ["/placeholder.svg"],
    category: "shaila",
    collection: ["everyday", "bestsellers"],
    colors: ["Ivory"],
    sizes: ["One Size"],
    badge: "BESTSELLER",
    fabric: "100% Lightweight Cotton",
    inStock: true,
    featured: false,
  },
  {
    id: "7",
    name: "Lyra Mukhawar – Ocean Mist FG 2010",
    slug: "ocean-mist-fg-2010",
    price: 315,
    description: "A serene ocean-inspired Mukhawar with wave-pattern embroidery in silver thread.",
    shortDescription: "Ocean blue with wave embroidery",
    images: ["/placeholder.svg"],
    category: "mukhawar",
    collection: ["special", "ramadan"],
    colors: ["Ocean Blue", "Silver"],
    sizes: ["S", "M", "L", "XL"],
    fabric: "100% Premium Cotton",
    embroideryType: "Wave pattern silver thread",
    inStock: true,
    featured: true,
  },
  {
    id: "8",
    name: "Lyra Mukhawar – Emerald Garden FG 1999",
    slug: "emerald-garden-fg-1999",
    price: 365,
    description: "A rich emerald green Mukhawar with botanical-inspired gold embroidery. A statement piece for special occasions.",
    shortDescription: "Emerald green with botanical gold",
    images: ["/placeholder.svg"],
    category: "mukhawar",
    collection: ["special", "wedding"],
    colors: ["Emerald Green", "Gold"],
    sizes: ["S", "M", "L", "XL"],
    badge: "LIMITED",
    fabric: "100% Premium Cotton",
    embroideryType: "Botanical gold thread embroidery",
    inStock: true,
    featured: true,
  },
];

export const collections: Collection[] = [
  {
    id: "1",
    name: "Everyday Essentials",
    slug: "everyday",
    description: "Comfortable, elegant pieces for daily wear",
    image: "/placeholder.svg",
    productCount: 24,
  },
  {
    id: "2",
    name: "Special Occasions",
    slug: "special",
    description: "Statement pieces for memorable moments",
    image: "/placeholder.svg",
    productCount: 18,
  },
  {
    id: "3",
    name: "Wedding Season",
    slug: "wedding",
    description: "Luxurious designs for celebrations",
    image: "/placeholder.svg",
    productCount: 12,
  },
  {
    id: "4",
    name: "Ramadan Edit",
    slug: "ramadan",
    description: "Curated collection for the holy month",
    image: "/placeholder.svg",
    productCount: 15,
  },
];
