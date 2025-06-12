import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const LANGUAGES = [
  {code: 'en', label: 'English'},
  {code: 'ar', label: 'العربية'},
];

const LanguageSwitchDropdown = ({style}: {style?: any}) => {
  const {i18n, t} = useTranslation();
  const [open, setOpen] = React.useState(false);

  const handleChange = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={() => setOpen(!open)} style={styles.button}>
        <Text style={styles.buttonText}>
          {t('language') || i18n.language.toUpperCase()}
        </Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          {LANGUAGES.map(lng => (
            <TouchableOpacity
              key={lng.code}
              onPress={() => handleChange(lng.code)}
              style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>{lng.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {position: 'relative', zIndex: 100},
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  buttonText: {fontSize: 14, color: '#334155'},
  dropdown: {
    position: 'absolute',
    top: 38,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 100,
  },
  dropdownItem: {padding: 10},
  dropdownText: {fontSize: 14, color: '#334155'},
});

export default LanguageSwitchDropdown;
