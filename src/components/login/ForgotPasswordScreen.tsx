import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useForm, Controller, FormProvider} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import api from '../../api/axiosConfig';
import {ROUTES} from '../../constants/routes';
import LanguageSwitchDropdown from '../Reusables/LanguageSwitchDropdown';
import {useNavigation} from '@react-navigation/native';

const ForgotPasswordScreen: React.FC<{goBack?: any}> = ({goBack}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const methods = useForm();

  const {
    handleSubmit,
    formState: {errors},
    control,
    watch,
  } = methods;

  const handleSendOTP = async data => {
    setLoading(true);
    setError('');
    try {
      await api.post(ROUTES.SEND_OTP, {email: data.email});
      console.log(t('authModal.forgotPassword') + ': OTP sent');
      setStep(2);
    } catch (err: any) {
      setError(t('ResetPassword.error'));
      console.log(t('ResetPassword.error'), t('ResetPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      await api.post(ROUTES.VERIFY_OTP, {
        email: watch('email'),
        otp: data.otp,
      });
      console.log('OTP verified');
      setStep(3);
    } catch (err: any) {
      setError(t('ResetPassword.error'));
      console.log(t('ResetPassword.error'), t('ResetPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      const errorMessage = t('mustMatch');
      setError(errorMessage);
      console.log(t('ResetPassword.error'), errorMessage);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post(ROUTES.RESET_PASSWORD, {
        email: data?.email,
        password: data.password,
        otp: data?.otp,
      });
      console.log('Password reset');
      goBack();
    } catch (err: any) {
      setError(t('ResetPassword.error'));
      console.log(t('ResetPassword.error'), t('ResetPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <View style={styles.languageSwitcherWrapper}>
        <LanguageSwitchDropdown />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.box}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (goBack ? goBack() : navigation.goBack())}>
            <Text style={styles.backButtonText}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>{t('dashboard.resetPassword')}</Text>
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          {step === 1 && (
            <View style={styles.formGroup}>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: t('login.email') + ' ' + t('isRequired'),
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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
                <Text style={styles.errorText}>
                  {typeof errors.email.message === 'string'
                    ? errors.email.message
                    : ''}
                </Text>
              )}
              <TouchableOpacity
                style={styles.button}
                disabled={loading}
                onPress={handleSubmit(handleSendOTP)}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {t('authModal.forgotPassword')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          {step === 2 && (
            <View style={styles.formGroup}>
              <Controller
                control={control}
                name="otp"
                rules={{required: t('isRequired')}}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder={
                      t('authModal.enterVerificationCode') ||
                      'Enter verification code'
                    }
                    keyboardType="number-pad"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.otp && (
                <Text style={styles.errorText}>
                  {typeof errors.otp.message === 'string'
                    ? errors.otp.message
                    : ''}
                </Text>
              )}
              <TouchableOpacity
                style={styles.button}
                disabled={loading}
                onPress={handleSubmit(handleVerifyOTP)}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {t('authModal.continueJourney') || 'Continue'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          {step === 3 && (
            <View style={styles.formGroup}>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: t('isRequired'),
                  minLength: {value: 6, message: t('min6Chars')},
                }}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder={t('dashboard.resetPassword')}
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>
                  {typeof errors.password.message === 'string'
                    ? errors.password.message
                    : ''}
                </Text>
              )}
              <Controller
                control={control}
                name="confirmPassword"
                rules={{required: t('isRequired')}}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder={
                      t('dashboard.resetPassword') + ' (' + t('mustMatch') + ')'
                    }
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>
                  {typeof errors.confirmPassword.message === 'string'
                    ? errors.confirmPassword.message
                    : ''}
                </Text>
              )}
              <TouchableOpacity
                style={styles.button}
                disabled={loading}
                onPress={handleSubmit(handleResetPassword)}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {t('dashboard.resetPassword')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
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
  button: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageSwitcherWrapper: {padding: 12, alignItems: 'flex-end'},
  backButton: {
    position: 'relative',
    padding: 8,
  },
  backButtonText: {
    fontSize: 42,
    color: '#059669',
  },
});

export default ForgotPasswordScreen;
