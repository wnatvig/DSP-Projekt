import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View, StyleSheet, Image, Alert } from "react-native";

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

  const handleJoin = () => {
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
      { text: "Back to home",
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
          <Text style={styles.cardText}>Tid: {time}</Text>
          <Text style={styles.cardText}>Plats: {place}</Text>
          <Text style={styles.cardText}>
            Deltagare: {participants}/{max}
          </Text>

          <Pressable style={styles.chatButton} onPress={handleJoin}>
            <Text style={styles.chatButtonText}>join</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 6,
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
    backgroundColor: "#111",
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
});
