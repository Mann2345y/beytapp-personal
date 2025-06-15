import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {useController, useFormContext} from 'react-hook-form';

interface FileUploadProps {
  name: string;
  label?: string;
  placeholder?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({name, label, placeholder}) => {
  const {control} = useFormContext();
  const {
    field: {onChange, value},
    fieldState: {error},
  } = useController({name, control});

  const pickImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 0,
    }; // 0 = unlimited
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }
      if (response.assets && response.assets.length > 0) {
        // If value is already an array, append; otherwise, start new array
        const uris = response.assets.map(asset => asset.uri).filter(Boolean);
        if (Array.isArray(value)) {
          onChange([...value, ...uris]);
        } else {
          onChange(uris);
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>{placeholder || 'Select Image'}</Text>
      </TouchableOpacity>
      {Array.isArray(value) && value.length > 0 ? (
        <View style={styles.imagesRow}>
          {value.map((uri: string, idx: number) => (
            <Image key={uri + idx} source={{uri}} style={styles.image} />
          ))}
        </View>
      ) : null}
      {error && (
        <Text style={{color: '#dc2626', fontSize: 13, marginTop: 4}}>
          {error.message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: 16},
  label: {fontSize: 15, color: '#334155', marginBottom: 4},
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  imagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
});

export default FileUpload;
