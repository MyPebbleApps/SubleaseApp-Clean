import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Modal,
  Animated,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import type { Property } from '../../types/Property';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Sample data - in a real app this would come from API/database
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Polanco Apartment - 3 Month Sublease',
    description: 'Beautiful modern apartment in the heart of Polanco. Perfect for professionals or couples. I\'m traveling for work and need someone reliable to take care of my place. The apartment features floor-to-ceiling windows with stunning city views, a fully equipped modern kitchen with stainless steel appliances, and a spacious living area perfect for relaxing or working from home. The building offers 24/7 security, a state-of-the-art gym, and a rooftop pool with panoramic views of Mexico City. Located in one of the most prestigious neighborhoods, you\'ll be walking distance from world-class restaurants, shopping, and cultural attractions.',
    location: {
      city: 'Mexico City',
      address: 'Polanco, CDMX',
      coordinates: [19.4326, -99.1332] as [number, number],
    },
    pricing: {
      amount: 2500,
      currency: 'USD',
      period: 'month' as const,
    },
    availability: {
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-05-01'),
    },
    category: 'whole-place' as const,
    houseRules: [
      'No smoking inside',
      'No parties or events',
      'Quiet hours after 10 PM',
      'Keep common areas clean',
      'Water plants twice a week',
      'Take care of my books and artwork',
      'Respect neighbors and building rules',
    ],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ],
    sublessorId: 'user1',
    sublessor: {
      name: 'Carlos Martinez',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      verified: true,
      location: 'Mexico City, Mexico',
      memberSince: '2022',
      totalStays: 24,
      bio: 'Digital nomad and architect who loves hosting travelers. I believe in creating spaces where people feel at home.',
    },
    ratings: {
      average: 4.9,
      count: 12,
    },
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Gym', 'Pool', 'Doorman'],
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  // Add other properties here for completeness
];

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.carouselImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Page Indicators */}
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const ProfileModal = ({
  visible,
  onClose,
  sublessor
}: {
  visible: boolean;
  onClose: () => void;
  sublessor: Property['sublessor'];
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: screenHeight,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  if (!sublessor) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={onClose}
          activeOpacity={1}
        />
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.modalHandle} />

          <View style={styles.profileHeader}>
            <Image
              source={{ uri: sublessor.avatar }}
              style={styles.profileAvatar}
            />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{sublessor.name}</Text>
                {sublessor.verified && (
                  <Ionicons name="checkmark-circle" size={20} color="#00A86B" />
                )}
              </View>
              <Text style={styles.profileLocation}>{sublessor.location}</Text>
            </View>
          </View>

          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{sublessor.memberSince}</Text>
              <Text style={styles.statLabel}>Joined</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{sublessor.totalStays}</Text>
              <Text style={styles.statLabel}>Total Stays</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.9★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {sublessor.bio && (
            <View style={styles.bioSection}>
              <Text style={styles.bioTitle}>About</Text>
              <Text style={styles.bioText}>{sublessor.bio}</Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Find the property by ID
  const property = sampleProperties.find(p => p.id === id);

  if (!property) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Property not found</Text>
      </SafeAreaView>
    );
  }

  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleContactPress = () => {
    // TODO: Implement contact functionality
    console.log('Contact pressed for property:', property.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <ImageCarousel images={property.images} />

        {/* Property Info */}
        <View style={styles.contentContainer}>
          {/* Title and Location */}
          <View style={styles.headerSection}>
            <Text style={styles.propertyTitle}>{property.title}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#717171" />
              <Text style={styles.locationText}>{property.location.address}</Text>
            </View>
            <View style={styles.ratingRow}>
              <FontAwesome name="star" size={16} color="#FF385C" />
              <Text style={styles.ratingText}>
                {property.ratings.average} ({property.ratings.count} reviews)
              </Text>
            </View>
          </View>

          {/* Host Info */}
          <TouchableOpacity
            style={styles.hostSection}
            onPress={() => setShowProfileModal(true)}
          >
            <Image
              source={{ uri: property.sublessor?.avatar }}
              style={styles.hostAvatar}
            />
            <View style={styles.hostInfo}>
              <Text style={styles.hostName}>Hosted by {property.sublessor?.name}</Text>
              {property.sublessor?.verified && (
                <View style={styles.verifiedRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#00A86B" />
                  <Text style={styles.verifiedText}>Verified Host</Text>
                </View>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#717171" />
          </TouchableOpacity>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this place</Text>
            <Text style={styles.descriptionText}>{property.description}</Text>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {property.amenities?.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <MaterialIcons name="check" size={20} color="#00A86B" />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* House Rules */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>House Rules</Text>
            <View style={styles.rulesContainer}>
              {property.houseRules.map((rule, index) => (
                <View key={index} style={styles.ruleItem}>
                  <Text style={styles.ruleBullet}>•</Text>
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Availability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <Text style={styles.availabilityText}>
              {formatDate(property.availability.startDate)} - {formatDate(property.availability.endDate)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Contact Section */}
      <View style={styles.bottomSection}>
        <View style={styles.priceSection}>
          <Text style={styles.price}>${property.pricing.amount}</Text>
          <Text style={styles.priceUnit}>/{property.pricing.period}</Text>
        </View>
        <TouchableOpacity style={styles.contactButton} onPress={handleContactPress}>
          <Text style={styles.contactButtonText}>Contact Host</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Modal */}
      <ProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        sublessor={property.sublessor}
      />
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
  carouselContainer: {
    height: 300,
    position: 'relative',
  },
  carouselImage: {
    width: screenWidth,
    height: 300,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  headerSection: {
    marginBottom: 20,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#717171',
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#222222',
    marginLeft: 6,
  },
  hostSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 20,
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 4,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 14,
    color: '#00A86B',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#222222',
    lineHeight: 24,
  },
  amenitiesContainer: {
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityText: {
    fontSize: 16,
    color: '#222222',
    marginLeft: 8,
  },
  rulesContainer: {
    gap: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ruleBullet: {
    fontSize: 16,
    color: '#222222',
    marginRight: 8,
    marginTop: 2,
  },
  ruleText: {
    fontSize: 16,
    color: '#222222',
    flex: 1,
    lineHeight: 22,
  },
  availabilityText: {
    fontSize: 16,
    color: '#222222',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
  },
  priceUnit: {
    fontSize: 16,
    color: '#717171',
    marginLeft: 2,
  },
  contactButton: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 34,
    maxHeight: screenHeight * 0.7,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDDDDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
    marginRight: 8,
  },
  profileLocation: {
    fontSize: 16,
    color: '#717171',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#717171',
  },
  bioSection: {
    marginBottom: 20,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    color: '#222222',
    lineHeight: 22,
  },
});