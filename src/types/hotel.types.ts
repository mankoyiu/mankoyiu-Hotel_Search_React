export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Hotel {
  _id?: string;
  name: string;
  description: string;
  location: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  policies: string[];
  star: number;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  roomTypes: string[];
  photos: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  coordinates: Coordinates;
  accommodationType: string;
  agencyId?: string;
  facilities: string[];
  ranking: number;
  lastUpdate: string;
} 