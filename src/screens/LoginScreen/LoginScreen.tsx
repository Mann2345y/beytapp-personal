// AuthScreen.tsx
import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import GoogleLoginButton from '../../components/Reusables/Buttons/GoogleButton';
import api from '../../api/axiosConfig';
import {useUser} from '../../context/UserContext';

const CHECK_USER_EXISTS = '/users/user-exist';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
};

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const [hasUserProceeded, setHasUserProceeded] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const {loginUser} = useUser();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {errors},
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phoneNumber: '',
    },
  });

  const email = watch('email');
  const password = watch('password');

  // Step 2: Check account existence
  const onCheckExist = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }
    try {
      const {data} = await api.get(CHECK_USER_EXISTS, {
        params: {email},
      });
      setUserExist(data.exists);
      setHasUserProceeded(true);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    }
  };

  // Step 3A: Login
  const onLogin = async (form: FormData) => {
    try {
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });
      loginUser(res);
      Alert.alert('Success', 'Logged in!');
      navigation.reset({index: 0, routes: [{name: 'Property'}]});
    } catch (err: any) {
      Alert.alert('Login failed', err.response?.data?.error || err.message);
    }
  };

  // Step 3B: Sign up
  const onSignup = async (form: FormData) => {
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      const res = await api.post('/auth/signup', {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
      });
      loginUser(res);

      Alert.alert('Success', 'Account created!');
      navigation.reset({index: 0, routes: [{name: 'Property'}]});
    } catch (err: any) {
      Alert.alert('Signup failed', err.response?.data?.message || err.message);
    }
  };

  // Reset to step 1
  const goBack = () => {
    setHasUserProceeded(false);
    setUserExist(false);
    setValue('password', '');
    setValue('confirmPassword', '');
    setValue('name', '');
    setValue('phoneNumber', '');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {!hasUserProceeded ? (
          <View style={styles.step1}>
            <GoogleLoginButton />

            <Text style={styles.orText}>— OR —</Text>

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email',
                },
              }}
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}

            <TouchableOpacity style={styles.primaryBtn} onPress={onCheckExist}>
              <Text style={styles.primaryText}>Continue with Email</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.step2}>
            <TouchableOpacity onPress={goBack} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            {userExist ? (
              <View style={styles.inner}>
                <Text style={styles.heading}>Login to your account</Text>
                <Text style={styles.disabledEmail}>{email}</Text>

                <Controller
                  control={control}
                  name="password"
                  rules={{required: 'Password required'}}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      secureTextEntry
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.password && (
                  <Text style={styles.error}>{errors.password.message}</Text>
                )}

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.linkText}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleSubmit(onLogin)}>
                  <Text style={styles.primaryText}>Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inner}>
                <Text style={styles.heading}>Create a new account</Text>
                <Text style={styles.disabledEmail}>{email}</Text>

                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: 'Password required',
                    minLength: {
                      value: 6,
                      message: 'Min 6 characters',
                    },
                  }}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      secureTextEntry
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.password && (
                  <Text style={styles.error}>{errors.password.message}</Text>
                )}

                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: 'Confirm your password',
                    validate: v => v === password || 'Passwords must match',
                  }}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      secureTextEntry
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <Text style={styles.error}>
                    {errors.confirmPassword.message}
                  </Text>
                )}

                <Controller
                  control={control}
                  name="name"
                  rules={{required: 'Name required'}}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Your Name"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.name && (
                  <Text style={styles.error}>{errors.name.message}</Text>
                )}

                <Controller
                  control={control}
                  name="phoneNumber"
                  rules={{required: 'Phone number required'}}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Phone Number"
                      keyboardType="phone-pad"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.phoneNumber && (
                  <Text style={styles.error}>{errors.phoneNumber.message}</Text>
                )}

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleSubmit(onSignup)}>
                  <Text style={styles.primaryText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#fff'},
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  step1: {alignItems: 'stretch'},
  googleBtn: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 6,
    marginBottom: 24,
  },
  googleText: {color: '#fff', textAlign: 'center'},
  orText: {textAlign: 'center', marginVertical: 12, color: '#666'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginVertical: 6,
  },
  error: {color: 'red', marginBottom: 6},
  primaryBtn: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  primaryText: {color: '#fff', textAlign: 'center'},
  step2: {},
  backBtn: {marginBottom: 16},
  backText: {color: '#444'},
  inner: {alignItems: 'stretch'},
  heading: {fontSize: 20, marginBottom: 12, textAlign: 'center'},
  disabledEmail: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#888',
  },
  linkText: {color: '#007BFF', textAlign: 'right', marginBottom: 12},
});

export default LoginScreen;
