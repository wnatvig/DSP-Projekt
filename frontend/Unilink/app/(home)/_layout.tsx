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
      <Tabs >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={'#7393D8'}
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
          name="helpCenter"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="privacy"
          options={{
            href: null,
          }}
        />
        
        <Tabs.Screen
          name="TermsCondition"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={size}
                color={'#7393D8'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="chat"
          options={{
            title: "My chats",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "chatbubble" : "chatbubble-outline"}
                size={size}
                color={'#7393D8'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="myEvents"
          options={{
            title: "My events",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={size}
                color={'#7393D8'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={'#7393D8'}
              />
            ),
          }}
        />
      </Tabs>

      {/* Floating button */}
    </View>
  );
}
