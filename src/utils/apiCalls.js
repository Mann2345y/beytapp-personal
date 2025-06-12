import api from '../api/axiosConfig';
import {ROUTES} from '../constants/routes';

export const emailLogin = async ({identifier, password}) => {
  try {
    const res = await api.post(ROUTES.AUTH_LOGIN, {
      email: identifier,
      password,
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const googleLogin = async idToken => {
  try {
    const res = await api.get(`${ROUTES.GOOGLE_CALLBACK}?code=${idToken}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const signup = async ({name, email, phoneNumber, password}) => {
  const res = await api.post(ROUTES.AUTH_SIGNUP, {
    name,
    email,
    phoneNumber,
    password,
  });
  return res.data;
};
