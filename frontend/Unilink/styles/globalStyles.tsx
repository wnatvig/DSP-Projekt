import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  headerLogo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 170,
    marginTop: -120,
    position: "relative",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "black",
    opacity: 1,
    padding: 15,
    borderRadius: 10,
    width: 150,
    alignItems: "center",
    marginVertical: 5,
  },
  textbox: {
    height: 50,
    width: 250,
    paddingHorizontal: 12,
    borderRadius: 10,

    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ccc",

    color: "#222",
    fontSize: 16,

    marginBottom: 12,
  },
});
