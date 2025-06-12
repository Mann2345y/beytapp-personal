import React from 'react';
import {View} from 'react-native';

const PlaceholderIcon = ({size = 24}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: '#e5e7eb',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    {/* Replace with plus icon later */}
  </View>
);

export default PlaceholderIcon;
