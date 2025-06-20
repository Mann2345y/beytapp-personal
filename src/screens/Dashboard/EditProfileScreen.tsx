import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {useForm, FormProvider, Controller, useWatch} from 'react-hook-form';
import {useUser} from '../../context/UserContext';
import PhoneNumberInput from '../../components/Reusables/Inputs/PhoneNumberInput';
import api from '../../api/axiosConfig';
import {uploadImage} from '../../utils/cloudinary';
import {pickImageFromLibrary} from '../../utils/pickImage';
import EditImageIcon from '../../assets/images/edit-image-icon.svg';

const extractCountryCodeAndNumber = (phone: string) => {
  if (!phone) {
    return {selectedCountryCode: '+965', phoneNumber: ''};
  }

  const match = phone.match(/^(\+\d{1,4})\s*(.*)$/);

  if (match) {
    return {
      selectedCountryCode: match[1],
      phoneNumber: match[2],
    };
  }
  return {selectedCountryCode: '+965', phoneNumber: phone};
};

const EditProfileScreen = () => {
  const {user} = useUser();
  const [hasChanged, setHasChanged] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(user?.image);
  const initialPhone = extractCountryCodeAndNumber(user?.phoneNumber || '');

  const methods = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: initialPhone.phoneNumber,
      selectedCountryCode: initialPhone.selectedCountryCode,
      image: user?.image ? [user.image] : [],
    },
  });
  const formValues = useWatch({control: methods.control});

  useEffect(() => {
    if (user) {
      const resetPhone = extractCountryCodeAndNumber(user.phoneNumber || '');
      methods.reset({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: resetPhone.phoneNumber,
        selectedCountryCode: resetPhone.selectedCountryCode,
        image: user.image ? user.image : '',
      });
    }
  }, [user, methods]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const changed =
      formValues.name !== user.name ||
      formValues.email !== user.email ||
      formValues.phoneNumber !== user.phoneNumber ||
      (user.image ? [user.image] : []).toString() !==
        (formValues.image || []).toString();
    setHasChanged(changed);
  }, [formValues, user, methods]);

  const onSubmit = async (data: any) => {
    if (!user) {
      return;
    }

    try {
      let imageUrl = user.image;
      if (data.image && !data.image.startsWith('https')) {
        imageUrl = await uploadImage(data.image[0]);
      }
      const payload = {
        name: data.name,
        email: data.email,
        phoneNumber: `${data.selectedCountryCode} ${data.phoneNumber}`,
        selectedCountryCode: data.selectedCountryCode,
        image: imageUrl,
      };
      await api.put(`/users/${user._id}`, payload);
      setHasChanged(false);
    } catch (err: any) {
      console.log('Error updating user:', {err});
    }
  };

  const handlePickImage = async () => {
    try {
      const uri = await pickImageFromLibrary();
      if (typeof uri === 'string' && uri) {
        setUserImage(uri);
        methods.setValue('image', [uri]);
        setHasChanged(true);
      }
    } catch (e) {
      // Optionally handle error (e.g., show a toast)
    }
  };

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        {/* Avatar with pencil icon overlay for editing */}
        <View style={{alignItems: 'center', marginVertical: 24}}>
          <TouchableOpacity
            onPress={handlePickImage}
            style={{position: 'relative'}}>
            <Image
              source={
                userImage
                  ? {uri: userImage}
                  : require('../../assets/images/agent1.jpg')
              }
              style={styles.avatar}
            />
            <View style={styles.editIconContainer}>
              <EditImageIcon width={24} height={24} fill={'000'} />
            </View>
          </TouchableOpacity>
        </View>
        <Controller
          name="name"
          control={methods.control}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Name"
              />
            </View>
          )}
        />
        <Controller
          name="email"
          control={methods.control}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          )}
        />
        <PhoneNumberInput name="phoneNumber" label="Phone Number" />
        <TouchableOpacity
          style={[styles.button, !hasChanged && styles.buttonDisabled]}
          onPress={methods.handleSubmit(onSubmit)}
          disabled={!hasChanged}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e5e7eb',
  },
  avatarPlaceholderSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e5e7eb',
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#334155',
    marginBottom: 4,
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f1f5f9',
  },
  buttonWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
});

export default EditProfileScreen;
