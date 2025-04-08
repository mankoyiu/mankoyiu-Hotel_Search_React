export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Hotel {
  _id?: string;
  name: string;
  star: number;
  accommodationType: string;
  address: string;
  city: string;
  country: string;
  description: string;
  email: string;
  facilities: string[];
  lastUpdate: Date;
  phones: string[];
  ranking: number;
  web: string;
  token?: string;
} 