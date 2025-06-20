import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {useForm, Controller, FormProvider} from 'react-hook-form';
import LocationAutocomplete from '../components/Properties/LocationAutocomplete';
import MultiTagInput from '../components/Reusables/Inputs/MultiTagInput';
import FileUpload from '../components/Reusables/FileUpload';
import {useCommonData} from '../context/CommonDataContext';
import {AddPropertyFormValues} from '../types/addPropertyTypes';
import {translateText, detectLanguage} from '../utils/translation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {uploadImagesCall} from '../utils/cloudinary';
import {useMutation} from '@tanstack/react-query';
import {createPropertyMutation} from '../utils/apiCalls';
import {useNavigation} from '@react-navigation/native';
import {useUser} from '../context/UserContext';

const AddPropertyScreen = () => {
  const {propertyTypes} = useCommonData();
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useUser();

  const methods = useForm<AddPropertyFormValues>({
    defaultValues: {
      locations: null,
      type: null,
      status: null, // Added status default
      price: null,
      bedrooms: null,
      bathrooms: null,
      area: null,
      amenities: [],
      description: '',
      images: [],
    },
  });

  const navigation = useNavigation();

  const {mutate: createProperty} = useMutation({
    mutationFn: createPropertyMutation,
    onSuccess: () => {
      console.log('success triggered');
      navigation.reset({index: 0, routes: [{name: 'Property' as never}]});
      methods.reset();
    },
    onError: () => {
      console.log('error triggered');
    },
  });

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
    console.log({data});

    if (!data.locations) {
      console.log('Location is required [step1]');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Loading started [step2]');
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
        userId: user?._id,
        title: '',
        titleArabic: '',
        description: '',
        descriptionArabic: '',
        images: [],
      };
      console.log('Initialized dataToSend [step3]');

      if (isArabicDigits(String(data.price))) {
        dataToSend.priceArabic = data.price;
        dataToSend.price = convertArabicDigitsToLatin(String(data.price));
      } else {
        dataToSend.price = data.price;
        dataToSend.priceArabic = convertLatinDigitsToArabic(String(data.price));
      }
      console.log('Processed price fields [step4]');

      if (isArabicDigits(String(data.area))) {
        dataToSend.sizeArabic = data.area;
        dataToSend.size = convertArabicDigitsToLatin(String(data.area));
      } else {
        dataToSend.size = data.area;
        dataToSend.sizeArabic = convertLatinDigitsToArabic(String(data.area));
      }
      console.log('Processed area fields [step5]');

      if (isArabicDigits(String(data.bedrooms))) {
        dataToSend.bedroomsArabic = data.bedrooms;
        dataToSend.bedrooms = convertArabicDigitsToLatin(String(data.bedrooms));
      } else {
        dataToSend.bedrooms = data.bedrooms;
        dataToSend.bedroomsArabic = convertLatinDigitsToArabic(
          String(data.bedrooms),
        );
      }
      console.log('Processed bedrooms fields [step6]');

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
      console.log('Processed bathrooms fields [step7]');

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
      console.log('Processed description fields [step8]');

      if (data.images?.length) {
        dataToSend.images = await uploadImagesCall(data.images);
        console.log('Uploaded images [step9]');
      }

      createProperty(dataToSend);
      console.log(
        'Property submitted! (API call not implemented) [step10]',
        dataToSend,
      );
    } catch (err) {
      console.error('Error occurred [step11]', {err});
    } finally {
      setIsLoading(false);
      console.log('Loading finished [step12]');
    }
  };

  return (
    <FormProvider {...methods}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Text style={styles.title}>Add Property</Text>
            <Text style={styles.label}>Location</Text>

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

            {/* Status Chips */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.chipContainer}>
                {['sale', 'rent'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.chip,
                      methods.watch('status') === option &&
                        styles.chipSelectedGradient,
                    ]}
                    onPress={() =>
                      methods.setValue('status', option as 'sale' | 'rent')
                    }>
                    <Text
                      style={[
                        styles.chipText,
                        methods.watch('status') === option &&
                          styles.chipTextSelected,
                      ]}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Type Chips */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type</Text>
              <View style={styles.chipContainer}>
                {propertyTypes &&
                  Array.isArray(propertyTypes) &&
                  propertyTypes.map(type => (
                    <TouchableOpacity
                      key={String(type)}
                      style={[
                        styles.chip,
                        methods.watch('type') === String(type) &&
                          styles.chipSelectedGradient,
                      ]}
                      onPress={() => methods.setValue('type', String(type))}>
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
            </View>

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

            {/* Simple Description Text Input */}
            <Controller
              control={methods.control}
              name="description"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.descriptionInput]}
                    multiline
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter description"
                  />
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </View>
              )}
            />

            <MultiTagInput
              name="amenities"
              label="Amenities"
              placeholder="Add amenity"
            />

            <FileUpload
              name="images"
              label="Property Images"
              placeholder="Select property images"
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
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#fff',
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
    minHeight: 40, // default minHeight
  },
  descriptionInput: {
    minHeight: 60,
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
    marginBottom: 4,
    marginTop: 4,
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
  chipSelectedGradient: {
    // Simulate emerald-500 to 700 gradient using a solid color (React Native doesn't support gradients in StyleSheet)
    backgroundColor: '#047857', // emerald-700
    borderColor: '#059669', // emerald-500
  },
  chipText: {
    color: '#334155',
    fontSize: 15,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
});

export default AddPropertyScreen;
