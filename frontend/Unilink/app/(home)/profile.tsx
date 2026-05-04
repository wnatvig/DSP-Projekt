import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useAuth } from "@clerk/expo";

type User = {
  username: string;
  gender: string;
  languages: string;
  bio?: string;
};

const ProfileScreen = () => {
  const { getToken, isSignedIn } = useAuth();

  //const [user, setUser] = useState<User | null>(null);

  const [user, setUser] = useState<User | null>({
    username: "hej",
    gender: "male",
    languages: "Swedish, English",
    bio: "I love coding!",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚫 Don't run if auth isn't ready
    if (!isSignedIn) return;

    const fetchUser = async () => {
      try {
        const token = await getToken();

        const res = await fetch("http://YOUR_BACKEND_URL/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isSignedIn]); // ✅ important dependency

  // 🔄 Loading state
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 🚫 Not signed in
  if (!isSignedIn) {
    return (
      <View style={styles.center}>
        <Text>You are not signed in.</Text>
      </View>
    );
  }

  // 🚫 No user data
  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Could not load profile</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/UniLinkLogo.png")}
          style={styles.avatar}
        />

        <Text style={styles.username}>{user.username}</Text>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}></View>

      {/* BIO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{user.bio || "No bio yet."}</Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: "600",
  },
  email: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "600",
  },
  statLabel: {
    fontSize: 12,
    color: "gray",
  },
  section: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
});
