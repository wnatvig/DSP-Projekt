import { useAuth } from "@clerk/expo";
import { Redirect, Tabs, router } from "expo-router";
import { View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Tabs */}
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="make-event"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "settings",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        
        <Tabs.Screen
          name="chat"
          options={{
            title: "my chats",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "chatbubble" : "chatbubble-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="myEvents"
          options={{
            title: "my events",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      {/* Floating button */}
      <Pressable
        onPress={() => router.push("/make-event")}
        style={{
          position: "absolute",
          bottom: 100, // 👈 adjust this
          right: 30,
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
          elevation: 8, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Text style={{ color: "white", fontSize: 36 }}>+</Text>
      </Pressable>
    </View>
  );
}
