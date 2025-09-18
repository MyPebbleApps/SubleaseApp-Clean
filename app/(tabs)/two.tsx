import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { User } from '../../types/User';
import type { Property } from '../../types/Property';

// Mock user data
const currentUser: User = {
  id: 'user123',
  name: 'Jessica Chen',
  email: 'jessica.chen@email.com',
  avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
  bio: 'Digital nomad and travel enthusiast. Love experiencing local culture and making connections around the world.',
  isVerified: true,
  ratings: {
    average: 4.8,
    count: 15,
  },
  savedProperties: ['2', '4'], // IDs of saved properties
  memberSince: '2023',
  location: 'San Francisco, CA',
  phoneVerified: true,
  emailVerified: true,
};

// Sample properties (subset for saved properties)
const sampleProperties: Property[] = [
  {
    id: '2',
    title: 'Room in Venice Beach House - Summer Sublease',
    description: 'Private room in a shared beach house.',
    location: {
      city: 'Los Angeles',
      address: 'Venice Beach, CA',
      coordinates: [33.9850, -118.4695] as [number, number],
    },
    pricing: {
      amount: 1200,
      currency: 'USD',
      period: 'month' as const,
    },
    availability: {
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-09-01'),
    },
    category: 'solo-room' as const,
    houseRules: [],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
    sublessorId: 'user2',
    sublessor: {
      name: 'Sarah Chen',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      verified: true,
    },
    ratings: {
      average: 4.7,
      count: 8,
    },
    amenities: ['WiFi', 'Kitchen', 'Beach Access'],
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: '4',
    title: 'Roma Norte Studio - Digital Nomad Friendly',
    description: 'Cozy studio in the trendy Roma Norte neighborhood.',
    location: {
      city: 'Mexico City',
      address: 'Roma Norte, CDMX',
      coordinates: [19.4199, -99.1605] as [number, number],
    },
    pricing: {
      amount: 800,
      currency: 'USD',
      period: 'month' as const,
    },
    availability: {
      startDate: new Date('2025-01-20'),
      endDate: new Date('2025-04-20'),
    },
    category: 'whole-place' as const,
    houseRules: [],
    images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400'],
    sublessorId: 'user4',
    sublessor: {
      name: 'Ana Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      verified: false,
    },
    ratings: {
      average: 4.6,
      count: 5,
    },
    amenities: ['High-Speed WiFi', 'Kitchenette', 'AC'],
    createdAt: new Date('2025-01-14'),
    updatedAt: new Date('2025-01-14'),
  },
];

const ProfileHeader = ({ user }: { user: User }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatarSection}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        {user.isVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#00A86B" />
          </View>
        )}
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userLocation}>{user.location}</Text>

        <View style={styles.ratingRow}>
          <FontAwesome name="star" size={16} color="#FF385C" />
          <Text style={styles.ratingText}>
            {user.ratings.average} ({user.ratings.count} reviews)
          </Text>
        </View>

        <View style={styles.memberSince}>
          <Text style={styles.memberText}>Member since {user.memberSince}</Text>
        </View>
      </View>
    </View>
  );
};

