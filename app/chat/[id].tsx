import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { ChatMessage } from '@/types/Chat';
import {
  acceptInquiry,
  declineInquiry,
  createInitialInquiryMessage,
  sendAgreement,
  proposeDates,
  updateChatStatus
} from '@/utils/chatService';

interface ChatHeaderData {
  propertyTitle: string;
  propertyImage: string;
  propertyHouseRules?: string[];
  propertyPricing?: {
    amount: number;
    currency: string;
    period: string;
  };
  propertyDates?: {
    startDate: Date;
    endDate: Date;
  };
  otherParticipant: {
    name: string;
    avatar?: string;
  };
  status: 'pending' | 'active' | 'negotiating' | 'agreement' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled' | 'declined';
  isSublessor: boolean; // True if current user is the sublessor
}

// Mock data for different chats with enhanced details
const mockChatData: Record<string, ChatHeaderData> = {
  '1': {
    propertyTitle: 'Modern Studio in Downtown',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop',
    propertyHouseRules: ['No smoking', 'No parties', 'Quiet hours after 10PM'],
    propertyPricing: { amount: 2500, currency: 'USD', period: 'month' },
    propertyDates: { startDate: new Date('2025-02-01'), endDate: new Date('2025-05-01') },
    otherParticipant: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b098?w=100&h=100&fit=crop',
    },
    status: 'negotiating',
    isSublessor: false,
  },
  '2': {
    propertyTitle: 'Cozy 1BR Near University',
    propertyImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop',
    propertyHouseRules: ['Keep common areas clean', 'Water plants twice weekly'],
    propertyPricing: { amount: 1800, currency: 'USD', period: 'month' },
    propertyDates: { startDate: new Date('2025-03-01'), endDate: new Date('2025-06-01') },
    otherParticipant: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    status: 'confirmed',
    isSublessor: false,
  },
  '5': { // Example where user is sublessor receiving an inquiry
    propertyTitle: 'Your Listed Property',
    propertyImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop',
    propertyHouseRules: ['No pets', 'Respect neighbors'],
    propertyPricing: { amount: 2000, currency: 'USD', period: 'month' },
    propertyDates: { startDate: new Date('2025-02-15'), endDate: new Date('2025-05-15') },
    otherParticipant: {
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    status: 'pending',
    isSublessor: true,
  },
};

const mockMessages: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: '1',
      senderId: 'other',
      content: 'Hi! I saw your inquiry about the studio. When would you like to view it?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: 'text',
    },
    {
      id: '2',
      senderId: 'me',
      content: 'Hello! I\'m available tomorrow afternoon or this weekend. What works best for you?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      type: 'text',
    },
    {
      id: '3',
      senderId: 'other',
      content: 'Great! I can show you the place tomorrow at 3pm',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: 'text',
    },
  ],
  '2': [
    {
      id: '1',
      senderId: 'me',
      content: 'Hi! Is this 1BR still available for next month?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      type: 'text',
    },
    {
      id: '2',
      senderId: 'other',
      content: 'Yes, it\'s available! The lease terms are $1,800/month including utilities.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      type: 'text',
    },
    {
      id: '3',
      senderId: 'me',
      content: 'That sounds perfect! I\'d like to proceed with the lease.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
      type: 'text',
    },
    {
      id: '4',
      senderId: 'other',
      content: 'Thanks for your interest! The lease is confirmed.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: 'text',
    },
  ],
};

const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

  const diffInDays = Math.floor(diffInMinutes / 1440);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return date.toLocaleDateString();
};

const getStatusColor = (status: ChatHeaderData['status']): string => {
  switch (status) {
    case 'pending': return '#FF9500';
    case 'active': return '#34C759';
    case 'negotiating': return '#007AFF';
    case 'agreement': return '#5856D6';
    case 'confirmed': return '#34C759';
    case 'ongoing': return '#34C759';
    case 'completed': return '#8E8E93';
    case 'cancelled': return '#FF3B30';
    case 'declined': return '#FF3B30';
    default: return '#8E8E93';
  }
};

interface MessageItemProps {
  message: ChatMessage;
  isFromMe: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isFromMe }) => (
  <View style={[styles.messageContainer, isFromMe ? styles.myMessage : styles.otherMessage]}>
    <View style={[styles.messageBubble, isFromMe ? styles.myBubble : styles.otherBubble]}>
      <Text style={[styles.messageText, isFromMe ? styles.myMessageText : styles.otherMessageText]}>
        {message.content}
      </Text>
    </View>
    <Text style={styles.messageTime}>
      {formatMessageTime(message.timestamp)}
    </Text>
  </View>
);

