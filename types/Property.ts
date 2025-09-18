export interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    city: string;
    address: string;
    coordinates: [number, number];
  };
  pricing: {
    amount: number;
    currency: string;
    period: 'day' | 'week' | 'month';
  };
  availability: {
    startDate: Date;
    endDate: Date;
  };
  category: 'whole-place' | 'solo-room' | 'new-roommate';
  houseRules: string[];
  images: string[];
  sublessorId: string;
  sublessor?: {
    name: string;
    avatar?: string;
    verified: boolean;
    location?: string;
    memberSince?: string;
    totalStays?: number;
    bio?: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  amenities?: string[];
  createdAt: Date;
  updatedAt: Date;
}