import { Chat, ChatMessage } from '@/types/Chat';
import { Property } from '@/types/Property';

// Mock storage for chats (in a real app, this would be in a database/API)
let mockChats: Chat[] = [];
let nextChatId = 5; // Starting from 5 since we have 4 mock chats

export const createNewChat = (property: Property, userId: string = 'currentUser'): Chat => {
  const newChat: Chat = {
    id: nextChatId.toString(),
    propertyId: property.id,
    property: {
      id: property.id,
      title: property.title,
      image: property.images[0],
      location: property.location.address,
    },
    participants: {
      sublessor: {
        id: property.sublessorId,
        name: property.sublessor?.name || 'Unknown',
        avatar: property.sublessor?.avatar,
      },
      sublessee: {
        id: userId,
        name: 'You', // In a real app, get from user context
        avatar: undefined,
      },
    },
    lastMessage: undefined,
    status: 'pending',
    unreadCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockChats.push(newChat);
  nextChatId++;

  return newChat;
};

export const createInitialInquiryMessage = (
  chatId: string,
  property: Property,
  message?: string
): ChatMessage => {
  const defaultMessage = `Hi! I'm interested in your ${property.category === 'whole-place' ? 'place' : 'room'} in ${property.location.city}. Is it still available for the dates ${formatDateShort(property.availability.startDate)} to ${formatDateShort(property.availability.endDate)}? I'd love to learn more about it.`;

  return {
    id: Date.now().toString(),
    senderId: 'currentUser',
    content: message || defaultMessage,
    timestamp: new Date(),
    type: 'text',
  };
};

export const updateChatStatus = (
  chatId: string,
  newStatus: Chat['status']
): void => {
  const chatIndex = mockChats.findIndex(c => c.id === chatId);
  if (chatIndex !== -1) {
    mockChats[chatIndex].status = newStatus;
    mockChats[chatIndex].updatedAt = new Date();
  }
};

export const acceptInquiry = (chatId: string): void => {
  updateChatStatus(chatId, 'active');
};

export const declineInquiry = (chatId: string): void => {
  updateChatStatus(chatId, 'declined');
};

export const sendAgreement = (
  chatId: string,
  startDate: Date,
  endDate: Date,
  price: number,
  currency: string,
  period: string,
  houseRules: string[]
): ChatMessage => {
  updateChatStatus(chatId, 'agreement');

  return {
    id: Date.now().toString(),
    senderId: 'sublessor',
    content: "I've sent you a sublease agreement. Please review the details below:",
    timestamp: new Date(),
    type: 'agreement',
    agreementData: {
      startDate,
      endDate,
      price,
      currency,
      period,
      houseRules,
      status: 'pending',
    },
  };
};

export const proposeDates = (
  chatId: string,
  startDate: Date,
  endDate: Date
): ChatMessage => {
  return {
    id: Date.now().toString(),
    senderId: 'currentUser',
    content: `I'd like to propose these dates: ${formatDateShort(startDate)} to ${formatDateShort(endDate)}`,
    timestamp: new Date(),
    type: 'date-proposal',
    dateProposal: {
      startDate,
      endDate,
      status: 'pending',
    },
  };
};

const formatDateShort = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

// Check if a chat already exists for a property
export const findExistingChat = (propertyId: string, userId: string = 'currentUser'): Chat | undefined => {
  return mockChats.find(
    chat => chat.propertyId === propertyId &&
    (chat.participants.sublessee.id === userId || chat.participants.sublessor.id === userId)
  );
};

export const getMockChats = (): Chat[] => mockChats;