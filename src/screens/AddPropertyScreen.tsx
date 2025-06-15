import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import {useForm, Controller, FormProvider} from 'react-hook-form';
import LocationAutocomplete from '../components/Properties/LocationAutocomplete';
import MultiTagInput from '../components/Reusables/Inputs/MultiTagInput';
import FileUpload from '../components/Reusables/FileUpload';
import {useCommonData} from '../context/CommonDataContext';
import {AddPropertyFormValues} from '../types/addPropertyTypes';
import axiosInstance from '../api/axiosConfig';
import {translateText, detectLanguage} from '../utils/translation';

const AddPropertyScreen = () => {
  const {propertyTypes} = useCommonData();
  const [isLoading, setIsLoading] = useState(false);
  const [isTypePickerVisible, setTypePickerVisible] = useState(false);

  const methods = useForm<AddPropertyFormValues>({
    defaultValues: {
      locations: null,
      type: null,
      price: null,
      bedrooms: null,
      bathrooms: null,
      area: null,
      amenities: [],
      description: '',
      images: [],
    },
  });

  const uploadImage = async (file: any) => {
    const folder = 'uploads';
    if (!file) throw new Error('No file provided for upload.');

    const fileNameWithoutExt = file.split('/').pop().split('.')[0];
    const publicId = `${folder}/${fileNameWithoutExt}`;
    const signatureRes = await axiosInstance.post(
      '/upload/generate-signature',
      {
        folder,
        public_id: publicId,
      },
    );
    const {signature, timestamp, apiKey, cloudName} = signatureRes.data;
    const formData = new FormData();
    formData.append('file', {
      uri: file,
      type: 'image/jpeg',
      name: file.split('/').pop(),
    });
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', folder);
    formData.append('public_id', publicId);
    formData.append('signature', signature);
    const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const uploadRes = await axiosInstance.post(cloudinaryUploadUrl, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return uploadRes.data.secure_url;
  };

  const uploadImagesCall = async (images: any) => {
    const urls = [];
    for (const img of images) {
      const url = await uploadImage(img);
      urls.push(url);
    }
    return urls;
  };

  const ARABIC_TO_LATIN: Record<string, string> = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
  };
  const LATIN_TO_ARABIC: Record<string, string> = Object.entries(
    ARABIC_TO_LATIN,
  ).reduce((acc, [a, l]) => {
    acc[l] = a;
    return acc;
  }, {} as Record<string, string>);
  const convertArabicDigitsToLatin = (str: string) =>
    str.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, d => ARABIC_TO_LATIN[d] || d);
  const convertLatinDigitsToArabic = (str: string) =>
    str.replace(/\d/g, d => LATIN_TO_ARABIC[d] || d);
  const isArabicDigits = (str: string) =>
    /[\u0660-\u0669\u06F0-\u06F9]/.test(str);

  const onSubmit = async (data: any) => {
    if (!data.locations) {
      console.log('Location is required');
      return;
    }
    try {
      setIsLoading(true);
      const dataToSend: any = {
        status: data.status || '',
        price: '',
        priceArabic: '',
        bedrooms: '',
        bedroomsArabic: '',
        bathrooms: '',
        bathroomsArabic: '',
        location: data.locations,
        size: '',
        sizeArabic: '',
        type: data.type || '',
        amenities: data.amenities || [],
        userId: '',
        title: '',
        titleArabic: '',
        description: '',
        descriptionArabic: '',
        images: [],
      };

      if (isArabicDigits(String(data.price))) {
        dataToSend.priceArabic = data.price;
        dataToSend.price = convertArabicDigitsToLatin(String(data.price));
      } else {
        dataToSend.price = data.price;
        dataToSend.priceArabic = convertLatinDigitsToArabic(String(data.price));
      }

      if (isArabicDigits(String(data.area))) {
        dataToSend.sizeArabic = data.area;
        dataToSend.size = convertArabicDigitsToLatin(String(data.area));
      } else {
        dataToSend.size = data.area;
        dataToSend.sizeArabic = convertLatinDigitsToArabic(String(data.area));
      }

      if (isArabicDigits(String(data.bedrooms))) {
        dataToSend.bedroomsArabic = data.bedrooms;
        dataToSend.bedrooms = convertArabicDigitsToLatin(String(data.bedrooms));
      } else {
        dataToSend.bedrooms = data.bedrooms;
        dataToSend.bedroomsArabic = convertLatinDigitsToArabic(
          String(data.bedrooms),
        );
      }

      if (isArabicDigits(String(data.bathrooms))) {
        dataToSend.bathroomsArabic = data.bathrooms;
        dataToSend.bathrooms = convertArabicDigitsToLatin(
          String(data.bathrooms),
        );
      } else {
        dataToSend.bathrooms = data.bathrooms;
        dataToSend.bathroomsArabic = convertLatinDigitsToArabic(
          String(data.bathrooms),
        );
      }

      const originalLang = detectLanguage(data.description);
      if (originalLang === 'ar') {
        dataToSend.descriptionArabic = data.description;
        dataToSend.description =
          (await translateText(data.description, 'en')) || data.description;
      } else {
        dataToSend.description = data.description;
        dataToSend.descriptionArabic =
          (await translateText(data.description, 'ar')) || data.description;
      }

      if (data.images?.length) {
        dataToSend.images = await uploadImagesCall(data.images);
      }

      console.log('Property submitted! (API call not implemented)', dataToSend);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1, backgroundColor: '#fff'}}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Add Property</Text>

            <Controller
              control={methods.control}
              name="locations"
              render={({field: {value}}) => (
                <LocationAutocomplete
                  value={value ? `${value.city}, ${value.country}` : ''}
                  onSelect={loc => methods.setValue('locations', loc)}
                  onClear={() => methods.setValue('locations', null)}
                />
              )}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setTypePickerVisible(true)}>
                <Text>{methods.watch('type') || 'Select type'}</Text>
              </TouchableOpacity>
            </View>

            <Modal
              visible={isTypePickerVisible}
              transparent
              animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={[styles.label, {marginBottom: 12}]}>
                    Select Property Type
                  </Text>
                  <View style={styles.chipContainer}>
                    {propertyTypes &&
                      Array.isArray(propertyTypes) &&
                      propertyTypes.map(type => (
                        <TouchableOpacity
                          key={String(type)}
                          style={[
                            styles.chip,
                            methods.watch('type') === String(type) &&
                              styles.chipSelected,
                          ]}
                          onPress={() => {
                            methods.setValue('type', String(type));
                            setTypePickerVisible(false);
                          }}>
                          <Text
                            style={[
                              styles.chipText,
                              methods.watch('type') === String(type) &&
                                styles.chipTextSelected,
                            ]}>
                            {String(type)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                  <Pressable
                    onPress={() => setTypePickerVisible(false)}
                    style={styles.modalClose}>
                    <Text style={{color: 'white'}}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            {['price', 'bedrooms', 'bathrooms', 'area'].map(field => (
              <Controller
                key={field}
                control={methods.control}
                name={field as keyof AddPropertyFormValues}
                render={({field: {onChange, value}}) => (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={value ? String(value) : ''}
                      onChangeText={text => onChange(Number(text))}
                      placeholder={`Enter ${field}`}
                    />
                  </View>
                )}
              />
            ))}

            <FileUpload
              name="images"
              label="Property Images"
              placeholder="Select property images"
            />

            <MultiTagInput
              name="amenities"
              label="Amenities"
              placeholder="Add amenity"
            />

            <TouchableOpacity
              style={[styles.button, isLoading ? styles.buttonDisabled : null]}
              onPress={methods.handleSubmit(onSubmit)}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 80,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#334155',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f1f5f9',
  },
  button: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalClose: {
    backgroundColor: '#059669',
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'flex-start',
  },
  chip: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  chipSelected: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  chipText: {
    color: '#334155',
    fontSize: 15,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddPropertyScreen;
