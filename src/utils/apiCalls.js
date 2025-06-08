import api from '../api/axiosConfig';

export const emailLogin = async ({identifier, password}) => {
  try {
    const res = await api.post('/auth/login', {email: identifier, password});
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const googleLogin = async idToken => {
  try {
    const res = await api.get(`/auth/google-callback?code=${idToken}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const signup = async ({name, email, phoneNumber, password}) => {
  const res = await api.post('/auth/signup', {
    name,
    email,
    phoneNumber,
    password,
  });
  return res.data;
};
