import { ThemedText } from "@/components/ThemedText.js";
import { ThemedView } from "@/components/ThemedView.js";
import { IconSymbol } from "@/components/ui/IconSymbol.js";
import { Colors } from "@/constants/Colors.js";
import { useColorScheme } from "@/hooks/useColorScheme.web.js";

import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Simulated recognition phrases
const RECOGNITION_PHRASES = [
  "Hello",
  "Thank you",
  "How are you?",
  "Nice to meet you",
  "Goodbye",
];

export default function SignLanguageTranslator() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const [facing, setFacing] = useState<CameraType>("front"); // Default to front camera for sign language
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const recordingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current);
      }
    };
  }, []);

  // Handle recording start
  const startRecording = () => {
    setIsRecording(true);
    setRecognizedText("");

    // Simulate 5 second recording
    recordingTimeout.current = setTimeout(() => {
      stopRecording();
    }, 5000);
  };

  // Handle recording stop
  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      // Get random phrase from our simulated recognition phrases
      const randomIndex = Math.floor(
        Math.random() * RECOGNITION_PHRASES.length
      );
      setRecognizedText(RECOGNITION_PHRASES[randomIndex]);
      setIsProcessing(false);
    }, 1500);
  };

  // Handle text-to-speech
  const speakText = () => {
    if (recognizedText) {
      Speech.speak(recognizedText, {
        language: "en",
        pitch: 1.0,
        rate: 0.9,
      });
    }
  };

  // Handle camera flip
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Permission not determined yet
  if (!permission) {
    return <ThemedView style={styles.container} />;
  }

  // Permission denied screen
  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Sign Language Translator",
            headerShown: true,
          }}
        />
        <ThemedText style={styles.message} type="subtitle">
          No camera access
        </ThemedText>
        <ThemedText style={styles.message}>
          We need camera access to record sign language gestures
        </ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
          onPress={requestPermission}
        >
          <ThemedText style={styles.buttonText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Sign Language Translator",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <IconSymbol
                name="chevron.right"
                size={24}
                color={Colors[colorScheme].text}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
              <ThemedText>Back</ThemedText>
            </TouchableOpacity>
          ),
        }}
      />

      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} />
      </View>

      {/* Camera Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleCameraFacing}
        >
          <ThemedText style={styles.controlText}>Flip Camera</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordingButton]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
        >
          <ThemedText style={styles.recordButtonText}>
            {isRecording ? "Stop" : "Record"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Recognition Results */}
      <ThemedView style={styles.resultsContainer}>
        <ThemedText type="subtitle">Recognized Text:</ThemedText>

        {isProcessing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
            <ThemedText>Processing...</ThemedText>
          </View>
        ) : (
          <ThemedView style={styles.recognizedTextContainer}>
            <ThemedText style={styles.recognizedText}>
              {recognizedText || "Record sign language to see results"}
            </ThemedText>
          </ThemedView>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
          onPress={speakText}
          disabled={!recognizedText || isProcessing}
        >
          <ThemedText style={styles.buttonText}>Speak Output</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  title: {
    textAlign: "center",
    marginVertical: 16,
  },
  message: {
    textAlign: "center",
    marginBottom: 16,
  },
  cameraContainer: {
    width: 300,
    height: 400,
    overflow: "hidden",
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 16,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  controlButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#555",
  },
  controlText: {
    color: "white",
    fontWeight: "bold",
  },
  recordButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#e74c3c",
  },
  recordingButton: {
    backgroundColor: "#c0392b",
  },
  recordButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  recognizedTextContainer: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    minHeight: 80,
    justifyContent: "center",
  },
  recognizedText: {
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
});
