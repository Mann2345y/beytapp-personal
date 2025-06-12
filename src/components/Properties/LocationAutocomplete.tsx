import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import api from '../../api/axiosConfig';
import {ROUTES} from '../../constants/routes';

interface LocationAutocompleteProps {
  value: string;
  onSelect: (loc: {city: string; country: string}) => void;
  onClear: () => void;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onSelect,
  onClear,
}) => {
  const [search, setSearch] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
  const inputRef = useRef<TextInput>(null);

  const {data} = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await api.get(ROUTES.LOCATIONS);
      return res.data || [];
    },
  });

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    if (search.length > 0 && data && data.length > 0) {
      const filtered = data.filter(
        (loc: any) =>
          loc.city?.toLowerCase().includes(search.toLowerCase()) ||
          loc.country?.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredLocations(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
    }
  }, [search, data]);

  const handleChange = (text: string) => {
    setSearch(text);
  };

  const handleSelect = (loc: any) => {
    onSelect(loc);
    setShowDropdown(false);
    setSearch(`${loc.city}, ${loc.country}`);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSearch('');
    onClear();
    setShowDropdown(false);
  };

  return (
    <View style={{position: 'relative'}}>
      <View style={styles.searchBarContainer}>
        <TextInput
          ref={inputRef}
          style={styles.searchBar}
          placeholder="Search by location..."
          value={search}
          onChangeText={handleChange}
          onFocus={() => {
            if (search.length > 0 && filteredLocations.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        {search.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
      {showDropdown && (
        <View style={styles.dropdown}>
          {filteredLocations.map((loc, idx) => (
            <TouchableOpacity
              key={loc.city + loc.country + idx}
              style={styles.dropdownItem}
              onPress={() => handleSelect(loc)}>
              <Text style={styles.dropdownItemText}>
                {loc.city}, {loc.country}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 18,
    color: '#64748b',
  },
  dropdown: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    zIndex: 10,
    maxHeight: 180,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#334155',
  },
});

export default LocationAutocomplete;
