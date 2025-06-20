import React, {useState} from 'react';
import {View, TextInput, Button, Alert} from 'react-native';
import {useMutation} from '@tanstack/react-query';
import {signup} from '../../utils/apiCalls';
import {useUser} from '../../context/UserContext';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const {loginUser} = useUser();

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: data => {
      loginUser(data?.user || {name: 'Signed up'});
    },
    onError: error => {},
  });

  const handleSignup = () => {
    signupMutation.mutate({name, email, phoneNumber, password});
  };

  return (
    <View style={{padding: 20}}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          marginVertical: 10,
          padding: 10,
          borderRadius: 5,
        }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          marginVertical: 10,
          padding: 10,
          borderRadius: 5,
        }}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={{
          borderWidth: 1,
          marginVertical: 10,
          padding: 10,
          borderRadius: 5,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          marginVertical: 10,
          padding: 10,
          borderRadius: 5,
        }}
      />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
};

export default SignupScreen;
