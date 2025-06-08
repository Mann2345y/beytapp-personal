import React from 'react';
import {View, FlatList, Text, StyleSheet} from 'react-native';
import {usePropertyContext} from '../../context/PropertyContext';
import PropertyCard from '../../components/Properties/PropertyCard';
import PropertyFilterBar from '../../components/Properties/PropertyFilterBar';
import PropertyDetailsScreen from './PropertyDetailsScreen';
import PropertyCardSkeleton from '../../components/Properties/PropertyCardSkeleton';

const PropertyScreen: React.FC = () => {
  const {properties, loading, error} = usePropertyContext();
  const [selectedProperty, setSelectedProperty] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <PropertyFilterBar />
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
      ) : !properties || properties.length === 0 ? (
        <View style={styles.centered}>
          <Text>No properties found.</Text>
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
        />
      )}
      <PropertyDetailsScreen
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        propertyData={selectedProperty}
        loading={!selectedProperty}
      />
    </View>
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
});

export default PropertyScreen;
