import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import HTMLView from 'react-native-htmlview';

const DEFAULT_IMAGES_FOR_TYPES = {
  apartment: 'https://via.placeholder.com/600x400?text=Apartment',
  villa: 'https://via.placeholder.com/600x400?text=Villa',
};

const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/600x400?text=No+Image';

const {width} = Dimensions.get('window');

interface PropertyDetailsScreenProps {
  visible: boolean;
  onClose: () => void;
  propertyData: any;
  loading: boolean;
}

const PropertyDetailsScreen: React.FC<PropertyDetailsScreenProps> = ({
  visible,
  onClose,
  propertyData,
  loading,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState<boolean>(false);
  const images: string[] =
    propertyData?.images && propertyData.images.length > 0
      ? propertyData.images
      : [
          DEFAULT_IMAGES_FOR_TYPES[
            (propertyData?.type as keyof typeof DEFAULT_IMAGES_FOR_TYPES) ||
              'apartment'
          ] || FALLBACK_IMAGE_URL,
        ];

  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#059669" />
          </View>
        ) : (
          <ScrollView>
            <View style={styles.imageContainer}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={e => {
                  const slide = Math.round(
                    e.nativeEvent.contentOffset.x / width,
                  );
                  setSelectedImageIndex(slide);
                }}>
                {images.map((img: string, idx: number) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.9}
                    onPress={() => {}}>
                    <Image
                      source={{uri: img}}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.dotsContainer}>
                {images.map((_: string, idx: number) => (
                  <View
                    key={idx}
                    style={[
                      styles.dot,
                      selectedImageIndex === idx && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>
            <View style={styles.contentPadding}>
              <Text style={styles.price}>
                {propertyData?.price ? `${propertyData.price} KWD` : 'N/A'}
              </Text>
              <Text style={styles.location}>
                {propertyData?.location?.city}
              </Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>
                  {propertyData?.bedrooms || '--'} Beds
                </Text>
                <Text style={styles.separator}>|</Text>
                <Text style={styles.detailText}>
                  {propertyData?.bathrooms || '--'} Baths
                </Text>
                <Text style={styles.separator}>|</Text>
                <Text style={styles.detailText}>
                  {propertyData?.size || '--'} m²
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  setIsDescriptionExpanded(!isDescriptionExpanded)
                }>
                <Text style={styles.expandBtn}>
                  {isDescriptionExpanded
                    ? 'See Less Details'
                    : 'See More Details'}
                </Text>
              </TouchableOpacity>
              {propertyData?.description ? (
                <HTMLView
                  value={propertyData.description}
                  stylesheet={{
                    p: styles.description,
                    div: styles.description,
                    span: styles.description,
                  }}
                  numberOfLines={isDescriptionExpanded ? undefined : 4}
                />
              ) : null}
              <View style={styles.amenitiesSection}>
                <Text style={styles.sectionTitle}>Amenities</Text>
                {propertyData?.amenities?.map(
                  (amenity: string, idx: number) => (
                    <Text key={idx} style={styles.amenityItem}>
                      • {amenity}
                    </Text>
                  ),
                )}
              </View>
              <View style={styles.agentSection}>
                <Image
                  source={{
                    uri:
                      propertyData?.userId?.image ||
                      'https://via.placeholder.com/112x112?text=User',
                  }}
                  style={styles.agentImage}
                />
                <Text style={styles.agentName}>
                  {propertyData?.userId?.name}
                </Text>
                <Text style={styles.agentPhone}>
                  {propertyData?.userId?.phoneNumber}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {flex: 1, backgroundColor: '#fff'},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  imageContainer: {width: '100%', height: 250, backgroundColor: '#2f3b56'},
  image: {width, height: 250},
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    opacity: 0.5,
  },
  activeDot: {opacity: 1, transform: [{scale: 1.5}]},
  price: {color: '#047857', fontWeight: 'bold', fontSize: 22, marginBottom: 8},
  location: {color: '#64748b', fontSize: 16, marginBottom: 8},
  detailsRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  detailText: {color: '#64748b', fontSize: 15},
  separator: {color: '#cbd5e1', marginHorizontal: 8, fontSize: 15},
  expandBtn: {color: '#059669', marginVertical: 8, fontWeight: 'bold'},
  description: {color: '#334155', fontSize: 15, marginBottom: 12},
  amenitiesSection: {marginTop: 16},
  sectionTitle: {fontWeight: 'bold', fontSize: 16, marginBottom: 6},
  amenityItem: {color: '#334155', fontSize: 14, marginLeft: 8},
  agentSection: {alignItems: 'center', marginTop: 24},
  agentImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  agentName: {fontWeight: 'bold', fontSize: 16},
  agentPhone: {color: '#059669', fontSize: 15, marginTop: 2},
  closeBtn: {
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    margin: 24,
  },
  closeBtnText: {color: '#fff', fontWeight: 'bold'},
  contentPadding: {padding: 16},
});

export default PropertyDetailsScreen;
