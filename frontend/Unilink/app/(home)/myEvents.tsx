import { useUser, useAuth } from "@clerk/expo";
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
  const { userId } = useAuth();
  const router = useRouter();

  // const [events, setEvents] = useState<EventItem[]>([]);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Fysikplugg",
      time: "14:00",
      place: "Biblioteket",
      participants: "3",
      max: "5",
      photo:
        "https://ec2-13-48-148-97.eu-north-1.compute.amazonaws.com:3000/images/UniLinkLogo.png",
    },
    {
      id: 2,
      title: "Fysikplugg 2",
      time: "14:00",
      place: "Biblioteket",
      participants: "3",
      max: "5",
      photo:
        "https://ec2-13-48-148-97.eu-north-1.compute.amazonaws.com:3000/images/UniLinkLogo.png",
    }
  ]);
  const [message, setMessage] = useState("");

  const fetchMyEvents = async () => {
    try {
      if (!userId) return;

      const response = await fetch(
        `http://ec2-51-20-64-6.eu-north-1.compute.amazonaws.com:3000/events/my/${userId}`,
        {
          method: "GET",
        }
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
  }, [userId]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "My Events",
        }}
      />

        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.container}
        >

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
                  pathname: "/myEvent/[id]",
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
          <Text
          style={{
            color: "#1D3557",
            fontSize: 16,
            fontWeight: "600",
          }}
          >Du har inga events ännu...</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E9D5FF",
  },

  container: {
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D3557",

    textShadowColor: "rgba(255,255,255,0.7)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 6,
  },

  card: {
    backgroundColor: "#7393D8",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,

    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 8,

    elevation: 5,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#fff",
  },

  cardText: {
    fontSize: 16,
    marginBottom: 6,
    color: "#fff",
    opacity: 0.95,
  },
});
