export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  readAt?: Date;
  type: 'text' | 'image' | 'system' | 'agreement' | 'date-proposal';
  agreementData?: {
    startDate: Date;
    endDate: Date;
    price: number;
    currency: string;
    period: string;
    houseRules: string[];
    status: 'pending' | 'accepted' | 'declined';
  };
  dateProposal?: {
    startDate: Date;
    endDate: Date;
    status: 'pending' | 'accepted' | 'declined' | 'counter';
  };
}

export interface Chat {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    image: string;
    location: string;
  };
  participants: {
    sublessor: {
      id: string;
      name: string;
      avatar?: string;
    };
    sublessee: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  lastMessage?: ChatMessage;
  status: 'pending' | 'active' | 'negotiating' | 'agreement' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled' | 'declined';
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatListItem {
  id: string;
  propertyTitle: string;
  propertyImage: string;
  otherParticipant: {
    name: string;
    avatar?: string;
  };
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: Chat['status'];
}