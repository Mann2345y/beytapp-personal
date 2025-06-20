import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {usePropertyContext} from '../../context/PropertyContext';
import PropertyCard from '../../components/Properties/PropertyCard';
import PropertyFilterBar from '../../components/Properties/PropertyFilterBar';
import PropertyDetailsScreen from './PropertyDetailsScreen';
import PropertyCardSkeleton from '../../components/Properties/PropertyCardSkeleton';
import {useTranslation} from 'react-i18next';
import LanguageSwitchDropdown from '../../components/Reusables/LanguageSwitchDropdown';

const PropertyScreen: React.FC = () => {
  const {t} = useTranslation();
  const {
    properties,
    loading,
    error,
    fetchMore,
    hasMore,
    setFilters,
    isFetchingMore,
  } = usePropertyContext();

  const [selectedProperty, setSelectedProperty] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleEndReached = () => {
    if (hasMore && !isFetchingMore && !loading) {
      fetchMore();
    }
  };

  console.log({properties});

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.languageSwitcherWrapper}>
        <LanguageSwitchDropdown />
      </View>
      <PropertyFilterBar setFilters={setFilters} />
      {loading ? (
        <FlatList
          data={Array.from({length: 6})}
          keyExtractor={(_, idx) => `skeleton-${idx}`}
          renderItem={() => <PropertyCardSkeleton />}
          contentContainerStyle={styles.flatListContent}
        />
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : !properties.length ? (
        <View style={styles.centered}>
          <Text>{t('propertyListings.noPropertiesFound')}</Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={item => item.id?.toString() || item._id?.toString()}
          renderItem={({item}) => (
            <PropertyCard
              property={item}
              onPress={() => {
                setSelectedProperty(item);
                setModalVisible(true);
              }}
            />
          )}
          contentContainerStyle={styles.flatListContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            isFetchingMore && hasMore ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" />
              </View>
            ) : null
          }
        />
      )}
      <PropertyDetailsScreen
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        propertyData={selectedProperty}
        loading={!selectedProperty}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  flatListContent: {paddingBottom: 32},
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageSwitcherWrapper: {padding: 12, alignItems: 'flex-end'},
});

export default PropertyScreen;
