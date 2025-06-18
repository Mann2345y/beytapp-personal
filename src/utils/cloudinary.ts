import api from '../api/axiosConfig';

export const uploadImage = async (file: any) => {
  const folder = 'uploads';
  if (!file) {
    throw new Error('No file provided for upload.');
  }
  const fileNameWithoutExt = file.split('/').pop().split('.')[0];
  const publicId = `${folder}/${fileNameWithoutExt}`;
  const signatureRes = await api.post('/upload/generate-signature', {
    folder,
    public_id: publicId,
  });
  const {signature, timestamp, apiKey, cloudName} = signatureRes.data;
  const formData = new FormData();
  formData.append('file', {
    uri: file,
    type: 'image/jpeg',
    name: file.split('/').pop(),
  });
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('folder', folder);
  formData.append('public_id', publicId);
  formData.append('signature', signature);
  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const uploadRes = await api.post(cloudinaryUploadUrl, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
  return uploadRes.data.secure_url;
};

export const uploadImagesCall = async (images: any) => {
  const urls = [];
  for (const img of images) {
    const url = await uploadImage(img);
    urls.push(url);
  }
  return urls;
};