export default function ChatScreen() {
  const { id, initialMessage } = useLocalSearchParams();
  const chatId = Array.isArray(id) ? id[0] : id;
  const isInitialInquiry = initialMessage === 'true';

  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages[chatId] || []);
  const [inputText, setInputText] = useState('');
  const [chatStatus, setChatStatus] = useState<ChatHeaderData['status']>(
    mockChatData[chatId]?.status || 'pending'
  );
  const [showHouseRules, setShowHouseRules] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAgreementForm, setShowAgreementForm] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const chatData = mockChatData[chatId];

  useEffect(() => {
    // Add initial inquiry message if this is a new chat
    if (isInitialInquiry && messages.length === 0 && chatData) {
      const property = {
        id: chatId,
        title: chatData.propertyTitle,
        category: 'whole-place' as const,
        location: { city: 'City' },
        availability: chatData.propertyDates || {
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        }
      };
      const initialMsg = createInitialInquiryMessage(
        chatId,
        property as any
      );
      setMessages([initialMsg]);
    }

    // Scroll to bottom when messages change
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isInitialInquiry, chatData, chatId]);

  if (!chatData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Chat not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAcceptInquiry = () => {
    Alert.alert(
      'Accept Inquiry',
      'Are you sure you want to accept this inquiry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            setChatStatus('active');
            acceptInquiry(chatId);
            const systemMessage: ChatMessage = {
              id: Date.now().toString(),
              senderId: 'system',
              content: 'Inquiry accepted. You can now negotiate the terms.',
              timestamp: new Date(),
              type: 'system',
            };
            setMessages(prev => [...prev, systemMessage]);
          }
        }
      ]
    );
  };

  const handleDeclineInquiry = () => {
    Alert.alert(
      'Decline Inquiry',
      'Are you sure you want to decline this inquiry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            setChatStatus('declined');
            declineInquiry(chatId);
            const systemMessage: ChatMessage = {
              id: Date.now().toString(),
              senderId: 'system',
              content: 'Inquiry declined.',
              timestamp: new Date(),
              type: 'system',
            };
            setMessages(prev => [...prev, systemMessage]);
          }
        }
      ]
    );
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'me',
        content: inputText.trim(),
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');

      // Simulate a response (in real app, this would come from the server)
      setTimeout(() => {
        const responses = [
          "Thanks for your message!",
          "I'll get back to you shortly.",
          "Sounds good!",
          "Let me check on that.",
        ];
        const responseMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: 'other',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: 'text',
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const showPropertyDetails = () => {
    Alert.alert(
      'Property Details',
      `View details for "${chatData.propertyTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View', onPress: () => {
          // In a real app, navigate to property details
          console.log('Navigate to property details');
        }},
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat Header */}
      <TouchableOpacity style={styles.header} onPress={showPropertyDetails}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={18} color="#007AFF" />
        </TouchableOpacity>

        <Image source={{ uri: chatData.propertyImage }} style={styles.propertyHeaderImage} />

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {chatData.propertyTitle}
          </Text>
          <View style={styles.participantInfo}>
            {chatData.otherParticipant.avatar && (
              <Image
                source={{ uri: chatData.otherParticipant.avatar }}
                style={styles.participantHeaderAvatar}
              />
            )}
            <Text style={styles.participantHeaderName}>
              {chatData.otherParticipant.name}
            </Text>
            <View style={[styles.headerStatusBadge, { backgroundColor: getStatusColor(chatStatus) }]}>
              <Text style={styles.headerStatusText}>
                {chatStatus.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {chatData.propertyHouseRules && chatData.propertyHouseRules.length > 0 && (
          <TouchableOpacity onPress={() => setShowHouseRules(!showHouseRules)}>
            <MaterialIcons name="rule" size={20} color="#FF9500" />
          </TouchableOpacity>
        )}
        <FontAwesome name="info-circle" size={20} color="#8E8E93" style={{ marginLeft: 10 }}/>
      </TouchableOpacity>

      {/* House Rules Display */}
      {showHouseRules && chatData.propertyHouseRules && (
        <View style={styles.houseRulesContainer}>
          <Text style={styles.houseRulesTitle}>House Rules</Text>
          {chatData.propertyHouseRules.map((rule, index) => (
            <Text key={index} style={styles.houseRuleItem}>• {rule}</Text>
          ))}
        </View>
      )}

      {/* Accept/Decline Buttons for Pending Inquiries */}
      {chatStatus === 'pending' && chatData.isSublessor && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={handleAcceptInquiry}
          >
            <MaterialIcons name="check-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Accept Inquiry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={handleDeclineInquiry}
          >
            <MaterialIcons name="cancel" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Status Context Card */}
      {(chatStatus === 'active' || chatStatus === 'negotiating') && chatData.propertyPricing && (
        <View style={styles.contextCard}>
          <Text style={styles.contextTitle}>Property Details</Text>
          <Text style={styles.contextText}>
            ${chatData.propertyPricing.amount}/{chatData.propertyPricing.period}
          </Text>
          {chatData.propertyDates && (
            <Text style={styles.contextText}>
              {formatMessageTime(chatData.propertyDates.startDate)} - {formatMessageTime(chatData.propertyDates.endDate)}
            </Text>
          )}
        </View>
      )}

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageItem
            message={item}
            isFromMe={item.senderId === 'me'}
          />
        )}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Quick Actions Bar */}
      {chatStatus === 'active' && chatData.isSublessor && (
        <View style={styles.quickActionsBar}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => Alert.alert('Send Agreement', 'Agreement feature coming soon!')}
          >
            <MaterialIcons name="description" size={20} color="#007AFF" />
            <Text style={styles.quickActionText}>Send Agreement</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => Alert.alert('Propose Dates', 'Date picker coming soon!')}
          >
            <MaterialIcons name="event" size={20} color="#007AFF" />
            <Text style={styles.quickActionText}>Propose Dates</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <FontAwesome
            name="send"
            size={16}
            color={inputText.trim() ? '#fff' : '#8E8E93'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  propertyHeaderImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantHeaderAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  participantHeaderName: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 8,
  },
  headerStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  headerStatusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 16,
  },
  messageContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    marginBottom: 4,
  },
  myBubble: {
    backgroundColor: '#007AFF',
  },
  otherBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#8E8E93',
    paddingHorizontal: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#007AFF',
  },
  sendButtonInactive: {
    backgroundColor: '#E5E5EA',
  },
  houseRulesContainer: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  houseRulesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9500',
    marginBottom: 8,
  },
  houseRuleItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  declineButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  contextCard: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D8E8FF',
  },
  contextTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 6,
  },
  contextText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  quickActionsBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F8F8',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  quickActionText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 6,
    fontWeight: '500',
  },
});