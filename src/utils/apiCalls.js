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

export const fetchPropertiesOfLoggedUser = async userId => {
  try {
    const response = await api.get(
      `${ROUTES.PROPERTIES}?userId=${userId ?? ''}`,
    );
    return response?.data?.properties;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const toggleListingInSavedListings = async (userId, propertyId) => {
  const {data} = await api.post(ROUTES.ADD_TO_SAVED_LISTINGS, {
    userId,
    propertyId,
  });
  return data;
};

export const fetchFavorites = async userId => {
  const {data} = await api.get(
    `${ROUTES.GET_USER_SAVED_LISTINGS}?userId=${userId}`,
  );
  return data;
};
