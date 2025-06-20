import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  I18nManager,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import api from '../../api/axiosConfig';
import PhoneNumberInput from '../Reusables/Inputs/PhoneNumberInput';
import {useUser} from '../../context/UserContext';
import GoogleSignInButton from '../Reusables/Buttons/GoogleButton';
import {ROUTES} from '../../constants/routes';
import LanguageSwitchDropdown from '../Reusables/LanguageSwitchDropdown';
import {SafeAreaView} from 'react-native-safe-area-context';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
  selectedCountryCode: string;
};

interface AuthFormScreenProps {
  setShowForgot: (show: boolean) => void;
}

const AuthFormScreen: React.FC<AuthFormScreenProps> = ({setShowForgot}) => {
  const {t} = useTranslation();
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
      selectedCountryCode: '+965',
    },
  });

  const email = watch('email');
  const password = watch('password');

  const onCheckExist = async () => {
    if (!email) {
      return;
    }
    try {
      const {data} = await api.get(ROUTES.CHECK_USER_EXISTS, {params: {email}});
      setUserExist(data.exists);
      setHasUserProceeded(true);
    } catch (err: any) {}
  };

  const onLogin = async (form: FormData) => {
    try {
      const res = await api.post(ROUTES.AUTH_LOGIN, {
        email: form.email,
        password: form.password,
      });
      const {token} = res.data;
      if (token) {
        await loginUser({token});
        navigation.reset({index: 0, routes: [{name: 'Property' as never}]});
      } else {
        throw new Error('No session token returned');
      }
    } catch (err: any) {}
  };

  const onSignup = async (form: FormData) => {
    if (form.password !== form.confirmPassword) {
      return;
    }
    try {
      const phone = `${form.selectedCountryCode} ${form.phoneNumber}`;
      const res = await api.post(ROUTES.AUTH_SIGNUP, {
        name: form.name,
        email: form.email,
        phoneNumber: phone,
        password: form.password,
      });
      const {token} = res.data;
      if (token) {
        await loginUser({token});
        navigation.reset({index: 0, routes: [{name: 'Property' as never}]});
      } else {
        throw new Error('No session token returned');
      }
    } catch (err: any) {}
  };

  const goBack = () => {
    setHasUserProceeded(false);
    setUserExist(false);
    setValue('password', '');
    setValue('confirmPassword', '');
    setValue('name', '');
    setValue('phoneNumber', '');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.languageSwitcherWrapper}>
        <LanguageSwitchDropdown />
      </View>{' '}
      <ScrollView contentContainerStyle={styles.container}>
        {!hasUserProceeded ? (
          <View style={styles.step1}>
            <GoogleSignInButton />
            <Text style={styles.orText}>{t('login.or')}</Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: t('login.email') + ' ' + t('isRequired'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('login.email') + ' ' + t('isInvalid'),
                },
              }}
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder={t('login.email')}
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
              <Text style={styles.primaryText}>
                {t('login.continueWithEmail')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ---------- STEP 2 ---------- */
          <View style={styles.step2}>
            <TouchableOpacity onPress={goBack} style={styles.backBtn}>
              <Text style={styles.backText}>{t('login.back')}</Text>
            </TouchableOpacity>
            {/* ------------ EXISTING USER ------------ */}
            {userExist ? (
              <View style={styles.inner}>
                <Text style={styles.heading}>
                  {t('login.loginToYourAccount')}
                </Text>
                <Text style={styles.disabledEmail}>{email}</Text>
                {/* password */}
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: t('login.password') + ' ' + t('isRequired'),
                  }}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder={t('login.password')}
                      secureTextEntry
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.password && (
                  <Text style={styles.error}>{errors.password.message}</Text>
                )}
                <TouchableOpacity onPress={() => setShowForgot(true)}>
                  <Text style={styles.linkText}>
                    {t('login.forgotPassword')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleSubmit(onLogin)}>
                  <Text style={styles.primaryText}>{t('login.login')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* ------------ NEW USER ------------ */
              <View style={styles.inner}>
                <Text style={styles.heading}>{t('login.createAccount')}</Text>
                <Text style={styles.disabledEmail}>{email}</Text>
                {/* password */}
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: t('login.password') + ' ' + t('isRequired'),
                    minLength: {
                      value: 6,
                      message: t('login.password') + ' ' + t('min6Chars'),
                    },
                  }}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder={t('login.password')}
                      secureTextEntry
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.password && (
                  <Text style={styles.error}>{errors.password.message}</Text>
                )}
                {/* confirm password */}
                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required:
                      t('login.confirmPassword') + ' ' + t('isRequired'),
                    validate: v =>
                      v === password ||
                      t('login.password') + ' ' + t('mustMatch'),
                  }}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder={t('login.confirmPassword')}
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
                {/* name */}
                <Controller
                  control={control}
                  name="name"
                  rules={{
                    required: t('login.name') + ' ' + t('isRequired'),
                  }}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder={t('login.name')}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.name && (
                  <Text style={styles.error}>{errors.name.message}</Text>
                )}
                {/* phone */}
                <PhoneNumberInput
                  name="phoneNumber"
                  label={t('login.phoneNumber')}
                />
                {errors.phoneNumber && (
                  <Text style={styles.error}>{errors.phoneNumber.message}</Text>
                )}
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleSubmit(onSignup)}>
                  <Text style={styles.primaryText}>{t('login.signup')}</Text>
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
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
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
  languageSwitcherWrapper: {padding: 12, alignItems: 'flex-end'},
});

export default AuthFormScreen;
