import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { useAuth, useClerk } from "@clerk/expo";

type User = {
  username: string;
  gender: string;
  languages: string;
  bio?: string;
};

const ProfileScreen = () => {
  const { signOut } = useClerk();
  const { userId, getToken, isSignedIn } = useAuth();

  const [user, setUser] = useState<User | null>(null);

  // const [user, setUser] = useState<User | null>({
  //   username: "Viktor",
  //   gender: "male",
  //   languages: "Swedish, English",
  //   bio: "I love coding!",
  // });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚫 Don't run if auth isn't ready
    if (!isSignedIn) return;

    const fetchUser = async () => {
      try {
        const token = await getToken();

        const res = await fetch(`http://ec2-51-20-64-6.eu-north-1.compute.amazonaws.com:3000/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        if(data.success){
          console.log("Successss");
          console.log(JSON.stringify(data, null, 2));
        }
        setUser(data.data);
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

        <Text style={styles.username}>{user.username ||"Username"}</Text>
      </View>

      {/* STATS */}
      <View style={styles.section}>
      <Text style={styles.sectionTitle}>Gender</Text>
      <Text style={styles.bio}>{user.gender || "No bio yet."}</Text>
      <Text style={styles.sectionTitle}>Languages</Text>
      <Text style={styles.bio}>{user.languages || "No bio yet."}</Text>
      </View>

      {/* BIO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{user.bio || "No bio yet."}</Text>
      </View>

      <Pressable style={({ pressed }) => [
          styles.logoutButton,
          pressed && { opacity: 0.7 },
        ]} 
        onPress={() => signOut()}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9D5FF",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E9D5FF",
  },

  header: {
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 30,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,

    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 10,

    elevation: 6,
  },

  username: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1D3557",

    textShadowColor: "rgba(255,255,255,0.7)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 6,
  },

  email: {
    fontSize: 14,
    color: "#1D3557",
    opacity: 0.7,
    marginTop: 6,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#7393D8",
    borderRadius: 18,
    paddingVertical: 20,

    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 8,

    elevation: 5,
  },

  stat: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  statLabel: {
    fontSize: 13,
    color: "#DDE7FF",
    marginTop: 4,
  },

  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#7393D8",
    borderRadius: 18,
    padding: 20,

    elevation: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
    color: "#fff",
  },

  bio: {
    fontSize: 15,
    lineHeight: 24,
    color: "#fff",
    opacity: 0.95,
  },
  logoutButton: {
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: "#9370DB",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});