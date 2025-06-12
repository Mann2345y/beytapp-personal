import React, {useState} from 'react';
import AuthFormScreen from '../../components/login/AuthFormScreen';
import ForgotPasswordScreen from '../../components/login/ForgotPasswordScreen';

const LoginScreen: React.FC = () => {
  const [showForgot, setShowForgot] = useState(false);

  return showForgot ? (
    <ForgotPasswordScreen onBack={() => setShowForgot(false)} />
  ) : (
    <AuthFormScreen setShowForgot={setShowForgot} />
  );
};

export default LoginScreen;
