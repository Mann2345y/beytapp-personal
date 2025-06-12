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
import {useTranslation} from 'react-i18next';

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
  const {t, i18n} = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
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
                {Number(
                  isArabic ? propertyData?.priceArabic : propertyData?.price,
                ) === 0 || !propertyData?.price
                  ? 'N/A'
                  : `${
                      isArabic ? propertyData?.priceArabic : propertyData?.price
                    } ${t('propertyDetails.pricePerYear')}`}
              </Text>
              <Text style={styles.location}>
                {t(`locations.${propertyData?.location?.city}`)}
              </Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>
                  {(isArabic
                    ? propertyData?.bedroomsArabic
                    : propertyData?.bedrooms) || '--'}{' '}
                  {t('propertyDetails.bedrooms', {
                    count: propertyData?.bedrooms || '--',
                  })}
                </Text>
                <Text style={styles.separator}>|</Text>
                <Text style={styles.detailText}>
                  {(isArabic
                    ? propertyData?.bathroomsArabic
                    : propertyData?.bathrooms) || '--'}{' '}
                  {t('propertyDetails.bathrooms', {
                    count: propertyData?.bathrooms || '--',
                  })}
                </Text>
                <Text style={styles.separator}>|</Text>
                <Text style={styles.detailText}>
                  {(isArabic ? propertyData?.sizeArabic : propertyData?.size) ||
                    '--'}{' '}
                  {t('propertyDetails.area', {
                    size: propertyData?.size || '--',
                  })}
                </Text>
              </View>
              {/* Removed 'see more details' and description is always fully shown */}
              {propertyData?.description ? (
                <HTMLView
                  value={propertyData.description}
                  stylesheet={{
                    p: styles.description,
                    div: styles.description,
                    span: styles.description,
                  }}
                />
              ) : null}
              <View style={styles.amenitiesSection}>
                <Text style={styles.sectionTitle}>
                  {t('propertyDetails.amenities')}
                </Text>
                {propertyData?.amenities?.map(
                  (amenity: string, idx: number) => (
                    <Text key={idx} style={styles.amenityItem}>
                      • {amenity}
                    </Text>
                  ),
                )}
              </View>
            </View>
            {/* Agent info fixed to bottom with white bg and smaller close button */}
            <View style={styles.agentFooterSection}>
              <View style={styles.agentSectionFooterContent}>
                <Image
                  source={{
                    uri:
                      propertyData?.userId?.image ||
                      'https://via.placeholder.com/112x112?text=User',
                  }}
                  style={styles.agentImageFooter}
                />
                <View style={styles.agentInfoFooter}>
                  <Text style={styles.agentNameFooter}>
                    {propertyData?.userId?.name}
                  </Text>
                  <Text style={styles.agentPhoneFooter}>
                    {propertyData?.userId?.phoneNumber}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeBtnFooter}
                  onPress={onClose}>
                  <Text style={styles.closeBtnTextFooter}>
                    {t('close', 'Close')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
  agentFooterSection: {
    position: 'static',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8,
  },
  agentSectionFooterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentImageFooter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
  },
  agentInfoFooter: {
    flex: 1,
    marginLeft: 10,
  },
  agentNameFooter: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  agentPhoneFooter: {
    color: '#059669',
    fontSize: 13,
  },
  closeBtnFooter: {
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginLeft: 10,
  },
  closeBtnTextFooter: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  contentPadding: {padding: 16},
});

export default PropertyDetailsScreen;
