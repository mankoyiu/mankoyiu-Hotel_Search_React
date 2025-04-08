export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Hotel {
  _id?: string;
  star: number;
  name: string;
  accommodationType: string;
  address: string;
  city: string;
  coordinates: Coordinates;
  country: string;
  description: string;
  email: string;
  facilities: string[];
  lastUpdate: string;
  phones: string;
  ranking: number;
  web: string;
  token: string;
} 