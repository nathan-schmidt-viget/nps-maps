// NPS API Types
export interface ParkImage {
  url: string;
  altText: string;
  caption: string;
}

export interface EntranceFee {
  title: string;
  cost: string;
  description: string;
}

export interface ParkContact {
  phoneNumbers: Array<{
    phoneNumber: string;
    description: string;
    extension: string;
    type: string;
  }>;
  emailAddresses: Array<{
    emailAddress: string;
    description: string;
  }>;
}

export interface ParkAddress {
  line1: string;
  line2: string;
  line3: string;
  city: string;
  stateCode: string;
  postalCode: string;
  type: string;
}

export interface OperatingHours {
  name: string;
  description: string;
  standardHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export interface ParkData {
  fullName: string;
  description: string;
  images: ParkImage[];
  entranceFees: EntranceFee[];
  operatingHours: OperatingHours[];
  weatherInfo: string;
  contacts: ParkContact;
  addresses: ParkAddress[];
  url: string;
}

export interface NPSResponse<T = ParkData> {
  data: T[];
}

export interface AlertData {
  title: string;
  category: string;
  description: string;
}

export interface EventData {
  title: string;
  description: string;
}

export interface ThingToDoData {
  title: string;
  shortDescription: string;
  url: string;
  images: ParkImage[];
}

// Map/GeoJSON Types
export interface NPSProperties {
  Code: string;
  Name: string;
  distance?: number;
}

export interface NPSFeature {
  type: "Feature";
  id: number;
  properties: NPSProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  show?: boolean;
}

export interface SearchResult {
  coordinates: [number, number];
}
