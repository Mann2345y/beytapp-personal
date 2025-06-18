import {launchImageLibrary} from 'react-native-image-picker';

export const pickImageFromLibrary = async () => {
  return new Promise((resolve, reject) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) {
          resolve(null);
        } else if (response.errorCode) {
          reject(response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          resolve(response.assets[0].uri);
        } else {
          resolve(null);
        }
      },
    );
  });
};
