export type MediumId =
  | 'billboard'
  | 'newspaper'
  | 'social_post'
  | 'bus_shelter'
  | 'subway'
  | 'packaging'
  | 'magazine'
  | 'storefront';

export interface ProductProfile {
  name: string;
  category: string;
  tagline: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  materials: string;
  brandAesthetic: string;
}

export interface MediumDefinition {
  id: MediumId;
  name: string;
  category: 'Outdoor' | 'Print' | 'Digital' | 'Retail';
  aspectRatio: '1:1' | '16:9' | '3:4' | '4:3' | '9:16';
  tag: string;
  iconName: string;
  description: string;
  defaultNotes: string;
}

export interface GeneratedShot {
  id: string;
  mediumId: MediumId | 'master';
  mediumName: string;
  imageUrl: string;
  aspectRatio: string;
  timestamp: number;
  promptUsed: string;
  modelUsed: string;
  customNotes?: string;
}

export interface SamplePreset {
  id: string;
  name: string;
  tagline: string;
  category: string;
  summary: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  materials: string;
  brandAesthetic: string;
}
