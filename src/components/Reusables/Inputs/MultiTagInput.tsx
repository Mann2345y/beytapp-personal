import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useFormContext, useController} from 'react-hook-form';

interface MultiTagInputProps {
  name: string;
  label?: string;
  placeholder?: string;
}

const MultiTagInput: React.FC<MultiTagInputProps> = ({
  name,
  label,
  placeholder,
}) => {
  const {control} = useFormContext();
  const {
    field: {onChange, value = []},
    fieldState: {error},
  } = useController({name, control});
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim() && !value.includes(input.trim())) {
      onChange([...value, input.trim()]);
      setInput('');
    }
  };

  const handleRemove = (tag: string) => {
    onChange(value.filter((t: string) => t !== tag));
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={placeholder || 'Enter tag'}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}>
        <View style={styles.chipContainer}>
          {value.map((tag: string) => (
            <View key={tag} style={styles.chip}>
              <Text style={styles.chipText}>{tag}</Text>
              <TouchableOpacity onPress={() => handleRemove(tag)}>
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: 16},
  label: {fontSize: 15, color: '#334155', marginBottom: 4},
  inputRow: {flexDirection: 'row', alignItems: 'center'},
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#f1f5f9',
  },
  addButton: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  addButtonText: {color: '#fff', fontWeight: 'bold'},
  chipScroll: {marginTop: 8},
  chipContainer: {flexDirection: 'row', flexWrap: 'wrap'},
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ef',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  chipText: {color: '#334155', fontSize: 14, marginRight: 4},
  removeText: {color: '#ef4444', fontSize: 18, marginLeft: 4},
  errorText: {color: '#dc2626', fontSize: 13, marginTop: 4},
});

export default MultiTagInput;
