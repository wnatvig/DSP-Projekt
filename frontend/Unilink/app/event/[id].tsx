import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View, StyleSheet } from "react-native";

export default function EventDetailPage() {
  const router = useRouter();
  const { id, title, time, place } = useLocalSearchParams<{
    id: string;
    title?: string;
    time?: string;
    place?: string;
  }>();

  return (
    <>
      <Stack.Screen options={{ title: title ?? `Event ${id}` }} />

      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardText}>Tid: {time}</Text>
          <Text style={styles.cardText}>Plats: {place}</Text>

          <Pressable
            style={styles.chatButton}
            onPress={() =>
              router.push({
                pathname: "/event/chat",
                params: {
                  eventId: id,
                  title,
                },
              })
            }
          >
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
});
