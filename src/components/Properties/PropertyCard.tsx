import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import DefaultImageApartment from '../../assets/images/apartment.png';
import DefaultImageBuilding from '../../assets/images/building.png';
import DefaultImageChalet from '../../assets/images/chalet.png';
import DefaultImageCommercial from '../../assets/images/commercial.png';
import DefaultImageDuplex from '../../assets/images/duplex.png';
import DefaultImageFarm from '../../assets/images/farm.png';
import DefaultImageFloor from '../../assets/images/floor.png';
import DefaultImageLand from '../../assets/images/land.png';
import DefaultImageOffice from '../../assets/images/office.png';
import DefaultImageStable from '../../assets/images/stable.jpg';
import DefaultImageVilla from '../../assets/images/villa.png';
import {toggleListingInSavedListings} from '../../utils/apiCalls';
import {useUser} from '../../context/UserContext';
import HeartOutline from '../../assets/images/heart-outline.svg';
import HeartFilled from '../../assets/images/heart-filled.svg';
import {ROUTES} from '../../constants/routes';

export const FALLBACK_IMAGE_URL =
  'https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-autumn-camping.png';

const DEFAULT_IMAGES_FOR_TYPES: Record<string, any> = {
  Villa: DefaultImageVilla,
  Apartment: DefaultImageApartment,
  Land: DefaultImageLand,
  Office: DefaultImageOffice,
  Chalet: DefaultImageChalet,
  Building: DefaultImageBuilding,
  Farm: DefaultImageFarm,
  Duplex: DefaultImageDuplex,
  Floor: DefaultImageFloor,
  Commercial: DefaultImageCommercial,
  Stable: DefaultImageStable,
};

interface PropertyCardProps {
  property: any;
  cardType?: string;
  onPress?: () => void;
  showEditDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  showRemoveSaved?: boolean;
  onRemoveSaved?: () => void;
}

const {width} = Dimensions.get('window');

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  showEditDelete,
  onEdit,
  onDelete,
  showRemoveSaved,
  onRemoveSaved,
}) => {
  const {t, i18n} = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const {user} = useUser();
  const queryClient = useQueryClient();
  const [isFavourited, setIsFavourited] = useState(property?.isLiked || false);
  const [loadingFavourite, setLoadingFavourite] = useState(false);

  const images =
    property?.images && property.images.length > 0
      ? property.images
      : [DEFAULT_IMAGES_FOR_TYPES[property?.type] || FALLBACK_IMAGE_URL];

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setSelectedImageIndex(slide);
  };

  const statusBgColor = property?.status === 'sale' ? '#059669' : '#d97706';

  const {mutateAsync: toggleSaveListing} = useMutation({
    mutationFn: () => toggleListingInSavedListings(user?._id, property?._id),
    onSuccess: () => {
      setIsFavourited((prev: boolean) => !prev);
      queryClient.refetchQueries({
        queryKey: [ROUTES.PROPERTIES],
        exact: false,
      });
    },
    onSettled: () => setLoadingFavourite(false),
  });

  const handleToggleFavourite = async () => {
    if (!user) {
      return;
    }
    setLoadingFavourite(true);
    await toggleSaveListing();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.cardWrapperTouchable}
      onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}>
            {images.map((image: any, index: number) => {
              const imageSource =
                typeof image === 'string' ? {uri: image} : image;
              return (
                <Image
                  key={index}
                  source={imageSource}
                  style={styles.image}
                  resizeMode="cover"
                />
              );
            })}
          </ScrollView>
          <TouchableOpacity
            style={styles.heartButtonAbsolute}
            onPress={e => {
              e.stopPropagation?.();
              handleToggleFavourite();
            }}
            activeOpacity={0.7}
            disabled={loadingFavourite}>
            {isFavourited ? (
              <HeartFilled width={28} height={28} />
            ) : (
              <HeartOutline width={28} height={28} />
            )}
          </TouchableOpacity>
          <View style={styles.dotsContainer}>
            {images.map((_: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  selectedImageIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={[styles.status, {backgroundColor: statusBgColor}]}>
            {property?.status === 'sale' ? t('cards.sale') : t('cards.rent')}
          </Text>
          <Text style={styles.type}>
            {t(`propertyTypes.${property?.type?.toLowerCase?.()}`) ||
              property?.type}
          </Text>
          <Text style={styles.price}>
            {Number(isArabic ? property?.priceArabic : property?.price) === 0
              ? 'N/A'
              : `${isArabic ? property?.priceArabic : property?.price} ${t(
                  'propertyDetails.pricePerYear',
                )}`}
          </Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>
              {(isArabic ? property?.bedroomsArabic : property?.bedrooms) ||
                '--'}{' '}
              {t('cards.beds')}
            </Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.detailText}>
              {(isArabic ? property?.bathroomsArabic : property?.bathrooms) ||
                '--'}{' '}
              {t('cards.baths')}
            </Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.detailText}>
              {(isArabic ? property?.bathroomsArabic : property?.bathrooms) ||
                '--'}{' '}
              {t('cards.areaNotation')}
            </Text>
          </View>
          <Text style={styles.location}>
            {t(`locations.${property?.location?.city}`)}
          </Text>
          {showEditDelete && (
            <View style={styles.editDeleteRow}>
              <TouchableOpacity onPress={onEdit} style={styles.editButton}>
                <Text style={styles.editDeleteText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Text style={styles.editDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          {showRemoveSaved && (
            <View style={styles.editDeleteRow}>
              <TouchableOpacity
                onPress={onRemoveSaved}
                style={styles.deleteButton}>
                <Text style={styles.editDeleteText}>
                  {t('removeSavedListing') || 'Remove from saved'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapperTouchable: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#2f3b56',
  },
  image: {
    width: width - 32,
    height: 200,
  },
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
  activeDot: {
    opacity: 1,
    transform: [{scale: 1.5}],
  },
  infoContainer: {
    padding: 16,
  },
  status: {
    color: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: 'flex-end',
    fontSize: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  type: {
    color: '#334155',
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    color: '#047857',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: '#64748b',
    fontSize: 13,
  },
  separator: {
    color: '#cbd5e1',
    marginHorizontal: 8,
    fontSize: 13,
  },
  location: {
    color: '#64748b',
    fontSize: 13,
  },
  editDeleteRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editButton: {
    marginRight: 12,
    padding: 6,
    backgroundColor: '#fbbf24',
    borderRadius: 6,
  },
  deleteButton: {
    padding: 6,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  editDeleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  heartButtonAbsolute: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 50,
    padding: 8,
    elevation: 2,
    zIndex: 10,
  },
});

export default PropertyCard;
