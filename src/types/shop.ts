export interface Shop {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  postalCode: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  category: string;
  isActive: boolean;
  specializations?: string[];
  openingHours?: Record<string, string>;
  services?: Service[];
  reviews?: Review[];
  certifications?: string[];
  aboutText?: string;
  experienceYears?: number;
}

export interface Service {
  name: string;
  description: string;
  price: string;
  duration?: string;
}

export interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  ELECTRONICS: 'Elektro und Elektronik',
  CLOTHING: 'Kleidung',
  SHOES: 'Schuhe',
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    ELECTRONICS: '📱',
    CLOTHING: '👕',
    SHOES: '👟',
  };
  return icons[category] || '🔧';
};
