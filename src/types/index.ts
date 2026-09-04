export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  amazonUrl: string;
  price?: string | number;
  category?: string;
  published: boolean;
  displayOrder: number;
  createdAt: number | any;
  updatedAt: number | any;
  clicks?: number;
}

export interface WebsiteSettings {
  id?: string;
  creatorName: string;
  creatorHandle: string;
  bio: string;
  profilePictureUrl: string;
  logoUrl?: string;
  mainTitle: string;
  mainDescription: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  amazonDisclosureText: string;
  updatedAt?: number | any;
}

export interface AdminStats {
  totalProducts: number;
  publishedProducts: number;
  unpublishedProducts: number;
  totalClicks: number;
  categoriesCount: number;
}

export type ViewMode = 'public' | 'admin' | '404';
export type AdminTab = 'dashboard' | 'products' | 'add-product' | 'settings';
