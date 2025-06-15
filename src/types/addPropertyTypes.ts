export interface LocationType {
  city: string;
  country: string;
  lat: number;
  lng: number;
  propertyCount: number;
}

export interface AddPropertyFormValues {
  locations: LocationType | null;
  type: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  amenities: string[]; // Added amenities as array of strings
  description: string; // Added description as string (HTML)
  images: any[]; // Accept any[] for compatibility with react-native-image-picker
}
