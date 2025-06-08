import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Easing,
  FlatList,
} from 'react-native';
import {usePropertyContext} from '../../context/PropertyContext';
import LocationAutocomplete from './LocationAutocomplete';

const FILTER_OPTIONS = {
  sortBy: [
    {label: 'Price : Low to High', value: 'price_asc'},
    {label: 'Price : High to Low', value: 'price_desc'},
    {label: 'Newest', value: 'created_desc'},
    {label: 'Beds : Low to High', value: 'beds_asc'},
    {label: 'Beds : High to Low', value: 'beds_desc'},
    {label: 'Baths : Low to High', value: 'baths_asc'},
    {label: 'Baths : High to Low', value: 'baths_desc'},
  ],
  bedrooms: [1, 2, 3, 4, 5],
  bathrooms: [1, 2, 3, 4, 5],
  type: [
    'Apartment',
    'Villa',
    'Duplex',
    'Chalet',
    'Commercial',
    'Land',
    'Farm',
    'Office',
    'Stable',
  ],
  status: ['sale', 'rent'],
};

interface FilterButtonProps {
  label: string;
  onPress: () => void;
}
const FilterButton: React.FC<FilterButtonProps> = ({label, onPress}) => (
  <TouchableOpacity style={styles.filterButton} onPress={onPress}>
    <Text style={styles.filterButtonText}>{label}</Text>
  </TouchableOpacity>
);

const PropertyFilterBar = () => {
  const {filters, setFilters} = usePropertyContext();
  const [activeFilter, setActiveFilter] = useState<
    keyof typeof FILTER_OPTIONS | null
  >(null);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const openModal = (filterKey: keyof typeof FILTER_OPTIONS) => {
    slideAnim.setValue(0);
    setActiveFilter(filterKey);
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start(() => {
      setModalVisible(false);
      setActiveFilter(null);
    });
  };

  const handleLocationSelect = (loc: any) => {
    let current = Array.isArray(filters.location) ? filters.location : [];
    current = current.includes(loc.city)
      ? current.filter((v: string) => v !== loc.city)
      : [...current, loc.city];
    setFilters({...filters, location: current});
  };

  const clearLocation = () => {
    const rest = {...filters};
    delete rest.location;
    setFilters(rest);
  };

  const handleFilterSelect = (key: keyof typeof FILTER_OPTIONS, value: any) => {
    if (key === 'type') {
      let current = Array.isArray(filters.type) ? filters.type : [];
      current = current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value];
      setFilters({...filters, type: current});
    } else if (key === 'sortBy') {
      setFilters({...filters, sortBy: value.value});
      closeModal();
    } else {
      setFilters({...filters, [key]: value});
      closeModal();
    }
  };

  const handleClearFilter = (key: string) => {
    const rest = {...filters};
    delete rest[key as keyof typeof rest];
    setFilters(rest);
  };

  const renderModalContent = () => {
    if (!activeFilter) return null;
    const isSortBy = activeFilter === 'sortBy';
    const isType = activeFilter === 'type';

    const data = isSortBy
      ? FILTER_OPTIONS.sortBy
      : FILTER_OPTIONS[activeFilter].map(String);

    return (
      <Animated.View
        style={[
          styles.modalContent,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 0],
                }),
              },
            ],
          },
        ]}>
        <Text style={styles.modalTitle}>
          Select {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
        </Text>

        <FlatList
          data={data}
          keyExtractor={item =>
            isSortBy ? (item as any).value : item.toString()
          }
          renderItem={({item}) => {
            const label = isSortBy ? (item as any).label : item.toString();
            const val = isSortBy ? (item as any).value : item;
            const selected = isSortBy
              ? filters.sortBy === val
              : isType && Array.isArray(filters.type)
              ? filters.type.includes(val)
              : filters[activeFilter] === val;

            return (
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  (isType || isSortBy) && selected
                    ? styles.selectedTypeOption
                    : null,
                ]}
                onPress={() => handleFilterSelect(activeFilter, item)}>
                <Text style={styles.modalOptionText}>{label}</Text>
                {selected && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
          <Text style={styles.modalCloseText}>{isType ? 'Done' : 'Close'}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const sortByLabel =
    FILTER_OPTIONS.sortBy.find(o => o.value === filters.sortBy)?.label ||
    'Sort By';

  return (
    <View style={styles.container}>
      <LocationAutocomplete
        value={
          Array.isArray(filters.location) && filters.location.length > 0
            ? filters.location.join(', ')
            : ''
        }
        onSelect={handleLocationSelect}
        onClear={clearLocation}
      />

      <View style={styles.filterRow}>
        <FilterButton label={sortByLabel} onPress={() => openModal('sortBy')} />
        <FilterButton
          label={filters.bedrooms ? `${filters.bedrooms} bedrooms` : 'bedrooms'}
          onPress={() => openModal('bedrooms')}
        />
        <FilterButton
          label={
            filters.bathrooms ? `${filters.bathrooms} bathrooms` : 'bathrooms'
          }
          onPress={() => openModal('bathrooms')}
        />
        <FilterButton
          label={
            Array.isArray(filters.type) && filters.type.length > 0
              ? filters.type.join(', ')
              : 'Type'
          }
          onPress={() => openModal('type')}
        />
        <FilterButton
          label={filters.status || 'Status'}
          onPress={() => openModal('status')}
        />
      </View>

      <View style={styles.activeFiltersRow}>
        {Object.entries(filters).map(([key, value]) =>
          value &&
          ((Array.isArray(value) && value.length > 0) ||
            (!Array.isArray(value) && value)) ? (
            <View key={key} style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>{`${
                key.charAt(0).toUpperCase() + key.slice(1)
              }: ${
                Array.isArray(value) ? value.join(', ') : value?.value || value
              }`}</Text>
              <TouchableOpacity onPress={() => handleClearFilter(key)}>
                <Text style={styles.activeFilterClear}>×</Text>
              </TouchableOpacity>
            </View>
          ) : null,
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>{renderModalContent()}</View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 12,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  filterButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 2,
  },
  filterButtonText: {
    color: '#334155',
    fontSize: 14,
  },
  activeFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ef',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  activeFilterText: {
    color: '#334155',
    fontSize: 13,
    marginRight: 4,
  },
  activeFilterClear: {
    color: '#ef4444',
    fontSize: 20,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    minHeight: 200,
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#334155',
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#334155',
  },
  modalClose: {
    marginTop: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedTypeOption: {
    backgroundColor: '#d1fae5',
  },
  checkmark: {
    color: '#059669',
    marginLeft: 8,
  },
});

export default PropertyFilterBar;
