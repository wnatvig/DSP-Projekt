import { Show, useUser, useClerk } from "@clerk/expo";
import { useRouter, Link, Stack } from "expo-router";
import { Text, View, Pressable, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

type EventItem = {
  id: number;
  title: string;
  time: string;
  place: string;
  participants: string;
  max: string;
  photo: string;
};

export default function Page() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  // const [events, setEvents] = useState<EventItem[]>([])

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Fysikplugg",
      time: "14:00",
      place: "Biblioteket",
      participants: "5",
      max: "5",
      photo:
        "https://ec2-13-48-148-97.eu-north-1.compute.amazonaws.com:3000/images/UniLinkLogo.png",
    },
  ]);

  const [message, setMessage] = useState("");

  const fetchEvent = async () => {
    try {
      const response = await fetch(
        "http://ec2-13-48-148-97.eu-north-1.compute.amazonaws.com:3000/events",
      );

      const data = await response.json();
      setEvents(data);
      setMessage("Events updated");
    } catch (error) {
      setMessage("server error");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Home",
          headerRight: () => (
            <Pressable onPress={fetchEvent} style={{ marginRight: 15 }}>
              <Ionicons name="refresh" size={24} color="black" />
            </Pressable>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.title}>Lets join an event!</Text>

        {message ? <Text>{message}</Text> : null}

        {events.length > 0 ? (
          events.map((event) => (
            <Pressable
              key={event.id}
              style={({ pressed }) => [
                styles.card,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/event/[id]",
                  params: {
                    id: event.id,
                    title: event.title,
                    time: event.time,
                    place: event.place,
                    participants: event.participants,
                    max: event.max,
                    photo: event.photo,
                  },
                })
              }
            >
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardText}>Tid: {event.time}</Text>
              <Text style={styles.cardText}>Plats: {event.place}</Text>
            </Pressable>
          ))
        ) : (
          <Text>Inga events ännu...</Text>
        )}

        <Show when="signed-out">
          <Link href="/(auth)/sign-in">
            <Text>Sign in</Text>
          </Link>
          <Link href="/(auth)/sign-up">
            <Text>Sign up</Text>
          </Link>
        </Show>

        <Show when="signed-in">
          <Text>Signed in as {user?.emailAddresses[0].emailAddress}</Text>
          <Pressable style={styles.button} onPress={() => signOut()}>
            <Text style={styles.buttonText}>Sign out</Text>
          </Pressable>
        </Show>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
