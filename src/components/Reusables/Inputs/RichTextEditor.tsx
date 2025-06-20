import React, {useRef} from 'react';
import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import {useFormContext, useController} from 'react-hook-form';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';

interface RichTextEditorProps {
  name: string;
  label?: string;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  name,
  label,
  placeholder,
}) => {
  const {control} = useFormContext();
  const {
    field: {onChange, value, onBlur},
    fieldState: {error},
  } = useController({name, control});
  const richText = useRef<RichEditor>(null);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.editorWrapper}>
        <RichEditor
          ref={richText}
          initialContentHTML={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder || 'Enter description...'}
          style={styles.editor}
          editorStyle={styles.editorBg}
          useContainer={true}
          pasteAsPlainText={true}
        />
      </View>
      <RichToolbar
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
        ]}
        style={styles.toolbar}
      />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: 16},
  label: {fontSize: 15, color: '#334155', marginBottom: 4},
  editorWrapper: {borderRadius: 8, overflow: 'hidden'},
  editor: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 8,
    fontSize: 15,
  },
  editorBg: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  toolbar: {
    backgroundColor: '#e0e7ef',
    borderRadius: 8,
    marginTop: 4,
  },
  errorText: {color: '#dc2626', fontSize: 13, marginTop: 4},
});

export default RichTextEditor;
