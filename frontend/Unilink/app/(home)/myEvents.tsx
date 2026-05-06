import { useUser } from "@clerk/expo";
import { useRouter, Stack } from "expo-router";
import { Text, View, Pressable, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";

type EventItem = {
  id: number;
  title: string;
  time: string;
  place: string;
  participants: string;
  max: string;
  photo: string;
  creatorId?: string;
  userId?: string;
};

export default function MyEventsPage() {
  const { user } = useUser();
  const router = useRouter();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [message, setMessage] = useState("");

  const fetchMyEvents = async () => {
    try {
      if (!user?.id) return;

      const response = await fetch(
        `http://ec2-13-48-148-97.eu-north-1.compute.amazonaws.com:3000/events/my/${user.id}`,
      );

      const data = await response.json();

      setEvents(data);
      setMessage("My events updated");
    } catch (error) {
      setMessage("server error");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, [user?.id]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "My Events",
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>My Events</Text>

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
          <Text>Du har inga events ännu...</Text>
        )}
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
});
