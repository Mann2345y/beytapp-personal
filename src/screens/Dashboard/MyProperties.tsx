import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import PropertyCard from '../../components/Properties/PropertyCard';
import PropertyCardSkeleton from '../../components/Properties/PropertyCardSkeleton';
import api from '../../api/axiosConfig';
import {useUser} from '../../context/UserContext';
import {ROUTES} from '../../constants/routes';
import {fetchPropertiesOfLoggedUser} from '../../utils/apiCalls';
import {useQuery} from '@tanstack/react-query';

const MyProperties = () => {
  const {user} = useUser();

  const {
    data: properties,
    refetch: refetchProperties,
    isPending,
  } = useQuery({
    queryKey: [ROUTES.PROPERTIES, user?._id],
    queryFn: () => fetchPropertiesOfLoggedUser(user?._id),
    enabled: !!user?._id,
  });

  const handleEdit = (property: any) => {
    // Do nothing for now
  };

  const handleDelete = async (property: any) => {
    try {
      await api.put(`${ROUTES.PROPERTIES}/${property?._id}`, {archived: true});
      refetchProperties();
    } catch {
      console.error('Error', 'Failed to delete property (dummy call)');
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
              showEditDelete
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
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

export default MyProperties;
