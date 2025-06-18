import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import PropertyCard from '../../components/Properties/PropertyCard';
import PropertyCardSkeleton from '../../components/Properties/PropertyCardSkeleton';
import {useUser} from '../../context/UserContext';
import {useQuery} from '@tanstack/react-query';
import {
  fetchFavorites,
  toggleListingInSavedListings,
} from '../../utils/apiCalls';

const SavedProperties = () => {
  const {user} = useUser();

  const {
    data: properties,
    refetch: refetchProperties,
    isPending,
  } = useQuery({
    queryKey: ['savedProperties', user?._id],
    queryFn: () => fetchFavorites(user?._id),
    enabled: !!user?._id,
  });

  const handleRemoveFromSaved = async (property: any) => {
    try {
      await toggleListingInSavedListings(user?.id, property?._id);
      refetchProperties();
    } catch {
      console.error('Error', 'Failed to remove property from saved listings');
    }
  };

  return (
    <View style={styles.container}>
      {isPending ? (
        <FlatList
          data={Array.from({length: 6})}
          keyExtractor={(_, idx) => `skeleton-${idx}`}
          renderItem={() => <PropertyCardSkeleton />}
        />
      ) : (
        <FlatList
          data={properties as any[]}
          keyExtractor={(item: any) =>
            item.id?.toString() || item._id?.toString()
          }
          renderItem={({item}: {item: any}) => (
            <PropertyCard
              property={item}
              showRemoveSaved
              onRemoveSaved={() => handleRemoveFromSaved(item)}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
});

export default SavedProperties;
