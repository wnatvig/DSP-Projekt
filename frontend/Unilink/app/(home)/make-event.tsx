import { useState } from "react";
import { globalStyles } from "../../styles/globalStyles";
import {
  Pressable,
  Text,
  Button,
  StyleSheet,
  TextInput,
  View,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useAuth } from "@clerk/expo";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Create_Event() {
  const [message, setMessage] = useState("");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [place, setplace] = useState("");
  const [participants, setparticipants] = useState("");
  const [time, setTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { userId, isLoaded, isSignedIn } = useAuth();

  const create_account = async () => {
    if (!isLoaded || !isSignedIn) return;

    try {
      const response = await fetch(
        "http://ec2-51-20-64-6.eu-north-1.compute.amazonaws.com:3000/create_account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            description: description,
            time: time,
            place: place,
            participants: participants,
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
    <View style={globalStyles.container}>
      <Image
        source={require("@/assets/images/UniLinkLogo.png")}
        style={styles.headerLogo}
      />

      <TextInput
        placeholder="title"
        placeholderTextColor={"#222"}
        value={title}
        onChangeText={settitle}
        style={globalStyles.textbox}
      />

      <TextInput
        placeholder="description"
        placeholderTextColor={"#222"}
        value={description}
        onChangeText={setdescription}
        style={globalStyles.textbox}
      />

      <Text style={styles.label}>Time</Text>

      <Pressable style={styles.timeBox} onPress={() => setShowTimePicker(true)}>
        <Text style={time ? styles.timeText : styles.placeholderText}>
          {time
            ? time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Select time"}
        </Text>
      </Pressable>

      {showTimePicker && (
        <DateTimePicker
          value={time || new Date()}
          mode="time"
          display="default"
          is24Hour={true}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);

            if (event.type === "set" && selectedTime) {
              setTime(selectedTime);
            }
          }}
        />
      )}

      <TextInput
        placeholder="place"
        placeholderTextColor={"#222"}
        value={place}
        onChangeText={setplace}
        style={globalStyles.textbox}
      />

      <TextInput
        placeholder="participants"
        placeholderTextColor={"#222"}
        value={participants}
        onChangeText={setparticipants}
        style={globalStyles.textbox}
      />

      <View style={styles.BioContainer}>
        <View style={styles.inputWrapper}></View>
      </View>

      <Pressable style={styles.button} onPress={create_account}>
        <Text style={styles.buttonText}>Create event</Text>
      </Pressable>
    </View>
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
  timeBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: "center",
  },

  timeText: {
    fontSize: 15,
    color: "#111",
  },

  placeholderText: {
    fontSize: 15,
    color: "#999",
  },
});
