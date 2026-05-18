import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View, StyleSheet, Image, Alert } from "react-native";
import { useState, useEffect } from "react";


export default function EventDetailPage() {
  const router = useRouter();
  const { id, title, time, place, participants, max, photo } =
    useLocalSearchParams<{
      id: string;
      title?: string;
      time?: string;
      place?: string;
      participants?: string;
      max?: string;
      photo?: string;
    }>();

    // const [events, setEvents] = useState<EventItem[]>([])

  const [AllParticipants, setAllParticipants] = useState([
    {
      userId: 1,
      username: "maltes fitta"
    },
    {
      userId: 2,
      username: "maltes röv"
    }
  ]);

  const [message, setMessage] = useState("");


    const fetchParticipants = async () => {
      try {
        console.log("trying to fetch");
        const response = await fetch(
          `http://ec2-51-20-64-6.eu-north-1.compute.amazonaws.com:3000/events//:eventId/participants`,{
            method: "GET",
          },
        );
  
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        if(data.success){
          console.log("Event fetched");
        }else{
          console.log("error");
        }
        setAllParticipants(data);
        setMessage("Events updated");
      } catch (error) {
        setMessage("server error");
        console.log(error);
      }
    };

    useEffect(() => {
      fetchParticipants();
    }, []);

  const handleJoin = async () => {

    // const response = await fetch(
    //   "http://ec2-13-48-148-97.eu-north-1.compute.amazonaws.com:3000/events/join/${eventID}",
    // );
    const currentParticipants = Number(participants);
    const maxParticipants = Number(max);

    if (currentParticipants >= maxParticipants) {
      Alert.alert("Eventet är fullt", "Tyvärr finns det inga platser kvar.");
      return;
    }

    Alert.alert("Success!", "Du har gått med i eventet.", [
      {
        text: "To event chat",
        onPress: () =>
          router.push({
            pathname: "/event/chat",
            params: {
              eventId: id,
              title,
            },
          }),
      },
      {
        text: "Back to home",
        onPress: () => router.push("/"),
        style: "cancel",
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: title ?? `Event ${id}` }} />

      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        <View style={styles.header}>
          {photo && (
            <Image source={{ uri: String(photo) }} style={styles.avatar} />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardText}>Time: {time}</Text>
          <Text style={styles.cardText}>Place: {place}</Text>
          <Text style={styles.cardText}>
            Participants: {participants}/{max}
          </Text>

          
          <View style={styles.participantsBox}>
  <Text style={styles.participantsTitle}>Participants:</Text>

  {AllParticipants.length > 0 ? (
    AllParticipants.map((participant) => (
      <Text key={participant.userId} style={styles.participantText}>
        • {participant.username}
      </Text>
    ))
  ) : (
    <Text style={styles.participantText}>
      Inga deltagare ännu...
    </Text>
  )}
</View>
          <Pressable style={styles.chatButton} onPress={handleJoin}>
            <Text style={styles.chatButtonText}>Join Event</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    gap: 16,
    backgroundColor: '#E9D5FF',
    flex: 1
  },
  card: {
    backgroundColor: "#7393D8",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#fff",
  },
  cardText: {
    fontSize: 16,
    marginBottom: 6,
    color: "#fff",
  },
  backButton: {
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  chatButton: {
    marginTop: 16,
    backgroundColor: "#1D3557",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  chatButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  participantsBox: {
    marginTop: 16,
    backgroundColor: "#5E7FC9",
    borderRadius: 12,
    padding: 14,
  
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  
    elevation: 3,
  },
  
  participantsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  
  participantText: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 6,
  },
});
