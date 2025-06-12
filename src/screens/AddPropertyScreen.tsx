import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

// Dummy functions and constants for imports
const useSession = () => ({
  data: {user: {id: 1, phoneNumber: '123456789'}},
});

const signIn = () => {};
const useForm = () => ({
  control: {},
  handleSubmit: (fn: any) => fn,
  reset: () => {},
  setValue: () => {},
});
const useWatch = ({name, control}: any) => 'sale';
const useMutation = () => ({
  mutate: () => {},
  mutateAsync: async () => {},
  onSuccess: () => {},
  onError: () => {},
});
const uploadImage = async () => '';
const createPropertyMutation = async () => {};
const useTranslations = () => (key: string) => key;
const useParams = () => ({locale: 'en'});
const useRouter = () => ({push: (url: string) => {}});
const PROPERTY_TYPES = ['Apartment', 'Villa', 'Land', 'Office'];
const arValues = {createPropertyPage: {}, propertyTypes: {}, locations: {}};
const enValues = {createPropertyPage: {}, propertyTypes: {}, locations: {}};
const toast = {
  error: () => {},
  success: () => {},
  loading: () => {},
  dismiss: () => {},
};
const translateText = async (text: string, lang: string) => text;
const detectLanguage = (text: string) => 'en';

const AddPropertyScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('sale');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [area, setArea] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  // Dummy translation
  const translate = (key: string) => key;
  const propertyTypeTranslations = (key: string) => key;

  // Dummy session
  const session = {user: {id: 1, phoneNumber: '123456789'}};
  const router = {push: (url: string) => {}};
  const locale = 'en';

  const handleAddProperty = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simulate navigation
      router.push(`/${locale}/properties`);
    }, 1500);
  };

  if (!session) {
    return (
      <View style={styles.centered}>
        <Text>{translate('loginMessageText')}</Text>
      </View>
    );
  } else if (!session.user?.phoneNumber) {
    return (
      <View style={styles.centered}>
        <Text>{translate('incompleteProfileError')}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formBox}>
        <View style={styles.statusRow}>
          {['sale', 'rent'].map(s => (
            <TouchableOpacity
              key={s}
              style={[
                styles.statusButton,
                status === s && styles.statusButtonActive,
              ]}
              onPress={() => setStatus(s)}>
              <Text
                style={
                  status === s ? styles.statusTextActive : styles.statusText
                }>
                {translate(s)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* PROPERTY TYPE */}
        <Text style={styles.label}>{translate('type')}</Text>
        <View style={styles.dropdownBox}>
          {PROPERTY_TYPES.map(el => (
            <TouchableOpacity
              key={el}
              style={[
                styles.dropdownItem,
                type === el && styles.dropdownItemActive,
              ]}
              onPress={() => setType(el)}>
              <Text
                style={
                  type === el ? styles.dropdownTextActive : styles.dropdownText
                }>
                {propertyTypeTranslations(el.toLowerCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* PRICE */}
        <Text style={styles.label}>{translate('price')}</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder={translate('enterPrice')}
          keyboardType="numeric"
        />
        {/* LOCATION */}
        <Text style={styles.label}>{translate('location')}</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder={translate('enterLocation')}
        />
        {/* BEDROOMS */}
        <Text style={styles.label}>{translate('bedrooms')}</Text>
        <TextInput
          style={styles.input}
          value={beds}
          onChangeText={setBeds}
          placeholder={translate('enterNumberOfBeds')}
          keyboardType="numeric"
        />
        {/* BATHROOMS */}
        <Text style={styles.label}>{translate('bathrooms')}</Text>
        <TextInput
          style={styles.input}
          value={baths}
          onChangeText={setBaths}
          placeholder={translate('enterNumberOfBaths')}
          keyboardType="numeric"
        />
        {/* AREA */}
        <Text style={styles.label}>{translate('area')}</Text>
        <TextInput
          style={styles.input}
          value={area}
          onChangeText={setArea}
          placeholder={translate('enterPropertyArea')}
          keyboardType="numeric"
        />
        {/* AMENITIES */}
        <Text style={styles.label}>{translate('amenities')}</Text>
        <TextInput
          style={styles.input}
          value={amenities.join(', ')}
          onChangeText={text =>
            setAmenities(text.split(',').map(t => t.trim()))
          }
          placeholder={translate('enterAmenities')}
        />
        {/* DESCRIPTION */}
        <Text style={styles.label}>{translate('description')}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder={translate('enterDescription')}
          multiline
        />
        {/* IMAGES (placeholder) */}
        <Text style={styles.label}>{translate('images')}</Text>
        <Text style={styles.imagePlaceholder}>
          [Image upload not implemented]
        </Text>
        {/* SUBMIT */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAddProperty}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {translate('addProperty')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9fafb',
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  label: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#f1f5f9',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#059669',
  },
  statusText: {
    color: '#334155',
    fontWeight: 'bold',
  },
  statusTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdownBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  dropdownItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    margin: 2,
  },
  dropdownItemActive: {
    backgroundColor: '#059669',
  },
  dropdownText: {
    color: '#334155',
  },
  dropdownTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePlaceholder: {
    color: '#888',
    marginBottom: 12,
  },
  textArea: {
    height: 80,
  },
});

export default AddPropertyScreen;
