import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { Property } from '../../types/Property';

const { width: screenWidth } = Dimensions.get('window');

// Sample sublease property data
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Polanco Apartment - 3 Month Sublease',
    description: 'Beautiful modern apartment in the heart of Polanco. Perfect for professionals or couples. I\'m traveling for work and need someone reliable to take care of my place.',
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
    ],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    ],
    sublessorId: 'user1',
    sublessor: {
      name: 'Carlos Martinez',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      verified: true,
    },
    ratings: {
      average: 4.9,
      count: 12,
    },
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Gym', 'Pool', 'Doorman'],
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: '2',
    title: 'Room in Venice Beach House - Summer Sublease',
    description: 'Private room in a shared beach house. Great for someone who loves the beach lifestyle. Looking for a clean, responsible roommate for the summer months.',
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
    houseRules: [
      'Clean up after yourself',
      'No overnight guests more than 2 nights/week',
      'Share cleaning duties',
      'Respect quiet hours',
      'No pets',
    ],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    ],
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
    amenities: ['WiFi', 'Kitchen', 'Beach Access', 'Bike Storage', 'Outdoor Patio'],
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: '3',
    title: 'Brooklyn Brownstone - 6 Month Sublease',
    description: 'Entire floor in a classic Brooklyn brownstone. Moving abroad for a work assignment. Perfect for a family or professionals who need a temporary home.',
    location: {
      city: 'New York',
      address: 'Park Slope, Brooklyn',
      coordinates: [40.6681, -73.9806] as [number, number],
    },
    pricing: {
      amount: 3500,
      currency: 'USD',
      period: 'month' as const,
    },
    availability: {
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-09-01'),
    },
    category: 'whole-place' as const,
    houseRules: [
      'No smoking',
      'Respect neighbors',
      'Take care of plants',
      'Forward any mail',
      'No subletting to others',
    ],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
    ],
    sublessorId: 'user3',
    sublessor: {
      name: 'Michael Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      verified: true,
    },
    ratings: {
      average: 5.0,
      count: 15,
    },
    amenities: ['WiFi', 'Full Kitchen', 'Washer/Dryer', 'Backyard', 'Home Office'],
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-08'),
  },
  {
    id: '4',
    title: 'Roma Norte Studio - Digital Nomad Friendly',
    description: 'Cozy studio in the trendy Roma Norte neighborhood. High-speed internet, great for remote work. Coffee shops and restaurants within walking distance.',
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
    houseRules: [
      'Keep noise reasonable',
      'No pets',
      'Weekly cleaning included',
      'Respect building rules',
    ],
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
    ],
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
    amenities: ['High-Speed WiFi', 'Kitchenette', 'AC', 'Security', 'Rooftop Access'],
    createdAt: new Date('2025-01-14'),
    updatedAt: new Date('2025-01-14'),
  },
  {
    id: '5',
    title: 'Looking for Roommate - East Village Apartment',
    description: 'Seeking a compatible roommate to share my 2BR apartment. Great location near subway. Ideal for young professionals or grad students.',
    location: {
      city: 'New York',
      address: 'East Village, Manhattan',
      coordinates: [40.7264, -73.9818] as [number, number],
    },
    pricing: {
      amount: 1800,
      currency: 'USD',
      period: 'month' as const,
    },
    availability: {
      startDate: new Date('2025-02-15'),
      endDate: new Date('2025-08-15'),
    },
    category: 'new-roommate' as const,
    houseRules: [
      'Split utilities 50/50',
      'Clean common areas weekly',
      'Guest policy: weekends only',
      'No loud music after 11 PM',
      'Monthly apartment meeting',
    ],
    images: [
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400',
    ],
    sublessorId: 'user5',
    sublessor: {
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      verified: true,
    },
    ratings: {
      average: 4.8,
      count: 10,
    },
    amenities: ['WiFi', 'Full Kitchen', 'Laundry in Building', 'Elevator', 'Rooftop Deck'],
    createdAt: new Date('2025-01-11'),
    updatedAt: new Date('2025-01-11'),
  },
];

