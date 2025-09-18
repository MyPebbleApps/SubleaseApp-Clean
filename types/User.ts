export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  ratings: {
    average: number;
    count: number;
  };
  savedProperties: string[]; // Array of property IDs
  memberSince: string;
  location?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
}

export interface UserStay {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  startDate: Date;
  endDate: Date;
  status: 'completed' | 'upcoming' | 'cancelled';
  ratingGiven?: number;
  ratingReceived?: number;
  sublessorName: string;
}