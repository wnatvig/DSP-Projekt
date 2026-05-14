import { View, Text, StyleSheet, Switch, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter} from "expo-router";


export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ACCOUNT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>


        <Pressable style={styles.settingRow}  onPress={() =>
                router.push('/privacy')
              }>
          <View style={styles.leftSide}>
            <Ionicons name="lock-closed-outline" size={22} color="#fff" />
            <Text style={styles.settingText}>Privacy</Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#DDE7FF" />
        </Pressable>
      </View>

      {/* NOTIFICATIONS */}
      <View style={styles.section} >
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.settingRow}>
          <View style={styles.leftSide}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
            <Text style={styles.settingText}>Push Notifications</Text>
          </View>

          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>
      </View>

      {/* APP */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>

        <View style={styles.settingRow}>
          <View style={styles.leftSide}>
            <Ionicons name="moon-outline" size={22} color="#fff" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>

          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
          />
        </View>
      </View>

      {/* SUPPORT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <Pressable style={styles.settingRow} onPress={() =>
                router.push('/helpCenter')
              }>
          <View style={styles.leftSide}>
            <Ionicons name="help-circle-outline" size={22} color="#fff" />
            <Text style={styles.settingText}>Help Center</Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#DDE7FF" />
        </Pressable>

        <Pressable style={styles.settingRow} onPress={() =>
                router.push('/TermsCondition')
              }>
          <View style={styles.leftSide}>
            <Ionicons name="document-text-outline" size={22} color="#fff" />
            <Text style={styles.settingText}>Terms & Conditions</Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#DDE7FF" />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9D5FF",
  },

  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 18,
  },

  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1D3557",
    marginBottom: 10,

    textShadowColor: "rgba(255,255,255,0.7)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 6,
  },

  section: {
    backgroundColor: "#7393D8",
    borderRadius: 18,
    overflow: "hidden",

    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 8,

    elevation: 5,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#DDE7FF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },

  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  settingText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },

  logoutButton: {
    marginTop: 12,
    backgroundColor: "#1D3557",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    elevation: 6,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});