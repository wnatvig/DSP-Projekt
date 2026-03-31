import { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

export default function Create_Account() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


  const login = async () => {
    try{
        const response = await fetch('http://192.168.0.102:3000/login', {
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
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.textbox}
    />

    <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.textbox}
      />

      <TextInput
        placeholder="Gender"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.textbox}
      />
      <Button title="Create account" onPress={login} />
    </View>
  );

}

const styles = StyleSheet.create({
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