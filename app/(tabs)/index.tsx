import { HelloWave } from "@/components/HelloWave.js";
import { ThemedText } from "@/components/ThemedText.js";
import { ThemedView } from "@/components/ThemedView.js";
import { Colors } from "@/constants/Colors.js";
import { useColorScheme } from "@/hooks/useColorScheme.web.js";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to SyngLanguage</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedText style={styles.description}>
        A Sign Language Translator prototype that records short sign language
        videos, simulates recognition, and converts it to speech.
      </ThemedText>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
        onPress={() => router.push("/translator")}
      >
        <ThemedText style={styles.buttonText}>Start Translator</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 40,
  },
  description: {
    textAlign: "center",
    marginBottom: 40,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
});
