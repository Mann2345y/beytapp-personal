import React from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useController, useFormContext} from 'react-hook-form';

// Dummy country codes for dropdown
const COUNTRY_CODES = [
  {label: '+965', value: '+965'},
  {label: '+91', value: '+91'},
];

interface PhoneNumberInputProps {
  name: string; // for phone number input
  label?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({name, label}) => {
  const {control} = useFormContext();
  const {
    field: {onChange: onPhoneChange, onBlur: onPhoneBlur, value: phoneValue},
    fieldState: {error: phoneError},
  } = useController({name, control});
  const {
    field: {onChange: onCodeChange, value: codeValue},
    fieldState: {error: codeError},
  } = useController({name: 'selectedCountryCode', control});

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        <View style={styles.codeBox}>
          <Picker
            selectedValue={codeValue || COUNTRY_CODES[0].value}
            style={styles.picker}
            onValueChange={onCodeChange}
            dropdownIconColor="#334155"
            mode="dropdown">
            {COUNTRY_CODES.map(c => (
              <Picker.Item
                key={c.value}
                label={c.label}
                value={c.value}
                color="#334155"
              />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={phoneValue}
          onChangeText={onPhoneChange}
          onBlur={onPhoneBlur}
          placeholder="Phone number"
        />
      </View>
      {(phoneError || codeError) && (
        <Text style={styles.errorText}>
          {phoneError?.message || codeError?.message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeBox: {
    width: 120,
    height: 60,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    paddingLeft: 4, // for slight spacing inside box
  },
  picker: {
    width: '100%',
    height: 60,
    color: '#334155',
    fontSize: 15,
  },
  input: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: '#f1f5f9',
  },
  errorText: {
    color: '#dc2626',
    marginTop: 4,
    fontSize: 13,
  },
});

export default PhoneNumberInput;
