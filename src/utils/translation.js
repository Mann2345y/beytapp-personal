import axios from 'axios';

const API_KEY = 'AIzaSyDQwhB6RC-DFnnpU83MKltoLgAMych0EBg';

export async function translateText(text, targetLanguage) {
  try {
    const url = 'https://translation.googleapis.com/language/translate/v2';
    const response = await axios.post(url, null, {
      params: {
        q: text,
        target: targetLanguage,
        key: API_KEY,
      },
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return null;
  }
}

export function detectLanguage(text) {
  // Simple language detection based on character ranges
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text) ? 'ar' : 'en';
}
