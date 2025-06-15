import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {changeLanguage} from '../../utils/changeLanguage';

const LANGUAGES = [
  {code: 'en', label: 'English'},
  {code: 'ar', label: 'العربية'},
];

const LanguageSwitchDropdown = ({style}: {style?: any}) => {
  const {i18n} = useTranslation();
  const currentLang = i18n.language;
  const isEnglish = currentLang === 'en';
  // Button text: show in target language
  const buttonText = isEnglish ? 'التبديل إلى العربية' : 'Switch to English';
  const targetLang = isEnglish ? 'ar' : 'en';

  const handleChange = async () => {
    await changeLanguage(targetLang);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={handleChange} style={styles.button}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {position: 'relative', zIndex: 100, maxWidth: 180},
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  buttonText: {fontSize: 14, color: '#334155', textAlign: 'center'},
});

export default LanguageSwitchDropdown;
