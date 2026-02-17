export interface RawVehicleData {
  'Marque': string;
  'Modèle': string;
  'Catégorie': string;
  'Prix Vente': string;
  'Image'?: string; 
  'URL img'?: string;
  'Description'?: string;
  'Badge'?: string;
  'VIP'?: string; // Nouvelle colonne GSheet (Checkbox = TRUE/FALSE)
  [key: string]: string | undefined;
}

export interface Vehicle {
  id: string;
  originalIndex: number;
  brand: string;
  model: string;
  category: string;
  price: string;
  priceValue: number;
  image?: string;
  description?: string;
  badge?: string;
  vip: boolean; // Nouveau champ booléen
}

export type SortOption = 'original' | 'brand-asc' | 'price-asc' | 'price-desc' | 'name-asc';
