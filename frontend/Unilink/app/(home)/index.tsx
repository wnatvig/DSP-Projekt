import { Show, useUser, useClerk } from "@clerk/expo";
import { useRouter, Link, Stack } from "expo-router";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";import { useState, useEffect } from "react";
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

  const [events, setEvents] = useState<EventItem[]>([])

  // const [events, setEvents] = useState([
  //   {
  //     id: 1,
  //     title: "Fysikplugg",
  //     time: "14:00",
  //     place: "Biblioteket",
  //     participants: "3",
  //     max: "5",
  //     photo:
  //       "https://ec2-13-48-148-97.eu-north-1.compute.amazonaws.com:3000/images/UniLinkLogo.png",
  //   },
  //   {
  //     id: 2,
  //     title: "Fysikplugg 2",
  //     time: "14:00",
  //     place: "Biblioteket",
  //     participants: "3",
  //     max: "5",
  //     photo:
  //       "https://ec2-13-48-148-97.eu-north-1.compute.amazonaws.com:3000/images/UniLinkLogo.png",
  //   }
  // ]);

  const [message, setMessage] = useState("");

  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const fetchEvent = async () => {
    try {
      const filters = new URLSearchParams();
  
      if (searchTitle) {
        filters.append("eventName", searchTitle);
      }
  
      if (searchLocation) {
        filters.append("eventLocation", searchLocation);
      }
  
      const url = `http://ec2-13-48-148-97.eu-north-1.compute.amazonaws.com:3000/events/?${filters.toString()}`;
  
    
  
      const response = await fetch(url, {
        method: "GET",
      },);

      console.log(url);
  
      const data = await response.json();
  
      if (data.success) {
        console.log("SUCCESS");
        setEvents(data.data);
      }
  
    } catch (error) {
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

      <ScrollView style={{ backgroundColor: "#E9D5FF" }}
  contentContainerStyle={styles.container}>
        
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.title}>Lets join an event!</Text>

        <View style={styles.filterContainer}>
  <TextInput
    placeholder="Search title..."
    placeholderTextColor="#DDE7FF"
    value={searchTitle}
    onChangeText={setSearchTitle}
    style={styles.filterInput}
  />

  <TextInput
    placeholder="Search location..."
    placeholderTextColor="#DDE7FF"
    value={searchLocation}
    onChangeText={setSearchLocation}
    style={styles.filterInput}
  />

  <Pressable
    style={({ pressed }) => [
      styles.filterButton,
      pressed && { opacity: 0.7 },
    ]}
    onPress={fetchEvent}
  >
    <Ionicons name="search" size={20} color="white" />
    <Text style={styles.filterButtonText}>Search</Text>
  </Pressable>
</View>

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
        </Show>

      </ScrollView>
      <Pressable
        onPress={() => router.push("/make-event")}
        style={({ pressed }) => [
          styles.plusbutton,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={{ color: "white", fontSize: 36 }}>+</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 20,
    gap: 16,
    backgroundColor: '#E9D5FF',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#9370DB",
  },
  card: {
    backgroundColor: "#7393D8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: '#fff',
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#fff',
  },
  button: {
    backgroundColor: "#7393D8",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  plusbutton: {
    position: "absolute",
          bottom: 10, // 👈 adjust this
          right: 160,
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: "#9370DB",
          justifyContent: "center",
          alignItems: "center",
          elevation: 8, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
  },
  filterContainer: {
    backgroundColor: "#9370DB",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginTop: 20
  
  },
  
  filterInput: {
    backgroundColor: "#5E7FC9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 15,
  
    borderWidth: 2,
    borderColor: "#fff",
  },
  
  filterButton: {
    backgroundColor: "#1D3557",
    borderRadius: 12,
    paddingVertical: 12,
  
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
