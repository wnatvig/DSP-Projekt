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
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useAuth } from "@clerk/expo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Background } from "@react-navigation/elements";

export default function Create_Event() {
  const [message, setMessage] = useState("");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [place, setplace] = useState("");
  const [participants, setparticipants] = useState("");
  const [time, setTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { userId, isLoaded, isSignedIn } = useAuth();

  const create_event = async () => {
    if (!isLoaded || !isSignedIn) return;
    if(title == "" || description == "" || place == "" || participants == "" || time == null) 
      {setMessage("Fill in all fields before creating!")
        return};

    try {
      const response = await fetch(
        "http://ec2-51-20-64-6.eu-north-1.compute.amazonaws.com:3000/events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: {
              userId: userId,
              eventName: title,
              eventDescription: description,
              eventDate: time?.toISOString(),
              eventImage: null,
              eventLocation: place,
              maxParticipants: Number(participants),
              currentParticipants: 1
            },
          
            user: {
              userId: userId,
            },
          }),
        },
      );
      //eventId, userId, eventName, eventDescription, eventDate, eventImage, eventLocation, maxParticipants, currentParticipants
      const data = await response.json();

      console.log("SERVER RESPONSE:");
      console.log(JSON.stringify(data, null, 2))

      if (data.success) {
        console.log("Event created!");
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
      <View style={styles.container}>
        <View style={styles.container}>
          <Image
            source={require("@/assets/images/UniLinkLogo.png")}
            style={styles.headerLogo}
          />

          <TextInput
            placeholder="Title"
            placeholderTextColor={"#222"}
            value={title}
            onChangeText={settitle}
            style={globalStyles.textbox}
          />

          <TextInput
            placeholder="Description"
            placeholderTextColor={"#222"}
            value={description}
            onChangeText={setdescription}
            style={globalStyles.textbox}
          />

          <Pressable
            style={styles.timeBox}
            onPress={() => setShowTimePicker(true)}
          >
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
            placeholder="Place"
            placeholderTextColor={"#222"}
            value={place}
            onChangeText={setplace}
            style={globalStyles.textbox}
          />
          <TextInput
            value={participants}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, "");
              setparticipants(onlyNumbers.slice(0, 2));
            }}
            keyboardType="numeric"
            placeholder="Participants"
            placeholderTextColor={"#222"}
            maxLength={2}
            style={globalStyles.textbox}
          />

          <View style={styles.BioContainer}>
            <View style={styles.inputWrapper}></View>
          </View>

          {message ? (
  <Text style={styles.errorText}>{message}</Text>
) : null}


          <Pressable style={styles.button} onPress={create_event}>
            <Text style={styles.buttonText}>Create event</Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({

  container: {
    padding: 20,
    paddingTop: 100,
    gap: 11,
    backgroundColor: '#E9D5FF',
    flex: 1
  },
  button: {
    width: 310,
    height: 50,
    borderRadius: 10,

    borderWidth: 2,
    borderColor: "#007AFF",

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "white",
    marginTop: -20,
    marginBottom: 40,
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
    marginBottom: 30,
    marginTop: -60,
    position: "absolute",
    left: 110,
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
    height: 50,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: "center",
    marginBottom: 0,
  },

  timeText: {
    fontSize: 15,
    color: "#111",
  },

  placeholderText: {
    fontSize: 15,
    color: "#999",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    marginTop: -20,
    paddingBottom: -30,
    fontSize: 14,
    flex: 1
  },
});
