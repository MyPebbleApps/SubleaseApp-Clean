import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { ChatListItem } from '@/types/Chat';

// Mock chat data
const mockChats: ChatListItem[] = [
  {
    id: '1',
    propertyTitle: 'Modern Studio in Downtown',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop',
    otherParticipant: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b098?w=100&h=100&fit=crop',
    },
    lastMessage: 'Great! I can show you the place tomorrow at 3pm',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    unreadCount: 2,
    status: 'negotiating',
  },
  {
    id: '2',
    propertyTitle: 'Cozy 1BR Near University',
    propertyImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop',
    otherParticipant: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    lastMessage: 'Thanks for your interest! The lease is confirmed.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    status: 'confirmed',
  },
  {
    id: '3',
    propertyTitle: 'Spacious Room with Garden View',
    propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop',
    otherParticipant: {
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    lastMessage: 'Is the room still available for next month?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 1,
    status: 'inquiry',
  },
  {
    id: '4',
    propertyTitle: 'Loft in Arts District',
    propertyImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300&h=200&fit=crop',
    otherParticipant: {
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    lastMessage: 'Hope you enjoyed your stay! Please leave a review.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    unreadCount: 0,
    status: 'completed',
  },
];

const formatTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  return `${Math.floor(diffInMinutes / 1440)}d`;
};

const getStatusColor = (status: ChatListItem['status']): string => {
  switch (status) {
    case 'inquiry': return '#FF9500';
    case 'negotiating': return '#007AFF';
    case 'confirmed': return '#34C759';
    case 'active': return '#34C759';
    case 'completed': return '#8E8E93';
    case 'cancelled': return '#FF3B30';
    default: return '#8E8E93';
  }
};

const getStatusText = (status: ChatListItem['status']): string => {
  switch (status) {
    case 'inquiry': return 'Inquiry';
    case 'negotiating': return 'Negotiating';
    case 'confirmed': return 'Confirmed';
    case 'active': return 'Active';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    default: return '';
  }
};

interface ChatItemProps {
  item: ChatListItem;
  onPress: (chatId: string) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.chatItem}
    onPress={() => onPress(item.id)}
    activeOpacity={0.7}
  >
    <Image source={{ uri: item.propertyImage }} style={styles.propertyImage} />

    <View style={styles.chatContent}>
      <View style={styles.chatHeader}>
        <View style={styles.leftHeader}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.propertyTitle}
          </Text>
          <View style={styles.participantRow}>
            {item.otherParticipant.avatar && (
              <Image
                source={{ uri: item.otherParticipant.avatar }}
                style={styles.participantAvatar}
              />
            )}
            <Text style={styles.participantName}>
              {item.otherParticipant.name}
            </Text>
          </View>
        </View>

        <View style={styles.rightHeader}>
          <Text style={styles.timeText}>
            {formatTime(item.lastMessageTime)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.messageRow}>
        <Text style={styles.lastMessage} numberOfLines={2}>
          {item.lastMessage}
        </Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {item.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

export default function MessagesScreen() {
  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem item={item} onPress={handleChatPress} />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#fff',
  },
  propertyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftHeader: {
    flex: 1,
    marginRight: 8,
  },
  rightHeader: {
    alignItems: 'flex-end',
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  participantName: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});