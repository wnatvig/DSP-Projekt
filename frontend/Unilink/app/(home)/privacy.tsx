import { View, Text, StyleSheet } from "react-native";

export default function NotImplementedPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ännu inte implementerat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9D5FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  text: {
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
});