const EditableBio = ({
  bio,
  onSave
}: {
  bio: string | undefined;
  onSave: (newBio: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(bio || '');
  const [charCount, setCharCount] = useState(bio?.length || 0);
  const maxChars = 200;

  const handleEdit = () => {
    setEditedBio(bio || '');
    setCharCount(bio?.length || 0);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedBio.trim().length === 0) {
      Alert.alert('Empty Bio', 'Please enter a bio or cancel to keep your current bio.');
      return;
    }
    onSave(editedBio.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBio(bio || '');
    setCharCount(bio?.length || 0);
    setIsEditing(false);
  };

  const handleTextChange = (text: string) => {
    if (text.length <= maxChars) {
      setEditedBio(text);
      setCharCount(text.length);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>About</Text>
        {!isEditing && (
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Ionicons name="pencil" size={18} color="#FF385C" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {isEditing ? (
        <View style={styles.bioEditContainer}>
          <TextInput
            style={styles.bioInput}
            value={editedBio}
            onChangeText={handleTextChange}
            multiline
            numberOfLines={4}
            placeholder="Tell us about yourself..."
            placeholderTextColor="#999999"
            maxLength={maxChars}
          />
          <View style={styles.bioEditFooter}>
            <Text style={styles.charCount}>
              {charCount}/{maxChars}
            </Text>
            <View style={styles.bioEditButtons}>
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.bioText}>
          {bio || 'Add a bio to tell other users about yourself...'}
        </Text>
      )}
    </View>
  );
};

const SavedPropertyCard = ({
  property,
  onRemove
}: {
  property: Property;
  onRemove: (propertyId: string) => void;
}) => {
  const handleRemove = () => {
    Alert.alert(
      'Remove Property',
      'Are you sure you want to remove this property from your saved list?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemove(property.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.savedPropertyCard}
      onPress={() => router.push(`/property/${property.id}`)}
    >
      <View style={styles.savedPropertyImageContainer}>
        <Image source={{ uri: property.images[0] }} style={styles.savedPropertyImage} />
        <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
          <Ionicons name="heart" size={20} color="#FF385C" />
        </TouchableOpacity>
      </View>
      <View style={styles.savedPropertyInfo}>
        <Text style={styles.savedPropertyTitle} numberOfLines={2}>
          {property.title}
        </Text>
        <Text style={styles.savedPropertyLocation}>{property.location.city}</Text>
        <View style={styles.savedPropertyPrice}>
          <Text style={styles.priceText}>${property.pricing.amount}</Text>
          <Text style={styles.priceUnit}>/{property.pricing.period}</Text>
        </View>
        {property.ratings && (
          <View style={styles.savedPropertyRating}>
            <FontAwesome name="star" size={12} color="#FF385C" />
            <Text style={styles.savedPropertyRatingText}>
              {property.ratings.average} ({property.ratings.count})
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const [userBio, setUserBio] = useState(currentUser.bio || '');
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(currentUser.savedProperties);

  // Filter saved properties
  const savedProperties = sampleProperties.filter(property =>
    savedPropertyIds.includes(property.id)
  );

  const handleBioSave = (newBio: string) => {
    setUserBio(newBio);
    // TODO: Save to AsyncStorage
    console.log('Bio updated:', newBio);
  };

  const handleRemoveProperty = (propertyId: string) => {
    setSavedPropertyIds(prev => prev.filter(id => id !== propertyId));
    // TODO: Save to AsyncStorage
    console.log('Property removed:', propertyId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <ProfileHeader user={currentUser} />

        {/* Bio Section */}
        <EditableBio bio={userBio} onSave={handleBioSave} />

        {/* Verification Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification</Text>
          <View style={styles.verificationContainer}>
            <View style={styles.verificationItem}>
              <Ionicons
                name={currentUser.emailVerified ? "checkmark-circle" : "close-circle"}
                size={20}
                color={currentUser.emailVerified ? "#00A86B" : "#FF6B6B"}
              />
              <Text style={styles.verificationText}>Email verified</Text>
            </View>
            <View style={styles.verificationItem}>
              <Ionicons
                name={currentUser.phoneVerified ? "checkmark-circle" : "close-circle"}
                size={20}
                color={currentUser.phoneVerified ? "#00A86B" : "#FF6B6B"}
              />
              <Text style={styles.verificationText}>Phone verified</Text>
            </View>
            <View style={styles.verificationItem}>
              <Ionicons
                name={currentUser.isVerified ? "checkmark-circle" : "close-circle"}
                size={20}
                color={currentUser.isVerified ? "#00A86B" : "#FF6B6B"}
              />
              <Text style={styles.verificationText}>ID verified</Text>
            </View>
          </View>
        </View>

        {/* Saved Properties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Properties ({savedProperties.length})</Text>
          {savedProperties.length > 0 ? (
            <FlatList
              data={savedProperties}
              renderItem={({ item }) => (
                <SavedPropertyCard
                  property={item}
                  onRemove={handleRemoveProperty}
                />
              )}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.savedPropertiesList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={48} color="#CCCCCC" />
              <Text style={styles.emptyStateText}>No saved properties yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start exploring and save your favorites!
              </Text>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="time-outline" size={24} color="#717171" />
              <Text style={styles.menuItemText}>Stay History</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#717171" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings-outline" size={24} color="#717171" />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#717171" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  avatarSection: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 16,
    color: '#717171',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#222222',
    marginLeft: 6,
  },
  memberSince: {
    marginTop: 4,
  },
  memberText: {
    fontSize: 14,
    color: '#717171',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: '#222222',
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editButtonText: {
    fontSize: 14,
    color: '#FF385C',
    marginLeft: 4,
    fontWeight: '500',
  },
  bioEditContainer: {
    marginTop: 8,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#222222',
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#FAFAFA',
  },
  bioEditFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#717171',
  },
  bioEditButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#717171',
    fontWeight: '500',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FF385C',
  },
  saveButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  verificationContainer: {
    gap: 12,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 16,
    color: '#222222',
    marginLeft: 12,
  },
  savedPropertiesList: {
    marginTop: 8,
  },
  savedPropertyCard: {
    width: 200,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  savedPropertyImageContainer: {
    position: 'relative',
  },
  savedPropertyImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  savedPropertyInfo: {
    padding: 12,
  },
  savedPropertyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 4,
  },
  savedPropertyLocation: {
    fontSize: 12,
    color: '#717171',
    marginBottom: 8,
  },
  savedPropertyPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
  },
  priceUnit: {
    fontSize: 12,
    color: '#717171',
    marginLeft: 2,
  },
  savedPropertyRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  savedPropertyRatingText: {
    fontSize: 12,
    color: '#717171',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#717171',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#222222',
    marginLeft: 12,
  },
});