const categories = [
  { id: '1', name: 'All', icon: 'apps' },
  { id: '2', name: 'Whole Place', icon: 'home' },
  { id: '3', name: 'Private Room', icon: 'bed' },
  { id: '4', name: 'Roommate', icon: 'people' },
  { id: '5', name: 'Short-term', icon: 'schedule' },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [likedProperties, setLikedProperties] = useState<string[]>(['2', '5']);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const categoryAnimations = useRef(
    categories.reduce((acc, category) => {
      acc[category.id] = new Animated.Value(selectedCategory === category.id ? 1 : 0);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  // Animation setup on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const toggleLike = (propertyId: string) => {
    setLikedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleCategoryPress = (categoryId: string) => {
    // Animate out the current category
    Animated.timing(categoryAnimations[selectedCategory], {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start();

    // Animate in the new category
    Animated.timing(categoryAnimations[categoryId], {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();

    setSelectedCategory(categoryId);
  };

  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const getCategoryLabel = (category: Property['category']) => {
    switch(category) {
      case 'whole-place': return 'Entire Place';
      case 'solo-room': return 'Private Room';
      case 'new-roommate': return 'Seeking Roommate';
      default: return category;
    }
  };

  const PropertyCard = ({ item, index }: { item: Property; index: number }) => {
    const cardScale = useRef(new Animated.Value(1)).current;
    const heartScale = useRef(new Animated.Value(1)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const cardTranslateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
      // Staggered entrance animation for each card
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 500,
          delay: index * 100, // Stagger cards
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, [cardOpacity, cardTranslateY, index]);

    const handlePressIn = () => {
      Animated.spring(cardScale, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(cardScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    const handleHeartPress = () => {
      // Heart bounce animation
      Animated.sequence([
        Animated.spring(heartScale, {
          toValue: 1.3,
          useNativeDriver: true,
        }),
        Animated.spring(heartScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();

      toggleLike(item.id);
    };

    return (
      <Animated.View
        style={[
          styles.propertyCard,
          {
            opacity: cardOpacity,
            transform: [
              { scale: cardScale },
              { translateY: cardTranslateY },
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => router.push(`/property/${item.id}`)}
        >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.images[0] }} style={styles.propertyImage} />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleHeartPress}
        >
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons
              name={likedProperties.includes(item.id) ? "heart" : "heart-outline"}
              size={24}
              color={likedProperties.includes(item.id) ? "#FF385C" : "white"}
            />
          </Animated.View>
        </TouchableOpacity>
        {item.sublessor?.verified && (
          <View style={styles.superhostBadge}>
            <Text style={styles.superhostText}>VERIFIED</Text>
          </View>
        )}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{getCategoryLabel(item.category)}</Text>
        </View>
      </View>

      <View style={styles.propertyInfo}>
        <View style={styles.ratingRow}>
          <View style={styles.locationContainer}>
            <Text style={styles.propertyType}>{item.location.city}</Text>
            <Text style={styles.location}>{item.location.address}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="#FF385C" />
            <Text style={styles.rating}>{item.ratings.average}</Text>
            <Text style={styles.reviews}>({item.ratings.count})</Text>
          </View>
        </View>

        <Text style={styles.propertyTitle} numberOfLines={1}>{item.title}</Text>

        <Text style={styles.propertyDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.detailsRow}>
          <View style={styles.detail}>
            <Ionicons name="calendar-outline" size={16} color="#717171" />
            <Text style={styles.detailText}>
              {formatDate(item.availability.startDate)} - {formatDate(item.availability.endDate)}
            </Text>
          </View>
        </View>

        {item.amenities && item.amenities.length > 0 && (
          <View style={styles.amenitiesRow}>
            {item.amenities.slice(0, 3).map((amenity, index) => (
              <View key={index} style={styles.amenityChip}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
            {item.amenities.length > 3 && (
              <Text style={styles.moreAmenities}>+{item.amenities.length - 3} more</Text>
            )}
          </View>
        )}

        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ${item.pricing.amount}
            </Text>
            <Text style={styles.priceUnit}>/{item.pricing.period}</Text>
          </View>
          <View style={styles.sublessorInfo}>
            {item.sublessor?.avatar && (
              <Image
                source={{ uri: item.sublessor.avatar }}
                style={styles.sublessorAvatar}
              />
            )}
            <Text style={styles.sublessorName}>{item.sublessor?.name}</Text>
          </View>
        </View>
      </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#717171" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            placeholderTextColor="#717171"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={22} color="#222222" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map(category => {
            const isSelected = selectedCategory === category.id;
            const animatedValue = categoryAnimations[category.id];

            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['#F7F7F7', '#FFE5EA'],
                      }),
                      transform: [
                        {
                          scale: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.05],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <MaterialIcons
                    name={category.icon as any}
                    size={20}
                    color={isSelected ? '#FF385C' : '#717171'}
                  />
                  <Animated.Text
                    style={[
                      styles.categoryText,
                      {
                        color: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['#717171', '#FF385C'],
                        }),
                      },
                    ]}
                  >
                    {category.name}
                  </Animated.Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Property List */}
      <FlatList
        data={sampleProperties}
        renderItem={({ item, index }) => <PropertyCard item={item} index={index} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Map View Button */}
      <Animated.View
        style={[
          styles.mapButton,
          {
            opacity: fadeAnim,
            transform: [{ translateY: Animated.multiply(slideAnim, -1) }],
          },
        ]}
      >
        <TouchableOpacity style={styles.mapButtonInner}>
        <Ionicons name="map" size={18} color="white" />
        <Text style={styles.mapButtonText}>Map</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#222222',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginLeft: 8,
  },
  categoriesContainer: {
    marginBottom: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 80,
  },
  propertyCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#F7F7F7',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  superhostBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  superhostText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#222222',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
  propertyInfo: {
    padding: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  locationContainer: {
    flex: 1,
  },
  propertyType: {
    fontSize: 12,
    color: '#717171',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#717171',
    marginLeft: 2,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 8,
  },
  propertyDescription: {
    fontSize: 14,
    color: '#717171',
    lineHeight: 20,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 13,
    color: '#717171',
    marginLeft: 4,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    alignItems: 'center',
  },
  amenityChip: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 12,
    color: '#717171',
  },
  moreAmenities: {
    fontSize: 12,
    color: '#717171',
    fontStyle: 'italic',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
  },
  priceUnit: {
    fontSize: 14,
    color: '#717171',
    marginLeft: 2,
  },
  availability: {
    fontSize: 13,
    color: '#008A05',
    fontWeight: '500',
  },
  sublessorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sublessorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  sublessorName: {
    fontSize: 13,
    color: '#717171',
    fontWeight: '500',
  },
  separator: {
    height: 16,
  },
  mapButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
  },
  mapButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222222',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  mapButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
});
