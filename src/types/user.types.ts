// src/types/user.types.ts
export interface Name {
    firstname: string;
    lastname: string;
    nickname: string;
    middlename?: string;
  }
  
  export interface User {
    id?: string;
    _id?: string;  // Support both id formats
    username: string;
    email: string;
    phone: string;
    name: Name;
    role: number;
    status: boolean;
    profilePhoto?: string;
    token?: string;
    password?: string;
  }
  
  // src/types/hotel.types.ts
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
  
  // src/types/message.types.ts
  export interface Message {
    _id: string;
    sender: string;
    receiver: string;
    content: string;
    type: 'text';
    timestamp: string;
  }