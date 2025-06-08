import React from 'react';
import {View, StyleSheet} from 'react-native';

const PropertyCardSkeleton: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.imageSkeleton} />
    <View style={styles.textRow}>
      <View style={styles.titleSkeleton} />
      <View style={styles.priceSkeleton} />
    </View>
    <View style={styles.textRow}>
      <View style={styles.detailSkeleton} />
      <View style={styles.detailSkeleton} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    elevation: 2,
  },
  imageSkeleton: {
    height: 140,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleSkeleton: {
    width: '60%',
    height: 18,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
  priceSkeleton: {
    width: 60,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  detailSkeleton: {
    width: 40,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
});

export default PropertyCardSkeleton;
