import { useState } from 'react';
import { Button, StyleSheet, TextInput, View, Text } from 'react-native';
import { Image } from 'expo-image';

export default function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


  const login = async () => {
    try{
        const response = await fetch('http://13.60.24.41:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
        });

        const data = await response.json();

        if (data.success) {
        console.log("Login success!");
        } else {
        console.log("Login failed");
        }
    } catch (error){
        setMessage("Network ERROR");
        console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
      <Image
        source={require('@/assets/images/react-logo.png')}
        style={styles.headerLogo}
       />
      <TextInput
        placeholder="Email"
        placeholderTextColor='#222'
        value={email}
        onChangeText={setEmail}
        style={styles.textbox}
      />

      <TextInput
          placeholder="Password"
          placeholderTextColor='#222'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.textbox}
      />
      <Button title="Login" onPress={login} />
      <Text
      style = {styles.text}>or</Text>
      <Button title="Create account" onPress={login} />
    </View>
  );

}

const styles = StyleSheet.create({

    text: {
      marginBottom: 0,
      color: 'white'
    },
    headerLogo: {
      width: 120,
      height: 120,
      resizeMode: 'contain',
      marginBottom: 170,
      marginTop: -120,
      position: 'relative'
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
    textbox: {
        height: 50,
        width: 250,
        paddingHorizontal: 12,
        borderRadius: 10,
        
      
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ccc',
      
        color: '#222',
        fontSize: 16,
        
      
        marginBottom: 12
      }
  });