import { Text, type TextProps, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const theme = useColorScheme();

  const color =
    theme === "dark" ? (darkColor ?? "#ffffff") : (lightColor ?? "#000000");

  return (
    <Text
      style={[
        { color },
        type === "title" && styles.title,
        type === "link" && styles.link,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  link: {
    color: "#0a7ea4",
    fontWeight: "600",
  },
});
