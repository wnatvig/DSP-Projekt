import { useState } from "react";
import { globalStyles } from "../../styles/globalStyles";
import {
  Pressable,
  Text,
  Button,
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Image } from "expo-image";
import Dropdown from "../../components/dropdown_menu";
import { router } from "expo-router";
import { useAuth } from "@clerk/expo";

export default function Create_Account() {
  const [message, setMessage] = useState("");
  const [username, setusername] = useState("");
  const [bio, setbio] = useState("");
  const [Gender, setGender] = useState("Gender");
  const { userId, isLoaded, isSignedIn } = useAuth();

  const create_account = async () => {
    if (!isLoaded || !isSignedIn) return;

    try {
      const response = await fetch(
        "http://ec2-51-20-64-6.eu-north-1.compute.amazonaws.com:3000/users/createUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            username: username,
            gender: Gender,
            bio: bio,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        console.log("Account created!");
        router.push("/");
      } else {
        console.log("Creation failed");
        router.push("/(home)");
      }
    } catch (error) {
      setMessage("Network ERROR");
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={globalStyles.container}>
        <Image
          source={require("@/assets/images/UniLinkLogo.png")}
          style={styles.headerLogo}
        />

        <Text style={styles.label}>
          Welcome to UNILINK, let's get to know you better!
        </Text>
        <TextInput
          placeholder="Name"
          placeholderTextColor={"#222"}
          value={username}
          onChangeText={setusername}
          style={globalStyles.textbox}
        />

        <Dropdown
          options={["Man", "Woman", "Other"]}
          selectedValue={Gender}
          onSelect={setGender}
        />

        <View style={styles.BioContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Bio:</Text>
            <TextInput
              style={styles.BioInput}
              placeholder="Write here..."
              placeholderTextColor={"#222"}
              multiline
              numberOfLines={6}
              onChangeText={setbio}
              value={bio}
            />
          </View>
        </View>

        <Pressable style={styles.button} onPress={create_account}>
          <Text style={styles.buttonText}>Create account</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 250,
    height: 50,
    borderRadius: 10,

    borderWidth: 2,
    borderColor: "#007AFF",

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "white",
    marginTop: 10,
  },

  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  headerLogo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 170,
    marginTop: -120,
    position: "relative",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    position: "absolute",
  },
  BioContainer: {
    width: "100%",
    alignItems: "center",
  },
  BioInput: {
    width: "100%",
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "white",
    textAlignVertical: "top",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  inputWrapper: {
    width: "90%",
  },
});
